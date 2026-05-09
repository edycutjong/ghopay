import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { CloakService } from './cloak';

// --- Shared Mock State ---
const mockState = {
  fsReadError: false,
  mockKeypair: JSON.stringify(Array(64).fill(0)),
};

// Mock fs globally for dynamic imports
vi.mock('fs', () => ({
  readFileSync: vi.fn(() => {
    if (mockState.fsReadError) throw new Error('Mock FS Error');
    return mockState.mockKeypair;
  }),
}));

// Mock all Cloak SDK imports — we don't want real on-chain calls in tests
vi.mock('@cloak.dev/sdk', () => ({
  CLOAK_PROGRAM_ID: { toBase58: () => 'zh1eLd6rSphLejbFfJEneUwzHRfMKxgzrgkfwA6qRkW' },
  NATIVE_SOL_MINT: { toBase58: () => 'So11111111111111111111111111111111111111112' },
  createUtxo: vi.fn().mockResolvedValue({ amount: 1000000n }),
  createZeroUtxo: vi.fn().mockResolvedValue({ amount: 0n }),
  generateUtxoKeypair: vi.fn().mockResolvedValue({
    publicKey: new Uint8Array(32),
    privateKey: new Uint8Array(32),
  }),
  getNkFromUtxoPrivateKey: vi.fn().mockReturnValue(new Uint8Array(32)),
  transact: vi.fn().mockResolvedValue({
    outputUtxos: [{ amount: 1000000n }],
    merkleTree: {},
  }),
  fullWithdraw: vi.fn().mockResolvedValue({ signature: 'mockWithdrawSig' }),
  scanTransactions: vi.fn().mockResolvedValue([]),
  toComplianceReport: vi.fn().mockReturnValue({
    summary: {
      totalDeposits: 0,
      totalWithdrawals: 0,
      totalFees: 0,
      netChange: 0,
      transactionCount: 0,
      finalBalance: 0,
    },
    transactions: [],
  }),
}));

vi.mock('@solana/web3.js', () => {
  class MockConnection {
    rpcEndpoint = 'mock';
    constructor() {}
  }
  return {
    Connection: MockConnection,
    Keypair: {
      fromSecretKey: vi.fn().mockReturnValue({
        publicKey: { toBase58: () => 'MockPublicKey123' },
        secretKey: new Uint8Array(64),
      }),
      generate: vi.fn().mockReturnValue({
        publicKey: {
          toBase58: () => 'StealthAddr' + Math.random().toString(36).slice(2, 10),
        },
      }),
    },
    PublicKey: vi.fn().mockImplementation((s: string) => ({ toBase58: () => s })),
  };
});

describe('CloakService', () => {
  let service: CloakService;

  beforeEach(() => {
    service = new CloakService();
    mockState.fsReadError = false;
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe('init()', () => {
    it('does not throw on first call', async () => {
      await expect(service.init()).resolves.toBeUndefined();
    });

    it('is idempotent — calling twice is safe', async () => {
      await service.init();
      await expect(service.init()).resolves.toBeUndefined();
    });

    it('defaults to demo mode when no KEYPAIR_PATH is set', async () => {
      await service.init();
      expect(service.isLive).toBe(false);
    });

    it('handles environments where process is undefined', async () => {
      vi.stubGlobal('process', undefined);
      const localService = new CloakService();
      await localService.init();
      expect(localService.isLive).toBe(false);
      vi.unstubAllGlobals();
    });
  });

  describe('executeStealthBatch() — demo mode', () => {
    it('returns a txHash and one result per transaction', async () => {
      const transactions = [
        { recipient: 'Alice', amount: '5000 USDC' },
        { recipient: 'Bob', amount: '4500 USDC' },
      ];

      const { txHash, results } = await service.executeStealthBatch(transactions);

      expect(typeof txHash).toBe('string');
      expect(txHash.length).toBe(88);
      expect(results).toHaveLength(2);
    }, 10000);

    it('each result preserves recipient and amount and adds a stealthAddress', async () => {
      const transactions = [{ recipient: 'Charlie', amount: '3800 USDC' }];

      const { results } = await service.executeStealthBatch(transactions);

      expect(results[0].recipient).toBe('Charlie');
      expect(results[0].amount).toBe('3800 USDC');
      expect(typeof results[0].stealthAddress).toBe('string');
      expect(results[0].stealthAddress.length).toBe(44);
    }, 10000);

    it('txHash contains only base58 characters', async () => {
      const { txHash } = await service.executeStealthBatch([{ recipient: 'X', amount: '1' }]);

      expect(txHash).toMatch(/^[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]+$/);
    }, 10000);

    it('handles an empty transaction list', async () => {
      const { txHash, results } = await service.executeStealthBatch([]);

      expect(typeof txHash).toBe('string');
      expect(results).toHaveLength(0);
    }, 10000);
  });

  describe('generateViewingKey() — demo mode', () => {
    it('returns a string prefixed with cloak_vk_', async () => {
      const key = await service.generateViewingKey();

      expect(key).toMatch(/^cloak_vk_/);
    }, 10000);

    it('the suffix is 32 base58 characters', async () => {
      const key = await service.generateViewingKey();

      const suffix = key.replace('cloak_vk_', '');
      expect(suffix).toHaveLength(32);
      expect(suffix).toMatch(/^[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]+$/);
    }, 10000);

    it('generates unique keys on successive calls', async () => {
      const key1 = await service.generateViewingKey();
      const key2 = await service.generateViewingKey();

      expect(key1).not.toBe(key2);
    }, 15000);
  });

  describe('scanHistory() — demo mode', () => {
    it('returns null in demo mode', async () => {
      const result = await service.scanHistory();
      expect(result).toBeNull();
    }, 10000);
  });

  describe('Live Mode', () => {
    beforeEach(() => {
      vi.stubEnv('KEYPAIR_PATH', '/mock/path/to/keypair.json');
      mockState.fsReadError = false;
    });

    it('initializes in live mode when KEYPAIR_PATH is set', async () => {
      await service.init();
      expect(service.isLive).toBe(true);
    });

    it('executes real on-chain shielded transfers in live mode', async () => {
      const transactions = [{ recipient: 'Alice', amount: '5000 USDC' }];
      const result = await service.executeStealthBatch(transactions);

      expect(result.txHash).toBe('mockWithdrawSig');
      expect(result.results).toHaveLength(1);
      expect(result.results[0].recipient).toBe('Alice');
      expect(result.results[0].stealthAddress).toBeDefined();
    });

    it('generates a real viewing key in live mode', async () => {
      const key = await service.generateViewingKey();
      // nk is 32 bytes, hex encoded is 64 chars
      expect(key).toMatch(/^cloak_vk_[0-9a-f]{64}$/);
    });

    it('scans history and returns a report in live mode', async () => {
      const report = await service.scanHistory();
      expect(report).toBeDefined();
      expect(report?.transactions).toEqual([]);
    });

    it('handles keypair load failure gracefully', async () => {
      mockState.fsReadError = true;
      await service.init();
      expect(service.isLive).toBe(false);
    });

    it('executes batch without viewing key if viewingKeyNk is null', async () => {
      await service.init();
      // Manually clear private viewingKeyNk to test the branch
      (service as unknown as { viewingKeyNk: Uint8Array | null }).viewingKeyNk = null;
      const transactions = [{ recipient: 'Alice', amount: '1000 USDC' }];
      const result = await service.executeStealthBatch(transactions);
      expect(result.txHash).toBe('mockWithdrawSig');
    });
  });

  describe('PROGRAM_ID', () => {
    it('returns the expected program ID', () => {
      const id = CloakService.PROGRAM_ID;
      expect(id.toBase58()).toBe('zh1eLd6rSphLejbFfJEneUwzHRfMKxgzrgkfwA6qRkW');
    });
  });
});
