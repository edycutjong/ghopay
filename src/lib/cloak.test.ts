import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CloakService, cloakService } from './cloak';

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
    summary: 'No transactions found',
    transactions: [],
  }),
}));

vi.mock('@solana/web3.js', () => {
  class MockConnection {
    rpcEndpoint = 'mock';
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
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
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

  describe('static properties', () => {
    it('exposes PROGRAM_ID', () => {
      expect(CloakService.PROGRAM_ID.toBase58()).toBe('zh1eLd6rSphLejbFfJEneUwzHRfMKxgzrgkfwA6qRkW');
    });
  });

  describe('singleton cloakService export', () => {
    it('is an instance of CloakService', () => {
      expect(cloakService).toBeInstanceOf(CloakService);
    });
  });
});
