import { type Chain } from "viem";

export const hederaTestnet = {
  id: 296,
  name: "Hedera Testnet",
  nativeCurrency: { decimals: 8, name: "HBAR", symbol: "HBAR" },
  rpcUrls: {
    default: { http: ["https://testnet.hashio.io/api"] },
    public: { http: ["https://testnet.hashio.io/api"] },
  },
  blockExplorers: {
    default: { name: "HashScan", url: "https://hashscan.io/testnet" },
  },
  testnet: true,
} as const satisfies Chain;

export const hederaMainnet = {
  id: 295,
  name: "Hedera Mainnet",
  nativeCurrency: { decimals: 8, name: "HBAR", symbol: "HBAR" },
  rpcUrls: {
    default: { http: ["https://mainnet.hashio.io/api"] },
    public: { http: ["https://mainnet.hashio.io/api"] },
  },
  blockExplorers: {
    default: { name: "HashScan", url: "https://hashscan.io/mainnet" },
  },
  testnet: false,
} as const satisfies Chain;
