"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, ClipboardList, Repeat, Wrench, CalendarCheck, FileBarChart } from 'lucide-react';

const LIFECYCLE = [
  {
    n: '01',
    title: 'Register',
    verb: 'Tag it',
    desc: 'Every laptop, room, and projector gets an ID the moment it enters the fleet.',
    icon: ClipboardList,
  },
  {
    n: '02',
    title: 'Allocate',
    verb: 'Assign it',
    desc: 'Hand assets to people or departments with an approval trail, not a spreadsheet.',
    icon: Repeat,
  },
  {
    n: '03',
    title: 'Maintain',
    verb: 'Service it',
    desc: 'Flag issues, schedule repairs, and clear maintenance without losing the thread.',
    icon: Wrench,
  },
  {
    n: '04',
    title: 'Book',
    verb: 'Reserve it',
    desc: 'Rooms and shared equipment booked in real time — no double-bookings.',
    icon: CalendarCheck,
  },
  {
    n: '05',
    title: 'Report',
    verb: 'Audit it',
    desc: 'Every transfer and return logged, ready for compliance whenever it\'s asked for.',
    icon: FileBarChart,
  },
];

const MANIFEST_PREVIEW = [
  "AF-0114 · LAPTOP → PRIYA SHAH / IT",
  "RM-B2 · ROOM → BOOKED 14:00–15:00",
  "AF-0062 · PROJECTOR → MAINTENANCE CLEARED",
  "AF-0091 · MONITOR → RETURN OVERDUE 2D",
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 flex flex-col">
      {/* Nav */}
      <header className="w-full px-6 py-6 md:px-12 md:py-8 flex justify-between items-center border-b border-border/50">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="AssetFlow Logo" className="w-8 h-8 object-contain" />
          <span className="text-xl font-medium tracking-tight text-foreground">AssetFlow.</span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm text-muted font-mono uppercase tracking-wide">
          <a href="#lifecycle" className="hover:text-foreground transition-colors">Lifecycle</a>
          <a href="#preview" className="hover:text-foreground transition-colors">Live Preview</a>
        </nav>
        <Link
          href="/login"
          className="px-6 py-2.5 bg-foreground text-background rounded-full text-sm font-medium hover:bg-foreground/90 transition-all flex items-center gap-2 group shadow-sm hover:shadow-md"
        >
          Sign In
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto px-6 pt-20 pb-24 w-full">
          {/* Left: copy */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border/50 bg-surface/50 mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-xs font-mono text-foreground uppercase tracking-wide">v2.0 — Smart Bookings live</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-serif font-medium tracking-tight leading-[1.08] mb-6">
              Every asset,<br />on the record.
            </h1>

            <p className="text-lg text-muted max-w-md leading-relaxed mb-10">
              Register, allocate, maintain, and book physical assets from one console —
              built for teams who'd rather not track laptops in a spreadsheet.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/login"
                className="px-8 py-4 bg-primary text-primary-foreground rounded-full text-base font-semibold hover:bg-primary-hover hover:-translate-y-0.5 transition-all shadow-lg hover:shadow-primary/30 flex justify-center items-center"
              >
                Get Started
              </Link>

              <a href="#lifecycle"
                className="px-8 py-4 bg-surface text-foreground border border-border rounded-full text-base font-medium hover:bg-surface-hover hover:-translate-y-0.5 transition-all flex justify-center items-center">
                See how it works
              </a>
            </div>
          </div>

          {/* Right: signature — an actual asset tag, not a gradient blob */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="relative flex justify-center lg:justify-end"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="relative w-72 rounded-2xl border border-border bg-surface/70 backdrop-blur-sm shadow-xl p-5"
            >
              {/* punch hole */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-background border border-border" />

              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-mono text-muted uppercase tracking-[0.2em]">Asset Tag</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-primary/15 text-primary uppercase tracking-wide">
                  Allocated
                </span>
              </div>

              <p className="text-2xl font-serif text-foreground mb-1">AF-0114</p>
              <p className="text-sm text-muted mb-6">Dell Latitude · IT Dept</p>

              {/* barcode */}
              <div
                className="h-10 w-full rounded-sm mb-3"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(90deg, currentColor 0 2px, transparent 2px 5px, currentColor 5px 6px, transparent 6px 9px, currentColor 9px 12px, transparent 12px 14px)',
                  color: 'var(--foreground, currentColor)',
                  opacity: 0.6,
                }}
              />
              <p className="text-[10px] font-mono text-muted tracking-[0.3em]">
                7X9K–AF0114–IT
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Live preview strip — ties the pitch to the real product */}
        <div id="preview" className="border-y border-border/50 bg-surface/40 py-3 overflow-hidden">
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-background to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background to-transparent z-10" />
            <motion.div
              className="flex gap-10 whitespace-nowrap font-mono text-xs text-muted tracking-wide"
              animate={{ x: ['0%', '-50%'] }}
              transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
            >
              {[...MANIFEST_PREVIEW, ...MANIFEST_PREVIEW].map((line, i) => (
                <span key={i} className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-primary/60" />
                  {line}
                </span>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Lifecycle — a real sequence, so numbering earns its place here */}
        <div id="lifecycle" className="py-24">
          <div className="max-w-6xl mx-auto px-6">
            <div className="mb-16 max-w-xl">
              <span className="text-xs font-mono text-primary uppercase tracking-[0.2em]">The lifecycle</span>
              <h2 className="text-3xl font-serif font-medium tracking-tight mt-3 mb-4">
                Five steps. One console.
              </h2>
              <p className="text-muted leading-relaxed">
                This is the actual path every asset takes through AssetFlow — not a feature list, the order things really happen.
              </p>
            </div>

            <div className="relative">
              <div className="hidden lg:block absolute top-8 left-0 right-0 h-px bg-border" />
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-6">
                {LIFECYCLE.map((step) => (
                  <div key={step.n} className="relative flex flex-col">
                    <div className="relative z-10 w-16 h-16 rounded-2xl bg-background border border-border flex items-center justify-center mb-6">
                      <step.icon className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-xs font-mono text-muted tracking-[0.15em] mb-1">{step.n}</span>
                    <h3 className="text-lg font-semibold text-foreground mb-1">{step.title}</h3>
                    <p className="text-xs font-mono text-primary/80 uppercase tracking-wide mb-2">{step.verb}</p>
                    <p className="text-sm text-muted leading-relaxed">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Closing CTA */}
        <div className="border-t border-border/50 py-20">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-serif font-medium tracking-tight mb-4">
              Stop tracking assets in a spreadsheet.
            </h2>
            <p className="text-muted mb-8">No credit card. No fleet too small to start with.</p>
            <Link
              href="/login"
              className="inline-flex px-8 py-4 bg-primary text-primary-foreground rounded-full text-base font-semibold hover:bg-primary-hover hover:-translate-y-0.5 transition-all shadow-lg hover:shadow-primary/30"
            >
              Get Started
            </Link>
          </div>
        </div>
      </main >

      <footer className="border-t border-border/50 py-8 px-6 text-center bg-background">
        <p className="text-sm text-muted">© 2026 AssetFlow Inc. All rights reserved.</p>
      </footer>
    </div >
  );
}