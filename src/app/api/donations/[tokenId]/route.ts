import { NextResponse } from "next/server";
import { createPublicClient, http, type Abi } from "viem";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || "https://testnet.hashio.io/api";
const CONTRACT = (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "") as `0x${string}`;

const getDonationsAbi = [
  {
    inputs: [{ name: "_tokenId", type: "uint256" }],
    name: "getDonations",
    outputs: [
      {
        components: [
          { name: "donor", type: "address" },
          { name: "amount", type: "uint256" },
          { name: "timestamp", type: "uint256" },
        ],
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

export async function GET(
  request: Request,
  { params }: { params: { tokenId: string } }
) {
  try {
    const tokenId = parseInt(params.tokenId);
    if (isNaN(tokenId)) {
      return NextResponse.json({ error: "Invalid token ID" }, { status: 400 });
    }
    if (!CONTRACT) {
      return NextResponse.json({ error: "Contract not configured" }, { status: 500 });
    }

    const client = createPublicClient({
      transport: http(RPC_URL, { timeout: 20_000 }),
    });

    const donations = (await client.readContract({
      address: CONTRACT,
      abi: getDonationsAbi as unknown as Abi,
      functionName: "getDonations",
      args: [BigInt(tokenId)],
    })) as readonly { donor: string; amount: bigint; timestamp: bigint }[];

    const result = donations.map((d) => ({
      donor: d.donor,
      amount: d.amount.toString(),
      timestamp: Number(d.timestamp),
      tokenId,
      transactionHash: "",
    }));

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error fetching donations for token", params.tokenId, ":", error?.message ?? error);
    return NextResponse.json([], { status: 200 });
  }
}
