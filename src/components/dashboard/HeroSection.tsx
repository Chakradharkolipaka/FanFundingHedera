"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative mx-4 mt-4 overflow-hidden rounded-2xl border bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 px-5 py-12 sm:mx-6 sm:rounded-3xl md:px-12 md:py-24">
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute -top-20 -left-20 h-48 w-48 rounded-full bg-indigo-500/20 blur-3xl sm:h-72 sm:w-72"
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-20 -right-20 h-48 w-48 rounded-full bg-purple-500/20 blur-3xl sm:h-72 sm:w-72"
          animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs text-indigo-300 sm:px-4 sm:py-1.5 sm:text-sm">
            <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Powered by Hedera Hashgraph
          </div>

          <h1 className="mb-3 text-3xl font-bold tracking-tight text-white sm:mb-4 sm:text-4xl md:text-5xl lg:text-6xl">
            Fund Creators.{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              On-Chain.
            </span>
          </h1>

          <p className="mb-6 max-w-lg text-sm leading-relaxed text-slate-300/90 sm:mb-8 sm:text-base md:text-lg">
            Mint NFTs, receive HBAR donations directly, and build transparent
            creator-fan relationships on the fastest enterprise-grade ledger.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Button asChild size="lg" className="group shadow-lg shadow-indigo-500/25 transition-shadow hover:shadow-xl hover:shadow-indigo-500/30">
              <Link href="/mint">
                Create NFT
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
              <Link href="/#nfts">Browse NFTs</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
