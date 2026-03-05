import { NextResponse } from "next/server";
import { createPublicClient, http } from "viem";
import { contractAbi, contractAddress } from "@/constants";
import { hederaTestnet } from "@/constants/chains";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: { tokenId: string } }
) {
  try {
    const tokenId = parseInt(params.tokenId);
    if (isNaN(tokenId)) return NextResponse.json({ error: "Invalid token ID" }, { status: 400 });
    if (!contractAddress) return NextResponse.json({ error: "Contract not configured" }, { status: 500 });

    const client = createPublicClient({
      chain: hederaTestnet,
      transport: http(process.env.NEXT_PUBLIC_RPC_URL || "https://testnet.hashio.io/api"),
    });

    // Use on-chain getDonations() — Hedera JSON-RPC relay has limited event/log support
    const donations = (await client.readContract({
      address: contractAddress as `0x${string}`,
      abi: contractAbi,
      functionName: "getDonations",
      args: [BigInt(tokenId)],
    })) as { donor: string; amount: bigint; timestamp: bigint }[];

    const result = donations.map((d, i) => ({
      donor: d.donor,
      amount: d.amount.toString(),
      timestamp: Number(d.timestamp),
      tokenId,
      transactionHash: "",
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching donations:", error);
    return NextResponse.json({ error: "Failed to fetch donations" }, { status: 500 });
  }
}
