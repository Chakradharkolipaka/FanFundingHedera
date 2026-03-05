"use client";

import { motion } from "framer-motion";
import { formatUnits } from "viem";
import { TrendingUp, Users, ImageIcon, Coins } from "lucide-react";

interface StatsBarProps {
  totalNFTs: number;
  totalDonations: bigint;
  totalDonors: number;
  topSupportedName: string;
}

const variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" } }),
};

export default function StatsBar({ totalNFTs, totalDonations, totalDonors, topSupportedName }: StatsBarProps) {
  const stats = [
    { label: "Total NFTs", value: String(totalNFTs), icon: ImageIcon, color: "text-blue-400", bg: "bg-blue-500/10" },
    { label: "Total Donations", value: `${parseFloat(formatUnits(totalDonations, 8)).toFixed(2)} HBAR`, icon: Coins, color: "text-emerald-400", bg: "bg-emerald-500/10" },
    { label: "Unique Donors", value: String(totalDonors), icon: Users, color: "text-purple-400", bg: "bg-purple-500/10" },
    { label: "Top Supported", value: topSupportedName || "—", icon: TrendingUp, color: "text-amber-400", bg: "bg-amber-500/10" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          custom={i}
          initial="hidden"
          animate="visible"
          variants={variants}
          className="group relative overflow-hidden rounded-xl border bg-card p-4 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 sm:rounded-2xl sm:p-5"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-primary/5 opacity-0 transition-opacity group-hover:opacity-100" />
          <div className="relative z-10">
            <div className={`mb-2 inline-flex rounded-lg p-2 sm:mb-3 sm:rounded-xl sm:p-2.5 ${stat.bg}`}>
              <stat.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${stat.color}`} />
            </div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground sm:text-xs">{stat.label}</p>
            <p className="mt-0.5 truncate text-base font-bold sm:mt-1 sm:text-lg">{stat.value}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
