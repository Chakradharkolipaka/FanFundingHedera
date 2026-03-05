"use client";

import { motion, AnimatePresence } from "framer-motion";
import { formatUnits } from "viem";
import { Activity, ArrowUpRight, Loader2, Heart, User, Hash } from "lucide-react";

export interface DonationEvent {
  tokenId: number;
  donor: string;
  amount: string | bigint;
  nftName?: string;
  timestamp?: number;
  transactionHash?: string;
}

function timeAgo(ts?: number): string {
  if (!ts || ts === 0) return "";
  const s = Math.floor(Date.now() / 1000 - ts);
  if (s < 0) return "just now";
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

export default function RecentActivity({ donations, isLoading }: { donations: DonationEvent[]; isLoading?: boolean }) {
  const recent = donations.slice(0, 10);

  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm sm:rounded-2xl sm:p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-xl bg-emerald-500/10 p-2.5"><Activity className="h-5 w-5 text-emerald-400" /></div>
        <div>
          <h2 className="text-lg font-semibold">Recent Activity</h2>
          <p className="text-xs text-muted-foreground">Live donation feed</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      ) : recent.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">No activity yet.</p>
      ) : (
        <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar pr-1">
          <AnimatePresence mode="popLayout">
            {recent.map((d, i) => {
              const hbar = parseFloat(formatUnits(BigInt(d.amount), 8)).toFixed(4);
              const ago = timeAgo(d.timestamp);

              return (
                <motion.div
                  key={`${d.donor}-${d.tokenId}-${i}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                  className="rounded-xl border bg-muted/40 p-3 transition-colors duration-200 hover:bg-muted/70"
                >
                  {/* Stack layout: NFT name, From address, Value */}
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500/10">
                      <ArrowUpRight className="h-4 w-4 text-emerald-400" />
                    </div>
                    <div className="min-w-0 flex-1 space-y-1.5">
                      {/* NFT funded */}
                      <div className="flex items-center gap-1.5">
                        <Hash className="h-3 w-3 flex-shrink-0 text-muted-foreground/60" />
                        <span className="truncate text-sm font-semibold">{d.nftName || `NFT #${d.tokenId}`}</span>
                      </div>
                      {/* From address */}
                      <div className="flex items-center gap-1.5">
                        <User className="h-3 w-3 flex-shrink-0 text-muted-foreground/60" />
                        <a
                          href={`https://hashscan.io/testnet/account/${d.donor}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="truncate font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
                        >
                          {d.donor.slice(0, 6)}…{d.donor.slice(-4)}
                        </a>
                      </div>
                      {/* Value */}
                      <div className="flex items-center gap-1.5">
                        <Heart className="h-3 w-3 flex-shrink-0 text-emerald-400" />
                        <span className="text-sm font-bold text-emerald-400">{hbar} HBAR</span>
                      </div>
                    </div>
                    {/* Timestamp */}
                    {ago && (
                      <span className="flex-shrink-0 text-[10px] text-muted-foreground/60">{ago}</span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
