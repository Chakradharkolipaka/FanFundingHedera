"use client";

import { useState, useCallback, useEffect } from "react";
import { contractAddress } from "@/constants";

export interface TopDonor {
  address: string;
  total: bigint;
  nftsDonatedTo: number;
}

export interface RecentDonation {
  donor: string;
  amount: string;
  tokenId: number;
  nftName: string;
  timestamp: number;
  transactionHash: string;
}

export function useTopDonors(totalSupply: number, nftNames?: Record<number, string>) {
  const [donors, setDonors] = useState<TopDonor[]>([]);
  const [recentDonations, setRecentDonations] = useState<RecentDonation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTopDonors = useCallback(async () => {
    if (!totalSupply || !contractAddress) return;
    setIsLoading(true);
    try {
      const donorMap = new Map<string, { totalAmount: bigint; nftIds: Set<number> }>();
      const allDonations: RecentDonation[] = [];

      for (let tokenId = 1; tokenId <= totalSupply; tokenId++) {
        try {
          const res = await fetch(`/api/donations/${tokenId}`);
          if (!res.ok) continue;
          const contentType = res.headers.get("content-type") ?? "";
          if (!contentType.includes("application/json")) continue;
          const data: any[] = await res.json();
          if (!Array.isArray(data)) continue;
          const name = nftNames?.[tokenId] ?? `NFT #${tokenId}`;

          for (const d of data) {
            const key = (d.donor as string).toLowerCase();
            const existing = donorMap.get(key) ?? { totalAmount: 0n, nftIds: new Set<number>() };
            existing.totalAmount += BigInt(d.amount);
            existing.nftIds.add(tokenId);
            donorMap.set(key, existing);
            allDonations.push({
              donor: d.donor,
              amount: d.amount,
              tokenId,
              nftName: name,
              timestamp: d.timestamp ?? 0,
              transactionHash: d.transactionHash ?? "",
            });
          }
        } catch {
          continue;
        }
      }

      const sorted = Array.from(donorMap.entries())
        .map(([address, { totalAmount, nftIds }]) => ({ address, total: totalAmount, nftsDonatedTo: nftIds.size }))
        .sort((a, b) => (b.total > a.total ? 1 : -1))
        .slice(0, 10);

      // Sort by timestamp descending (most recent first)
      allDonations.sort((a, b) => b.timestamp - a.timestamp);

      setDonors(sorted);
      setRecentDonations(allDonations.slice(0, 20));
    } catch (err) {
      console.error("Failed to fetch top donors:", err);
    } finally {
      setIsLoading(false);
    }
  }, [totalSupply, nftNames]);

  useEffect(() => {
    if (totalSupply > 0) fetchTopDonors();
  }, [totalSupply, fetchTopDonors]);

  return { donors, recentDonations, isLoading, refetch: fetchTopDonors };
}
