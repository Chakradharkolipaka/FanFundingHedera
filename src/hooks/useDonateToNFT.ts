"use client";

import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseUnits } from "viem";
import { contractAddress, contractAbi } from "@/constants";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";

export function useDonateToNFT() {
  const { toast } = useToast();
  const { data: hash, writeContract, isPending, error: writeError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (writeError) {
      toast({ title: "Transaction Failed", description: writeError.message.slice(0, 120), variant: "destructive" });
    }
  }, [writeError]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isConfirmed && hash) {
      toast({ title: "Donation Successful! 🎉", description: `Tx: ${hash.slice(0, 10)}…${hash.slice(-6)}` });
    }
  }, [isConfirmed, hash]); // eslint-disable-line react-hooks/exhaustive-deps

  const donate = (tokenId: number, amountInHbar: string) => {
    writeContract({
      address: contractAddress,
      abi: contractAbi,
      functionName: "donate",
      args: [BigInt(tokenId)],
      value: parseUnits(amountInHbar, 8),
    });
  };

  return { donate, hash, isPending, isConfirming, isConfirmed, isProcessing: isPending || isConfirming };
}
