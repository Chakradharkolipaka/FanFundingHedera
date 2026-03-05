# Fan Funding — Hedera Hashgraph

A decentralized NFT-based fan funding dApp built on **Hedera Hashgraph**. Creators mint NFTs; supporters donate HBAR directly to those NFTs — all on-chain, fully transparent.

## Stack

| Layer | Technology |
|-------|-----------|
| **Chain** | Hedera Testnet (296) / Mainnet (295) |
| **Contract** | Solidity 0.8.20 · OpenZeppelin ERC721 |
| **Frontend** | Next.js 14 · TypeScript · Tailwind CSS |
| **Wallet** | RainbowKit · Wagmi · WalletConnect |
| **Storage** | Pinata (IPFS) |
| **Build** | Hardhat 3.x |

## Architecture

```
src/
├── app/              # Next.js App Router pages & API routes
│   ├── page.tsx      # Dashboard (hero, stats, donors, NFT grid)
│   ├── mint/         # Mint page
│   └── api/          # Server-side API (donations, Pinata upload)
├── components/       # UI components
│   ├── dashboard/    # HeroSection, StatsBar, TopDonorsCard, RecentActivity
│   ├── NFTCard.tsx   # Individual NFT card with donate dialog
│   └── Navbar.tsx    # Top nav + wallet connect
├── hooks/            # Custom React hooks
│   ├── useNFTs.ts    # Fetch all NFTs from contract
│   ├── useMintNFT.ts # Mint transaction logic
│   ├── useDonateToNFT.ts # Donate transaction logic
│   └── useTopDonors.ts   # Aggregate donors from API
├── constants/        # Chain definitions, contract ABI & address
└── lib/              # Utilities (IPFS, cn helper)
contracts/
├── FanFunding.sol    # Main smart contract
```

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Fill in your values:
- `NEXT_PUBLIC_CONTRACT_ADDRESS` — deployed contract address
- `NEXT_PUBLIC_RPC_URL` — Hedera JSON-RPC (`https://testnet.hashio.io/api`)
- `PINATA_JWT` — Pinata API JWT (server-side)
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` — from [cloud.walletconnect.com](https://cloud.walletconnect.com)
- `PRIVATE_KEY` — deployer wallet key (for Hardhat only)

### 3. Deploy the contract

```bash
npx hardhat compile
npx hardhat run scripts/deploy.js --network hederaTestnet
```

Copy the deployed address into `NEXT_PUBLIC_CONTRACT_ADDRESS`.

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Smart Contract

`contracts/FanFunding.sol` — ERC-721 with on-chain donation tracking.

**Key features:**
- `mintNFT(tokenURI)` — mint a new NFT with IPFS metadata
- `donate(tokenId)` — send HBAR to a token, forwarded to owner
- `getDonations(tokenId)` — returns full donation history as `Donation[]`
- `totalDonatedBy(address)` — cumulative amount donated by an address
- Custom errors (`ZeroDonation`, `TokenDoesNotExist`, `TransferFailed`)
- `ReentrancyGuard` on `donate()`

## Explorer

- **Testnet**: [hashscan.io/testnet](https://hashscan.io/testnet)
- **Mainnet**: [hashscan.io/mainnet](https://hashscan.io/mainnet)

## License

MIT

