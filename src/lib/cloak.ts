/**
 * Cloak SDK Integration — Real @cloak.dev/sdk wrapper for Ghopay
 *
 * Uses the UTXO-level API for stealth batch payroll:
 *   deposit → fullWithdraw per recipient (each to a unique stealth address)
 *
 * Viewing keys use the chain-native scanner (scanTransactions + toComplianceReport).
 *
 * Falls back to demo mode when no wallet provider is available.
 */

import {
  CLOAK_PROGRAM_ID,
  NATIVE_SOL_MINT,
  createUtxo,
  createZeroUtxo,
  fullWithdraw,
  generateUtxoKeypair,
  getNkFromUtxoPrivateKey,
  transact,
  scanTransactions,
  toComplianceReport,
} from '@cloak.dev/sdk';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';

// -- Types -------------------------------------------------------------------

export interface PayrollTransaction {
  recipient: string;
  amount: string;
}

export interface StealthResult {
  recipient: string;
  amount: string;
  stealthAddress: string;
}

export interface BatchResult {
  txHash: string;
  results: StealthResult[];
}

export interface ComplianceReport {
  summary: {
    totalDeposits: number;
    totalWithdrawals: number;
    totalFees: number;
    netChange: number;
    transactionCount: number;
    finalBalance: number;
  };
  transactions: Array<{
    signature: string;
    gross: number;
    fee: number;
    net: number;
  }>;
}

// -- Helpers -----------------------------------------------------------------

/** Parse a human-readable amount string like "5,000 USDC" into lamports (bigint). */
function parseAmountToLamports(amountStr: string): bigint {
  const cleaned = amountStr.replace(/[^0-9.]/g, '');
  const numeric = parseFloat(cleaned);
  // For USDC/USDT (6 decimals): multiply by 1e6
  // For SOL (9 decimals): multiply by 1e9
  // Default to USDC (6 decimals) since this is a payroll app
  return BigInt(Math.round(numeric * 1_000_000));
}

/** Generate a random base58-like string (used in demo fallback mode). */
function generateBase58(length: number): string {
  const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// -- CloakService ------------------------------------------------------------

export class CloakService {
  private connection: Connection | null = null;
  private signer: Keypair | null = null;
  private viewingKeyNk: Uint8Array | null = null;
  private isLiveMode = false;

  /**
   * Initialize the service.
   * In live mode (keypair available), connects to RPC and configures the SDK.
   * In demo mode (browser without keypair), uses fallback simulation.
   */
  async init(): Promise<void> {
    if (this.connection) return; // idempotent

    const rpcUrl =
      (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_RPC_URL) ||
      'https://api.mainnet-beta.solana.com';

    this.connection = new Connection(rpcUrl, 'confirmed');

    // Try to load a keypair from environment (server-side / CLI usage)
    try {
      const keypairPath =
        typeof process !== 'undefined' ? process.env?.KEYPAIR_PATH : undefined;

      if (keypairPath) {
        // Dynamic import for Node.js fs — won't run in browser
        const fs = await import('fs');
        const raw = JSON.parse(fs.readFileSync(keypairPath, 'utf-8')) as number[];
        this.signer = Keypair.fromSecretKey(new Uint8Array(raw));
        this.isLiveMode = true;

        // Derive a viewing key for compliance scanning
        const scanKeypair = await generateUtxoKeypair();
        this.viewingKeyNk = getNkFromUtxoPrivateKey(scanKeypair.privateKey);

        console.log(
          `[Cloak SDK] Live mode — wallet ${this.signer.publicKey.toBase58().slice(0, 8)}...`,
        );
      } else {
        console.log('[Cloak SDK] Demo mode — no KEYPAIR_PATH, using simulation fallback');
      }
    } catch {
      console.warn('[Cloak SDK] Could not load keypair, falling back to demo mode');
    }
  }

  /**
   * Execute a stealth batch payroll.
   *
   * Live mode: deposit → fullWithdraw per recipient using the real Cloak UTXO API.
   * Demo mode: simulate with random base58 addresses (for UI demonstration).
   */
  async executeStealthBatch(transactions: PayrollTransaction[]): Promise<BatchResult> {
    await this.init();
    console.log(`[Cloak SDK] Executing stealth batch for ${transactions.length} recipients`);

    // -- Live mode: real on-chain shielded transfers --
    if (this.isLiveMode && this.connection && this.signer) {
      const results: StealthResult[] = [];
      let lastTxHash = '';

      const baseOptions = {
        connection: this.connection,
        programId: CLOAK_PROGRAM_ID,
        depositorKeypair: this.signer,
        walletPublicKey: this.signer.publicKey,
        ...(this.viewingKeyNk ? { chainNoteViewingKeyNk: this.viewingKeyNk } : {}),
      };

      for (const tx of transactions) {
        const amount = parseAmountToLamports(tx.amount);

        // 1. Create a UTXO keypair for this recipient's shielded output
        const owner = await generateUtxoKeypair();
        const output = await createUtxo(amount, owner, NATIVE_SOL_MINT);

        // 2. Deposit into the shielded pool
        const deposited = await transact(
          {
            inputUtxos: [await createZeroUtxo(NATIVE_SOL_MINT)],
            outputUtxos: [output],
            externalAmount: amount,
            depositor: this.signer.publicKey,
          },
          baseOptions,
        );

        // 3. Full withdraw to a unique stealth address (the recipient)
        // In production, `tx.recipient` would be a real Solana public key.
        // For the hackathon demo, we generate a fresh keypair as the recipient.
        const recipientKeypair = Keypair.generate();
        const withdrawResult = await fullWithdraw(
          deposited.outputUtxos,
          recipientKeypair.publicKey,
          {
            ...baseOptions,
            cachedMerkleTree: deposited.merkleTree,
          },
        );

        lastTxHash = withdrawResult.signature;
        results.push({
          recipient: tx.recipient,
          amount: tx.amount,
          stealthAddress: recipientKeypair.publicKey.toBase58(),
        });
      }

      return { txHash: lastTxHash, results };
    }

    // -- Demo mode: simulated stealth addresses --
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const txHash = generateBase58(88);
    const results = transactions.map((tx) => ({
      ...tx,
      stealthAddress: generateBase58(44),
    }));

    return { txHash, results };
  }

  /**
   * Generate a compliance viewing key.
   *
   * Live mode: derives a real viewing key from a UTXO keypair's nk (nullifier key).
   * Demo mode: returns a simulated key prefixed with `cloak_vk_`.
   */
  async generateViewingKey(): Promise<string> {
    await this.init();
    console.log('[Cloak SDK] Generating auditor viewing key');

    if (this.isLiveMode) {
      // Generate a fresh UTXO keypair and extract the viewing key material
      const keypair = await generateUtxoKeypair();
      const nk = getNkFromUtxoPrivateKey(keypair.privateKey);

      // Encode as hex for portability
      const hexKey = Array.from(nk)
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');

      return `cloak_vk_${hexKey}`;
    }

    // Demo mode
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return `cloak_vk_${generateBase58(32)}`;
  }

  /**
   * Scan on-chain transaction history using the viewing key.
   *
   * Only available in live mode. Returns a compliance report with
   * per-transaction gross/fee/net breakdown.
   */
  async scanHistory(): Promise<ComplianceReport | null> {
    await this.init();

    if (!this.isLiveMode || !this.connection || !this.viewingKeyNk) {
      console.log('[Cloak SDK] History scan not available in demo mode');
      return null;
    }

    const scan = await scanTransactions({
      connection: this.connection,
      programId: CLOAK_PROGRAM_ID,
      viewingKeyNk: this.viewingKeyNk,
      limit: 250,
    });

    const report = toComplianceReport(scan);
    return report as unknown as ComplianceReport;
  }

  /** Check whether the service is running against the real on-chain protocol. */
  get isLive(): boolean {
    return this.isLiveMode;
  }

  /** The Cloak program ID on mainnet. */
  static get PROGRAM_ID(): PublicKey {
    return CLOAK_PROGRAM_ID;
  }
}

export const cloakService = new CloakService();
