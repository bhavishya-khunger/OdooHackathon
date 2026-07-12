"use client";

import { Search, ArrowUpRight, Box } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { containerVariants, itemVariants } from '../../components/ui/motionVariants';

import { StatsCardGrid } from '../../components/ui/StatsCardGrid';
import { AlertBanner } from '../../components/ui/AlertBanner';
import { ActionButtonGroup } from '../../components/ui/ActionButtonGroup';
import { ActivityFeed } from '../../components/ui/ActivityFeed';

// Manifest-style feed — same idea as ActivityFeed, but built for a scrolling strip.
// Swap this for real data whenever it's wired up.
const MANIFEST_TICKS = [
  "AF-0114 · LAPTOP → PRIYA SHAH / IT",
  "RM-B2 · ROOM → BOOKED 14:00–15:00",
  "AF-0062 · PROJECTOR → MAINTENANCE CLEARED",
  "AF-0091 · MONITOR → RETURN OVERDUE 2D",
  "RM-A1 · ROOM → RELEASED",
];

// Rough utilization shape — this is what makes the empty panel actually mean something.
const PULSE = [40, 62, 55, 80, 71, 90, 76];

export default function Dashboard() {
  const [isMounted, setIsMounted] = useState(false);
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setIsMounted(true);
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000 * 30);
    return () => clearInterval(t);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden font-sans selection:bg-primary/30 p-6 md:p-8 lg:p-12">

      {/* Faint blueprint grid — reads as "schematic" rather than decoration */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-[1400px] mx-auto relative z-10 flex flex-col gap-10"
      >
        {/* Alert stays first — it's the thing that needs eyes fastest */}
        <motion.div variants={itemVariants}>
          <AlertBanner />
        </motion.div>

        {/* Header: status, headline, search, actions */}
        <motion.div variants={itemVariants} className="flex flex-col gap-8">
          <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                </div>
                <span className="text-xs font-mono text-primary uppercase tracking-[0.2em] font-semibold">
                  Fleet Synchronized
                </span>
                {now && (
                  <span className="text-xs font-mono text-muted uppercase tracking-[0.15em]">
                    · {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-serif font-medium tracking-tight text-foreground">
                Command Rhythm.
              </h1>
              <p className="text-muted mt-4 max-w-lg text-base leading-relaxed">
                Track every asset from check-out to retirement — utilization, maintenance,
                and lifecycle status, all in one console.
              </p>
            </div>

            <div className="flex flex-col items-start xl:items-end gap-4 w-full xl:w-auto">
              {/* Command-style search instead of a plain input — matches the mono/manifest voice */}
              <button
                className="group flex items-center gap-3 w-full xl:w-72 px-4 py-3 rounded-2xl border border-border bg-surface/50 text-muted hover:text-foreground hover:border-primary/40 transition-colors text-left"
              >
                <Search className="w-4 h-4 shrink-0" />
                <span className="text-sm font-mono flex-1">Search assets, rooms, people…</span>
                <kbd className="hidden sm:inline text-[10px] font-mono px-1.5 py-0.5 rounded border border-border text-muted group-hover:border-primary/40">
                  ⌘K
                </kbd>
              </button>

              <ActionButtonGroup />
            </div>
          </div>

          {/* Signature element: a live manifest ticker, departures-board style */}
          <div className="relative overflow-hidden rounded-2xl border border-border bg-surface/40 py-3">
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-surface to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-surface to-transparent z-10" />
            <motion.div
              className="flex gap-10 whitespace-nowrap font-mono text-xs text-muted tracking-wide"
              animate={{ x: ['0%', '-50%'] }}
              transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
            >
              {[...MANIFEST_TICKS, ...MANIFEST_TICKS].map((line, i) => (
                <span key={i} className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-primary/60" />
                  {line}
                </span>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Stats grid */}
        <motion.div variants={itemVariants} className="flex flex-col gap-6">
          <h2 className="text-xl font-serif font-medium text-foreground">Today's Overview</h2>
          <StatsCardGrid />
        </motion.div>

        {/* Activity + Pulse panel */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="w-full">
            <ActivityFeed />
          </div>

          {/* Replaces the placeholder with something that actually says something */}
          <div className="w-full flex flex-col p-8 bg-surface/50 border border-border rounded-3xl h-full">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-xs font-mono text-muted uppercase tracking-[0.15em] mb-1">
                  Utilization
                </p>
                <p className="text-lg font-serif text-foreground">Last 7 days</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center">
                <Box className="w-4 h-4 text-primary" />
              </div>
            </div>

            <div className="flex items-end gap-3 flex-1 min-h-[120px]">
              {PULSE.map((v, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${v}%` }}
                    transition={{ delay: 0.3 + i * 0.06, duration: 0.6, ease: 'easeOut' }}
                    className={`w-full rounded-md ${i === PULSE.length - 1 ? 'bg-primary' : 'bg-primary/25'
                      }`}
                    style={{ minHeight: 6 }}
                  />
                  <span className="text-[10px] font-mono text-muted">
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 mt-6 pt-6 border-t border-border">
              <ArrowUpRight className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-mono text-muted">
                +14% vs. last week — driven by room bookings
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}