"use client";

import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAccount, useChainId } from "wagmi";
import { Loader2, Upload, Sparkles } from "lucide-react";
import Image from "next/image";
import { useMintNFT } from "@/hooks/useMintNFT";

export default function MintPage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const { isConnected } = useAccount();
  const chainId = useChainId();

  const { mint, isProcessing, isConfirmed } = useMintNFT(() => {
    setFile(null);
    setPreviewUrl(null);
    setName("");
    setDescription("");
  });

  const handleFileChange = (files: FileList | null) => {
    if (files?.[0]) {
      setFile(files[0]);
      setPreviewUrl(URL.createObjectURL(files[0]));
    }
  };

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFileChange(e.dataTransfer.files);
  }, []);

  const handleMint = async () => {
    if (!file || !name || !description) {
      toast({ title: "Missing Fields", description: "Fill all fields and select an image.", variant: "destructive" });
      return;
    }
    if (!isConnected) {
      toast({ title: "Wallet Not Connected", description: "Connect your wallet first.", variant: "destructive" });
      return;
    }
    if (chainId !== 296) {
      toast({ title: "Wrong Network", description: "Switch to Hedera Testnet (Chain ID: 296).", variant: "destructive" });
      return;
    }

    try {
      setIsUploading(true);
      toast({ title: "Uploading to IPFS…", description: "Pinning your artwork." });

      const formData = new FormData();
      formData.append("file", file);
      formData.append("name", name);
      formData.append("description", description);

      const res = await fetch("/api/pinata/upload", { method: "POST", body: formData });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Upload failed" }));
        throw new Error(err.error);
      }

      const { tokenURI } = await res.json();
      if (!tokenURI) throw new Error("No token URI returned");

      setIsUploading(false);
      toast({ title: "Confirm in Wallet", description: "Approve the mint transaction." });
      mint(tokenURI);
    } catch (error) {
      setIsUploading(false);
      toast({ title: "Minting Failed", description: error instanceof Error ? error.message : String(error), variant: "destructive" });
    }
  };

  const busy = isUploading || isProcessing;

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center p-4 pb-24 md:pb-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }} className="w-full max-w-lg">
        <Card className="border shadow-lg transition-shadow hover:shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold sm:text-3xl">Create Your NFT</CardTitle>
            <CardDescription>Upload artwork, add details, and mint on Hedera.</CardDescription>
          </CardHeader>

          <CardContent className="space-y-5 sm:space-y-6">
            {/* Drop zone */}
            <div
              className="cursor-pointer rounded-lg border-2 border-dashed border-muted-foreground/40 p-8 text-center transition-colors hover:border-primary/50 hover:bg-accent/50"
              onDragOver={(e) => e.preventDefault()}
              onDrop={onDrop}
              onClick={() => document.getElementById("file-upload")?.click()}
            >
              <input type="file" id="file-upload" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e.target.files)} />
              {previewUrl ? (
                <div className="relative h-64 w-full">
                  <Image src={previewUrl} alt="Preview" fill className="rounded-md object-contain" unoptimized />
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Upload className="h-12 w-12" />
                  <p>Drag & drop or click to select</p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Name</label>
              <Input id="name" placeholder='e.g. "Sunset Over Mountains"' value={name} onChange={(e) => setName(e.target.value)} disabled={busy} />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">Description</label>
              <Textarea id="description" placeholder="Describe your artwork…" value={description} onChange={(e) => setDescription(e.target.value)} disabled={busy} />
            </div>

            {!isConnected && (
              <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800 dark:border-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200">
                ⚠️ Connect your wallet using the button in the navigation bar.
              </div>
            )}

            {isConnected && chainId !== 296 && (
              <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800 dark:border-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200">
                ⚠️ Switch to Hedera Testnet (Chain ID: 296) in your wallet.
              </div>
            )}

            <Button onClick={handleMint} disabled={busy || !isConnected} className="w-full shadow-sm transition-all hover:shadow-md">
              {busy ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />{isUploading ? "Uploading…" : "Minting…"}</>) : ("Mint NFT")}
            </Button>

            {isConfirmed && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-center text-sm text-emerald-800 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-200">
                🎉 NFT minted successfully!
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
