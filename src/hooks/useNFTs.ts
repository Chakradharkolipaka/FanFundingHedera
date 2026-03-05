"use client";

import { useMemo, useState, useEffect, useCallback, useRef } from "react";
import { useReadContract, useReadContracts } from "wagmi";
import { type Abi } from "viem";
import { contractAddress, contractAbi } from "@/constants";

export interface NftData {
  tokenId: number;
  tokenURI: string;
  owner: string;
  totalDonations: bigint;
  metadata: { name: string; description: string; image: string } | null;
}

function resolveUri(uri: string): string {
  if (!uri) return "";
  if (uri.startsWith("ipfs://")) return uri.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/");
  return uri;
}

export function useNFTs() {
  const [metadataMap, setMetadataMap] = useState<Record<number, { name: string; description: string; image: string }>>({});
  const fetchedRef = useRef<Set<number>>(new Set());

  const { data: totalSupply, isLoading: isLoadingSupply, refetch: refetchSupply } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "totalSupply",
    query: { enabled: Boolean(contractAddress), refetchOnMount: true },
  });

  const nftIds = useMemo(
    () => Array.from({ length: Number(totalSupply || 0) }, (_, i) => i + 1),
    [totalSupply]
  );

  const { data: rawData, isLoading: isLoadingData, refetch: refetchData } = useReadContracts({
    contracts: nftIds.flatMap((id) => [
      { address: contractAddress, abi: contractAbi as Abi, functionName: "tokenURI", args: [BigInt(id)] },
      { address: contractAddress, abi: contractAbi as Abi, functionName: "ownerOf", args: [BigInt(id)] },
      { address: contractAddress, abi: contractAbi as Abi, functionName: "totalDonations", args: [BigInt(id)] },
    ]),
    query: { enabled: nftIds.length > 0 },
  });

  // Fetch metadata from IPFS for each NFT
  useEffect(() => {
    if (!rawData || nftIds.length === 0) return;

    nftIds.forEach((id, i) => {
      if (fetchedRef.current.has(id)) return;
      const tokenURI = (rawData[i * 3]?.result as string) ?? "";
      if (!tokenURI) return;

      fetchedRef.current.add(id);
      const url = resolveUri(tokenURI);
      fetch(url)
        .then((r) => r.json())
        .then((data) => {
          const img = resolveUri(data.image ?? "");
          setMetadataMap((prev) => ({
            ...prev,
            [id]: { name: data.name ?? `NFT #${id}`, description: data.description ?? "", image: img },
          }));
        })
        .catch((err) => {
          fetchedRef.current.delete(id);
          console.error(`Metadata fetch failed for token ${id}:`, err);
        });
    });
  }, [rawData, nftIds]);

  const nfts: NftData[] = useMemo(() => {
    if (!rawData) return [];
    return nftIds.map((id, i) => ({
      tokenId: id,
      tokenURI: (rawData[i * 3]?.result as string) ?? "",
      owner: (rawData[i * 3 + 1]?.result as string) ?? "",
      totalDonations: (rawData[i * 3 + 2]?.result as bigint) ?? 0n,
      metadata: metadataMap[id] ?? null,
    }));
  }, [rawData, nftIds, metadataMap]);

  const refetch = useCallback(() => {
    refetchSupply();
    refetchData();
  }, [refetchSupply, refetchData]);

  return {
    nfts,
    totalSupply: Number(totalSupply || 0),
    isLoading: isLoadingSupply || (nftIds.length > 0 && isLoadingData),
    refetch,
  };
}
