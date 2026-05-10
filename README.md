<div align="center">

# 👻 Ghopay — Ghost Payroll on Solana

> **Private batch payroll for DAOs.** Institutional-grade payroll protocol using Cloak SDK for stealth addresses and batch transfers on Solana. Ensure team privacy without losing treasury auditability.

<img src="docs/readme-hero.png" alt="Ghopay Hero Image" width="100%">

<br/>

[![Live Demo](https://img.shields.io/badge/🚀_Live-Demo-06b6d4?style=for-the-badge)](https://ghopay.edycu.dev/)
[![Pitch Deck](https://img.shields.io/badge/📊_Pitch-Deck-f59e0b?style=for-the-badge)](https://ghopay.edycu.dev/pitch)
[![Built for Frontier](https://img.shields.io/badge/Colosseum-Frontier_Hackathon-8b5cf6?style=for-the-badge)](https://superteam.fun/earn/listing/cloak-track)

<br/>

[![Next.js 16](https://img.shields.io/badge/Next.js-16-black?logo=next.js&style=flat-square)](https://nextjs.org)
[![Solana](https://img.shields.io/badge/Solana-Devnet-9945FF?logo=solana&style=flat-square)](https://solana.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&style=flat-square)](https://typescriptlang.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-cyan?style=flat-square)](LICENSE)
[![Tests Passing](https://img.shields.io/badge/🧪_Tests-76_Passing-22c55e?style=flat-square)](#testing)

</div>

---

## 🎯 Problem

Crypto payroll is fully public. Large-scale DAO payouts are fundamentally broken for individual contributors:

- **Targeted Phishing** — When a DAO paid 47 contributors on-chain, 12 received targeted phishing emails within 24 hours — each referencing the exact salary amount visible on the explorer.
- **Identity Exposure** — On-chain analysis links wallets to real identities, compromising contributor safety and negotiating leverage.
- **Compliance Friction** — DAOs need transparent treasuries, but individuals need financial privacy.

The crypto payroll market requires confidentiality, yet there are few privacy-preserving, non-custodial batch transfer protocols on Solana.

## 💡 Solution

**Ghopay** provides a private batch payroll system using stealth addresses:

1. 💸 **Treasury executes batch** — Sends payroll to N employees in a single transaction via Cloak SDK.
2. 👻 **Stealth address generation** — Each employee receives funds in a unique, untraceable stealth address.
3. 🛡️ **Public treasury, private salaries** — No individual salary is visible on-chain. The treasury debit is public, but the per-employee amounts and destinations are hidden.
4. 👁️ **Auditable compliance** — HR/Auditors can use a **Viewing Key** to decrypt the full payroll for compliance reviews without exposing data publicly.

---

## 🏗️ Architecture & Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 16 (App Router), React 19 |
| **Styling** | Tailwind CSS v4 |
| **Animation** | Framer Motion, Canvas Particles, ScrambleText |
| **Privacy SDK** | [`@cloak.dev/sdk`](https://docs.cloak.ag/sdk/introduction) v0.1.6 (Solana UTXO shielded pool) |
| **Blockchain** | Solana Mainnet (Program: `zh1eLd6rSphLejbFfJEneUwzHRfMKxgzrgkfwA6qRkW`) |
| **Testing** | Vitest + Testing Library |

> 📐 **[Full architecture deep-dive →](docs/ARCHITECTURE.md)** — Detailed system diagrams, data flows, and tech stack breakdowns.

---

## 🚀 Quick Start

```bash
# Clone
git clone https://github.com/edycutjong/ghopay.git
cd ghopay

# Install
npm install

# Configure environment
cp .env.example .env.local
# Optional: Set KEYPAIR_PATH for live on-chain mode
# Without it, the app runs in demo mode (simulated stealth addresses)

# Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — the dashboard loads with the full animation suite.

### Live Mode Setup (Optional)

By default, Ghopay runs in **demo mode** — no keypair or SOL needed. To enable real on-chain stealth transfers via the Cloak SDK:

```bash
# 1. Install Solana CLI (if not already installed)
sh -c "$(curl -sSfL https://release.anza.xyz/stable/install)"

# 2. Generate a keypair
solana-keygen new --outfile ~/.config/solana/ghopay-keypair.json

# 3. Check your public address
solana address -k ~/.config/solana/ghopay-keypair.json

# 4. Fund the keypair with SOL
#    Devnet: solana airdrop 2 <ADDRESS> --url devnet
#    Mainnet: transfer SOL from an exchange or wallet

# 5. Set in .env.local (use absolute path)
echo "KEYPAIR_PATH=/Users/$(whoami)/.config/solana/ghopay-keypair.json" >> .env.local
```

> **⚠️ Security:** Never commit your keypair file or share it. The `.gitignore` already excludes `*.json` keypair files.

### Testing

76 unit tests across all components, services, and the health API route (100% coverage).

```bash
npm test              # watch mode
npm run test:coverage # single run with coverage report
npm run ci            # typecheck + lint + coverage (CI gate)
```

---

## 📱 User Flow

### 1. Landing Page
Premium landing screen with particle background canvas and ScrambleText animations, highlighting the stealth payroll value proposition.

### 2. HR Dashboard
Execute stealth batch transfers for employees. Stealth addresses are revealed dynamically as they are assigned.

### 3. Payroll Actions & Audit
Generate scoped Viewing Keys for auditors, ensuring full compliance disclosure without public data leakage.

### 4. System Status
Real-time monitoring via the `/api/health` endpoint integrated directly into the dashboard header.

---

## 📂 Project Structure

```
src/
├── app/
│   ├── api/health/route.ts   # uptime endpoint
│   ├── about/page.tsx        # about page
│   ├── layout.tsx            # root layout (StatusBar, Footer, TechStack)
│   └── page.tsx              # main HR dashboard
├── components/
│   ├── EmployeeTable.tsx     # payroll table with stealth address reveal
│   ├── Footer.tsx
│   ├── HeroLanding.tsx       # animated landing screen
│   ├── PayrollActions.tsx    # execute batch + generate viewing key
│   ├── StatusBar.tsx         # system status header
│   ├── TechStack.tsx         # tech badges
│   └── WowEffects.tsx        # ScrambleText + ParticleBackground
└── lib/
    └── cloak.ts              # CloakService (@cloak.dev/sdk UTXO wrapper)
```

---

## 🎨 Design System

| Token | Value | Usage |
|-------|-------|-------|
| Background | `#0f172a` | App background (Slate 900) |
| Surface | `#1e293b` | Cards, panels (Slate 800) |
| Primary | `#06b6d4` | Cloak accent (Cyan 500) |
| Success | `#22c55e` | Verified/completed states (Green 500) |
| Font Brand | System Default | Headlines, protocol name |
| Font Body | System Default | Body text |
| Font Mono | System Mono | Data, addresses, terminal |

---

## 🏆 Sponsor Tracks

| Track | Sponsor | Prize |
|-------|---------|-------|
| Privacy & Stealth | Cloak | $10,000 |
| General Track | 100xDevs | $10,000 |

---

## 🛡️ Privacy Architecture

| Threat | Mitigation |
|--------|------------|
| Public Salary Exposure | Cloak UTXO shielded pool — `transact()` → `fullWithdraw()` per payee |
| Audit Friction | Viewing keys via `getNkFromUtxoPrivateKey()` + `scanTransactions()` for HR/regulators |
| Linkability | Fresh `generateUtxoKeypair()` per payment — unique stealth addresses each epoch |

### Cloak SDK Integration Depth

| SDK Capability | Usage in Ghopay |
|---|---|
| **Private transfers** | Each payroll payout routes through the shielded pool via `transact()` + `fullWithdraw()` |
| **Batch disbursement** | Sequential shielded transfers for N employees in a single payroll run |
| **Stealth addresses** | Each employee receives to a fresh `Keypair.generate()` stealth address |
| **Viewing keys** | `getNkFromUtxoPrivateKey()` derives auditor viewing keys; `scanTransactions()` + `toComplianceReport()` for compliance |

> **Program ID:** `zh1eLd6rSphLejbFfJEneUwzHRfMKxgzrgkfwA6qRkW`
> **Relay:** `https://api.cloak.ag`
> **SDK:** `@cloak.dev/sdk@0.1.6`

---

## 📄 License

[MIT](LICENSE)

---

<p align="center">
  <strong>Built for the <a href="https://www.colosseum.org/">Colosseum Frontier Hackathon</a></strong><br/>
  <sub>by <a href="https://x.com/edycutjong">@edycutjong</a></sub>
</p>
