"use client";

import { useCallback, useMemo } from "react";
import Link from "next/link";
import NFTCard from "@/components/NFTCard";
import SkeletonCard from "@/components/SkeletonCard";
import { Button } from "@/components/ui/button";
import HeroSection from "@/components/dashboard/HeroSection";
import StatsBar from "@/components/dashboard/StatsBar";
import TopDonorsCard from "@/components/dashboard/TopDonorsCard";
import RecentActivity from "@/components/dashboard/RecentActivity";
import { useNFTs } from "@/hooks/useNFTs";
import { useTopDonors } from "@/hooks/useTopDonors";

export default function Home() {
  const { nfts, isLoading, refetch } = useNFTs();
  const totalSupply = nfts.length;

  // Build a stable map of tokenId → name for RecentActivity labels
  const nftNames = useMemo(() => {
    const map: Record<number, string> = {};
    nfts.forEach((nft) => {
      map[nft.tokenId] = nft.metadata?.name ?? `NFT #${nft.tokenId}`;
    });
    return map;
  }, [nfts]);

  const { donors, isLoading: isLoadingDonors, refetch: refetchDonors, recentDonations } = useTopDonors(totalSupply, nftNames);

  const totalDonationsAll = useMemo(
    () => nfts.reduce((sum, nft) => sum + (nft.totalDonations ?? 0n), 0n),
    [nfts]
  );

  const uniqueDonorCount = donors.length;

  const topSupportedName = useMemo(() => {
    if (nfts.length === 0) return "—";
    const sorted = [...nfts].sort((a, b) => Number(b.totalDonations - a.totalDonations));
    return sorted[0]?.metadata?.name ?? `NFT #${sorted[0]?.tokenId}`;
  }, [nfts]);

  const handleTotalsChange = useCallback(() => {
    refetch();
    refetchDonors();
  }, [refetch, refetchDonors]);

  return (
    <main className="min-h-screen pb-20 md:pb-0">
      <HeroSection />

      <div className="container mx-auto space-y-8 px-4 py-8 sm:space-y-10 sm:py-10">
        <StatsBar
          totalNFTs={totalSupply}
          totalDonations={totalDonationsAll}
          totalDonors={uniqueDonorCount}
          topSupportedName={topSupportedName}
        />

        {nfts.length > 0 && (
          <section className="grid gap-4 sm:gap-6 lg:grid-cols-2">
            <TopDonorsCard donors={donors} isLoading={isLoadingDonors} />
            <RecentActivity donations={recentDonations} isLoading={isLoadingDonors} />
          </section>
        )}

        <section id="nfts">
          <h2 className="mb-4 text-xl font-semibold tracking-tight sm:mb-6 sm:text-2xl">All NFTs</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
              : nfts.length > 0
              ? nfts.map((nft) => (
                  <NFTCard key={nft.tokenId} nft={nft} onTotalsChange={handleTotalsChange} />
                ))
              : (
                  <div className="col-span-full py-16 text-center">
                    <p className="mb-4 text-muted-foreground">No NFTs found. Be the first to mint and support a cause.</p>
                    <Button asChild><Link href="/mint">Mint an NFT</Link></Button>
                  </div>
                )}
          </div>
        </section>
      </div>
    </main>
  );
}
