export const contractAddress = (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "") as `0x${string}`;

export const contractAbi = [
  { inputs: [], stateMutability: "nonpayable", type: "constructor" },
  // Read
  { inputs: [], name: "totalSupply", outputs: [{ type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [{ name: "tokenId", type: "uint256" }], name: "tokenURI", outputs: [{ type: "string" }], stateMutability: "view", type: "function" },
  { inputs: [{ name: "tokenId", type: "uint256" }], name: "ownerOf", outputs: [{ type: "address" }], stateMutability: "view", type: "function" },
  { inputs: [{ name: "", type: "uint256" }], name: "totalDonations", outputs: [{ type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [{ name: "_tokenId", type: "uint256" }], name: "getDonations", outputs: [{ components: [{ name: "donor", type: "address" }, { name: "amount", type: "uint256" }, { name: "timestamp", type: "uint256" }], type: "tuple[]" }], stateMutability: "view", type: "function" },
  { inputs: [{ name: "_tokenId", type: "uint256" }], name: "getDonationCount", outputs: [{ type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [{ name: "", type: "address" }], name: "totalDonatedBy", outputs: [{ type: "uint256" }], stateMutability: "view", type: "function" },
  // Write
  { inputs: [{ name: "_tokenURI", type: "string" }], name: "mintNFT", outputs: [{ type: "uint256" }], stateMutability: "nonpayable", type: "function" },
  { inputs: [{ name: "_tokenId", type: "uint256" }], name: "donate", outputs: [], stateMutability: "payable", type: "function" },
  // Events
  { anonymous: false, inputs: [{ indexed: true, name: "tokenId", type: "uint256" }, { indexed: true, name: "creator", type: "address" }, { indexed: false, name: "tokenURI", type: "string" }], name: "NFTMinted", type: "event" },
  { anonymous: false, inputs: [{ indexed: true, name: "tokenId", type: "uint256" }, { indexed: true, name: "donor", type: "address" }, { indexed: true, name: "creator", type: "address" }, { indexed: false, name: "amount", type: "uint256" }, { indexed: false, name: "timestamp", type: "uint256" }], name: "DonationReceived", type: "event" },
] as const;
