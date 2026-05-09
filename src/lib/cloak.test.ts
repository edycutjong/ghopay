import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CloakService, cloakService } from './cloak';

// Speed up timers
vi.useFakeTimers();

describe('CloakService', () => {
  let service: CloakService;

  beforeEach(() => {
    service = new CloakService();
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  describe('init()', () => {
    it('does not throw when window.solana is absent', () => {
      expect(() => service.init()).not.toThrow();
    });

    it('is idempotent — calling twice is safe', () => {
      service.init();
      expect(() => service.init()).not.toThrow();
    });

    it('initializes cloakClient if window.solana is present', () => {
      // Mock window.solana
      const originalWindow = globalThis.window;
      (globalThis as unknown as Record<string, unknown>).window = { solana: {} };
      
      expect(() => service.init()).not.toThrow();
      expect(() => service.init()).not.toThrow(); // Should hit the early return
      
      // Cleanup
      (globalThis as unknown as Record<string, unknown>).window = originalWindow;
    });

    it('does not initialize cloakClient if window.solana is missing', () => {
      // Mock window without solana
      const originalWindow = globalThis.window;
      (globalThis as unknown as Record<string, unknown>).window = {};
      
      expect(() => service.init()).not.toThrow();
      
      // Cleanup
      (globalThis as unknown as Record<string, unknown>).window = originalWindow;
    });


    it('catches and logs a warning if accessing window throws', () => {
      const originalWindowDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'window');
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      Object.defineProperty(globalThis, 'window', {
        get() {
          throw new Error('Access denied');
        },
        configurable: true
      });

      service.init();
      expect(consoleWarnSpy).toHaveBeenCalledWith("[Cloak SDK] Provider not found, using fallback mode");

      // Cleanup
      if (originalWindowDescriptor) {
        Object.defineProperty(globalThis, 'window', originalWindowDescriptor);
      } else {
        delete (globalThis as { window?: unknown }).window;
      }
      consoleWarnSpy.mockRestore();
    });
  });

  describe('executeStealthBatch()', () => {
    it('returns a txHash and one result per transaction', async () => {
      const transactions = [
        { recipient: 'Alice', amount: '5000 USDC' },
        { recipient: 'Bob', amount: '4500 USDC' },
      ];

      const promise = service.executeStealthBatch(transactions);
      vi.advanceTimersByTime(2000);
      const { txHash, results } = await promise;

      expect(typeof txHash).toBe('string');
      expect(txHash.length).toBe(88);
      expect(results).toHaveLength(2);
    });

    it('each result preserves recipient and amount and adds a stealthAddress', async () => {
      const transactions = [{ recipient: 'Charlie', amount: '3800 USDC' }];

      const promise = service.executeStealthBatch(transactions);
      vi.advanceTimersByTime(2000);
      const { results } = await promise;

      expect(results[0].recipient).toBe('Charlie');
      expect(results[0].amount).toBe('3800 USDC');
      expect(typeof results[0].stealthAddress).toBe('string');
      expect(results[0].stealthAddress.length).toBe(44);
    });

    it('txHash contains only base58 characters', async () => {
      const promise = service.executeStealthBatch([{ recipient: 'X', amount: '1' }]);
      vi.advanceTimersByTime(2000);
      const { txHash } = await promise;

      expect(txHash).toMatch(/^[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]+$/);
    });

    it('handles an empty transaction list', async () => {
      const promise = service.executeStealthBatch([]);
      vi.advanceTimersByTime(2000);
      const { txHash, results } = await promise;

      expect(typeof txHash).toBe('string');
      expect(results).toHaveLength(0);
    });
  });

  describe('generateViewingKey()', () => {
    it('returns a string prefixed with cloak_vk_', async () => {
      const promise = service.generateViewingKey();
      vi.advanceTimersByTime(1000);
      const key = await promise;

      expect(key).toMatch(/^cloak_vk_/);
    });

    it('the suffix is 32 base58 characters', async () => {
      const promise = service.generateViewingKey();
      vi.advanceTimersByTime(1000);
      const key = await promise;

      const suffix = key.replace('cloak_vk_', '');
      expect(suffix).toHaveLength(32);
      expect(suffix).toMatch(/^[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]+$/);
    });

    it('generates unique keys on successive calls', async () => {
      const p1 = service.generateViewingKey();
      vi.advanceTimersByTime(1000);
      const key1 = await p1;

      const p2 = service.generateViewingKey();
      vi.advanceTimersByTime(1000);
      const key2 = await p2;

      expect(key1).not.toBe(key2);
    });
  });

  describe('singleton cloakService export', () => {
    it('is an instance of CloakService', () => {
      expect(cloakService).toBeInstanceOf(CloakService);
    });
  });
});
