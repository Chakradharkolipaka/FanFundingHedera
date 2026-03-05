import { ethers } from "ethers";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function main() {
  console.log("🚀 Deploying FanFunding to Hedera...");

  const artifactPath = "./artifacts/contracts/FanFunding.sol/FanFunding.json";
  if (!fs.existsSync(artifactPath)) {
    console.error("❌ Artifact not found. Run 'npx hardhat compile' first.");
    process.exit(1);
  }

  const { abi, bytecode } = JSON.parse(fs.readFileSync(artifactPath, "utf-8"));
  const rpcUrl = process.env.HEDERA_RPC_URL || "https://testnet.hashio.io/api";
  const privateKey = process.env.PRIVATE_KEY;

  if (!privateKey) {
    console.error("❌ PRIVATE_KEY not found in .env.local");
    process.exit(1);
  }

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey, provider);
  const balance = await provider.getBalance(wallet.address);

  console.log(`   Deployer: ${wallet.address}`);
  console.log(`   Balance:  ${ethers.formatEther(balance)} HBAR`);

  const factory = new ethers.ContractFactory(abi, bytecode, wallet);
  console.log("   Sending deploy tx...");

  const contract = await factory.deploy();
  await contract.waitForDeployment();
  const address = await contract.getAddress();

  console.log("\n✅ FanFunding deployed!");
  console.log(`   Address:  ${address}`);
  console.log(`   Explorer: https://hashscan.io/testnet/contract/${address}`);
  console.log(`\n📋 Set NEXT_PUBLIC_CONTRACT_ADDRESS=${address} in .env.local`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});