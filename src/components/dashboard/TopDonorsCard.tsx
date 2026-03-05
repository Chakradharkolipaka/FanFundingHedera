"use client";

import { motion, AnimatePresence } from "framer-motion";
import { formatUnits } from "viem";
import { Trophy, ExternalLink, Loader2 } from "lucide-react";
import { type TopDonor } from "@/hooks/useTopDonors";
import { Button } from "@/components/ui/button";

const rankColors = ["from-amber-400 to-yellow-500", "from-slate-300 to-slate-400", "from-orange-400 to-amber-600"];

export default function TopDonorsCard({ donors, isLoading }: { donors: TopDonor[]; isLoading: boolean }) {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm sm:rounded-2xl sm:p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-xl bg-amber-500/10 p-2.5"><Trophy className="h-5 w-5 text-amber-400" /></div>
        <div>
          <h2 className="text-lg font-semibold">Top Supporters</h2>
          <p className="text-xs text-muted-foreground">Ranked by total HBAR donated</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      ) : donors.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">No donations yet. Be the first!</p>
      ) : (
        <ul className="space-y-2">
          <AnimatePresence mode="popLayout">
            {donors.map((donor, index) => (
              <motion.li
                key={donor.address}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className="group flex items-center justify-between rounded-xl bg-muted/50 px-4 py-3 transition-all duration-200 ease-out hover:bg-muted hover:shadow-md hover:shadow-primary/5"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-xs font-bold ${index < 3 ? `bg-gradient-to-br ${rankColors[index]} text-white shadow-sm` : "bg-muted-foreground/10 text-muted-foreground"}`}>
                    {index + 1}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-mono text-sm font-medium">{donor.address.slice(0, 6)}…{donor.address.slice(-4)}</p>
                    <p className="text-xs text-muted-foreground">Supported {donor.nftsDonatedTo} NFT{donor.nftsDonatedTo !== 1 ? "s" : ""}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="whitespace-nowrap text-sm font-semibold">{parseFloat(formatUnits(donor.total, 8)).toFixed(2)} HBAR</span>
                  <Button size="icon" variant="ghost" className="h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100" asChild>
                    <a href={`https://hashscan.io/testnet/account/${donor.address}`} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-3.5 w-3.5" /></a>
                  </Button>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
}
