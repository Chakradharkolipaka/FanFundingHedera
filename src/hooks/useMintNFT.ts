"use client";

import { useWriteContract, useWaitForTransactionReceipt, useAccount, useChainId } from "wagmi";
import { contractAddress, contractAbi } from "@/constants";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useCallback, useRef } from "react";

export function useMintNFT(onSuccess?: () => void) {
  const { toast } = useToast();
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { data: hash, writeContract, isPending: isMinting, error: writeError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  // Stable ref to avoid re-render loops from inline callbacks
  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  useEffect(() => {
    if (writeError) toast({ title: "Minting Failed", description: writeError.message.slice(0, 150), variant: "destructive" });
  }, [writeError]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isConfirmed && hash) {
      toast({ title: "NFT Minted! 🎉", description: `Tx: ${hash}` });
      onSuccessRef.current?.();
    }
  }, [isConfirmed, hash]); // eslint-disable-line react-hooks/exhaustive-deps

  const mint = useCallback(
    (tokenURI: string) => {
      if (!isConnected) { toast({ title: "Wallet Not Connected", description: "Connect your wallet first.", variant: "destructive" }); return; }
      if (chainId !== 296) { toast({ title: "Wrong Network", description: "Switch to Hedera Testnet.", variant: "destructive" }); return; }
      writeContract({ address: contractAddress, abi: contractAbi, functionName: "mintNFT", args: [tokenURI] });
    },
    [isConnected, chainId, writeContract] // eslint-disable-line react-hooks/exhaustive-deps
  );

  return { mint, hash, isMinting, isConfirming, isConfirmed, isProcessing: isMinting || isConfirming };
}
