"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { formatUnits } from "viem";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Heart, ExternalLink, Loader2, ImageIcon } from "lucide-react";
import Confetti from "react-confetti";
import { useDonateToNFT } from "@/hooks/useDonateToNFT";
import { type NftData } from "@/hooks/useNFTs";

interface NFTCardProps {
  nft: NftData;
  onDonation?: (tokenId: number, donor: string, amount: bigint) => void;
  onTotalsChange?: () => void;
}

export default function NFTCard({ nft, onDonation, onTotalsChange }: NFTCardProps) {
  const [donationAmount, setDonationAmount] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const { toast } = useToast();
  const { donate, isProcessing, isConfirmed } = useDonateToNFT();

  const onTotalsChangeRef = useRef(onTotalsChange);
  onTotalsChangeRef.current = onTotalsChange;

  const metadata = nft.metadata;

  useEffect(() => {
    if (isConfirmed) {
      setShowConfetti(true);
      setIsDialogOpen(false);
      setDonationAmount("");
      onTotalsChangeRef.current?.();
      setTimeout(() => setShowConfetti(false), 4000);
    }
  }, [isConfirmed]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDonate = () => {
    if (!donationAmount || parseFloat(donationAmount) <= 0) {
      toast({ title: "Invalid Amount", description: "Enter a valid amount.", variant: "destructive" });
      return;
    }
    donate(nft.tokenId, donationAmount);
  };

  const totalHbar = parseFloat(formatUnits(nft.totalDonations, 8)).toFixed(2);

  return (
    <>
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} style={{ position: "fixed", top: 0, left: 0, zIndex: 100 }} />}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        whileHover={{ y: -4 }}
      >
        <Card className="group relative flex flex-col overflow-hidden border transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30">
          {/* Full image — native img for reliable IPFS loading */}
          <div className="relative w-full overflow-hidden bg-muted">
            {metadata?.image ? (
              <>
                {!imgLoaded && (
                  <div className="flex aspect-[4/5] items-center justify-center animate-pulse bg-secondary">
                    <ImageIcon className="h-10 w-10 text-muted-foreground/40" />
                  </div>
                )}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={metadata.image}
                  alt={metadata.name ?? "NFT"}
                  className={`w-full h-auto object-contain transition-transform duration-500 group-hover:scale-[1.03] ${imgLoaded ? "block" : "hidden"}`}
                  onLoad={() => setImgLoaded(true)}
                  onError={() => setImgLoaded(true)}
                />
              </>
            ) : (
              <div className="flex aspect-[4/5] items-center justify-center animate-pulse bg-secondary">
                <ImageIcon className="h-10 w-10 text-muted-foreground/40" />
              </div>
            )}
            <div className="absolute left-3 top-3">
              <span className="rounded-full border bg-background/70 px-2.5 py-1 text-xs font-semibold backdrop-blur-md shadow">
                #{nft.tokenId}
              </span>
            </div>
          </div>

          <CardContent className="flex-1 p-4">
            <h3 className="mb-1 text-lg font-semibold leading-tight">{metadata?.name ?? `NFT #${nft.tokenId}`}</h3>
            <p className="mb-3 text-sm text-muted-foreground line-clamp-3">{metadata?.description ?? ""}</p>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1.5 text-emerald-500">
                <Heart className="h-4 w-4 fill-current" />
                <span className="font-semibold">{totalHbar} HBAR</span>
              </div>
              <a
                href={`https://hashscan.io/testnet/account/${nft.owner}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
              >
                <span className="font-mono text-xs">{nft.owner.slice(0, 6)}…{nft.owner.slice(-4)}</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </CardContent>

          <CardFooter className="p-4 pt-0">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full group/btn shadow-sm transition-all duration-200 hover:shadow-md hover:shadow-primary/20">
                  <Heart className="mr-2 h-4 w-4 transition-transform group-hover/btn:scale-110" />
                  Support with HBAR
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Donate to {metadata?.name ?? `NFT #${nft.tokenId}`}</DialogTitle>
                  <DialogDescription>Your HBAR goes directly to the creator. Every donation is on-chain.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Amount (HBAR)</label>
                    <Input type="number" min="0.01" step="0.01" placeholder="e.g. 10" value={donationAmount} onChange={(e) => setDonationAmount(e.target.value)} disabled={isProcessing} />
                  </div>
                  <div className="flex gap-2">
                    {["5", "10", "50", "100"].map((amt) => (
                      <Button key={amt} size="sm" variant="outline" onClick={() => setDonationAmount(amt)} disabled={isProcessing} className="flex-1 transition-all hover:border-primary/50">{amt}</Button>
                    ))}
                  </div>
                  <Button onClick={handleDonate} disabled={isProcessing || !donationAmount} className="w-full">
                    {isProcessing ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Processing...</>) : (<><Heart className="mr-2 h-4 w-4" />Donate {donationAmount ? `${donationAmount} HBAR` : ""}</>)}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
      </motion.div>
    </>
  );
}
