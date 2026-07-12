"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Plus, Calendar, Laptop, Projector, TrendingUp,
  ArrowUpRight, CheckCircle2, Clock, ShieldAlert,
  ArrowRight, Activity, Zap, BarChart3, Wrench
} from 'lucide-react';

// Humanized, smooth, deliberate animation (removing the bouncy AI spring)
const smoothTransition = { type: "tween", ease: "easeOut", duration: 0.35 };

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: smoothTransition }
};

type GlassCardProps = {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
};

const GlassCard = ({ children, className = "", hover = true }: GlassCardProps) => (
  <motion.div
    variants={itemVariants}
    // "Imperfect" organic hover: slight tilt and lift instead of perfect scaling
    whileHover={hover ? { y: -4, rotate: 0.5, transition: smoothTransition } : {}}
    className={`bg-white/80 dark:bg-[#051324]/60 backdrop-blur-2xl border border-slate-200 dark:border-cyan-900/30 rounded-3xl shadow-[0_4px_16px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden relative group ${className}`}
  >
    {/* Subtle inner top highlight */}
    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent" />
    {/* Hover glow effect */}
    {hover && <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-cyan-500/5 via-transparent to-emerald-500/5 transition-opacity duration-500 pointer-events-none" />}
    {children}
  </motion.div>
);

const AudioVisualizer = () => {
  return (
    <div className="flex items-end gap-1 h-12">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <motion.div
          key={i}
          animate={{ height: ["20%", "100%", "30%", "80%", "20%"] }}
          transition={{
            duration: 1.5 + (i % 4) * 0.2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.1,
          }}
          className="w-1.5 bg-gradient-to-t from-cyan-600 to-emerald-400 rounded-t-sm opacity-80"
        />
      ))}
    </div>
  );
};

export default function DeepAuroraDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Original Deep Aurora stats colors restored
  const stats = [
    { label: 'Available Resources', value: '1,248', trend: '+12%', icon: CheckCircle2, color: 'text-emerald-500 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-500/30' },
    { label: 'Active Allocations', value: '876', trend: '+5%', icon: TrendingUp, color: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-50 dark:bg-cyan-950/40 border-cyan-200 dark:border-cyan-500/30' },
    { label: 'Pending Maintenance', value: '24', trend: '-2%', icon: Clock, color: 'text-blue-500 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-500/30' },
    { label: 'Critical Issues', value: '3', trend: '+1', icon: ShieldAlert, color: 'text-teal-600 dark:text-teal-400', bg: 'bg-teal-50 dark:bg-teal-950/40 border-teal-200 dark:border-teal-500/30' },
  ];

  if (!isMounted) return null;

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-[#030b14] text-slate-800 dark:text-slate-200 overflow-hidden font-sans selection:bg-cyan-500/30">

      {/* Ambient background glows - Original restored */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-cyan-900/10 dark:bg-cyan-900/10 blur-[120px]"
        />
        <motion.div
          animate={{ scale: [1, 1.5, 1], rotate: [0, -90, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-emerald-900/10 dark:bg-emerald-900/10 blur-[150px]"
        />
        <div className="absolute inset-0 dark:bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] dark:bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <motion.div
        className="max-w-[1400px] mx-auto px-6 py-12 relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Page heading */}
        <motion.div variants={itemVariants} className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
              </div>
              <span className="text-xs font-mono text-cyan-600 dark:text-cyan-400 uppercase tracking-[0.2em] font-semibold">Fleet Synchronized</span>
            </div>
            {/* Swapped to a classic font-serif for an editorial, non-AI feel, while keeping the tech gradient */}
            <h1 className="text-4xl md:text-5xl font-serif font-medium tracking-tight text-slate-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-white dark:via-cyan-100 dark:to-emerald-200">
              Command Rhythm.
            </h1>
            <p className="text-slate-500 dark:text-cyan-100/60 mt-4 max-w-lg text-base leading-relaxed">
              Track every asset from check-out to retirement — utilization, maintenance, and lifecycle status, all in one console.
            </p>
          </div>

          <div className="flex items-center gap-4 w-full lg:w-auto">
            <motion.button
              whileHover={{ y: -2, transition: smoothTransition }}
              className="flex-1 lg:flex-none px-6 py-3 bg-white dark:bg-[#0A1E3F]/50 border border-slate-200 dark:border-cyan-800/50 backdrop-blur-md rounded-2xl text-sm font-semibold text-slate-700 dark:text-cyan-300 shadow-sm flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-cyan-900/40 hover:border-slate-300 dark:hover:border-cyan-500/50 transition-colors duration-300"
            >
              <Calendar className="h-4 w-4" />
              Schedule Audit
            </motion.button>
            <motion.button
              whileHover={{ y: -2, transition: smoothTransition }}
              className="flex-1 lg:flex-none px-6 py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-2xl text-sm font-bold text-[#010810] shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] transition-all duration-300"
            >
              <Plus className="h-4 w-4" />
              Register Asset
            </motion.button>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="inline-flex items-center gap-2 bg-white dark:bg-[#051324]/80 backdrop-blur-xl p-1.5 rounded-2xl border border-slate-200 dark:border-cyan-900/30 shadow-sm">
            {['overview', 'assets', 'bookings', 'lifecycle'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 text-sm font-semibold rounded-xl capitalize transition-all duration-300 ${activeTab === tab
                  ? 'bg-slate-100 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 shadow-sm dark:shadow-[inset_0_0_20px_rgba(6,182,212,0.1)] border border-slate-200 dark:border-cyan-500/20'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-cyan-200 hover:bg-slate-50 dark:hover:bg-cyan-900/20 border border-transparent'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

          {/* Hero Metric */}
          <GlassCard className="col-span-1 md:col-span-8 p-8 flex flex-col justify-between group">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-500/80 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <Activity className="h-4 w-4" /> Fleet Utilization Rate
                </h2>
                <div className="flex items-end gap-4 mt-6">
                  {/* Swapped to serif for the hero number */}
                  <span className="text-6xl font-serif font-medium tracking-tight text-slate-900 dark:text-white dark:drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">84.2%</span>
                  <span className="flex items-center gap-1 text-sm font-bold text-emerald-600 dark:text-emerald-400 mb-2 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-500/20 px-3 py-1.5 rounded-xl backdrop-blur-sm">
                    <ArrowUpRight className="h-4 w-4" /> 6 pts vs last month
                  </span>
                </div>
                <p className="text-xs font-mono text-slate-500 dark:text-cyan-100/40 mt-4 tracking-wide">
                  1,248 assets tracked · $2.4M replacement value
                </p>
              </div>

              {/* Visualizer Restored */}
              <div className="hidden sm:block opacity-50 group-hover:opacity-100 transition-opacity duration-500">
                <AudioVisualizer />
              </div>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-6 border-t border-slate-200 dark:border-cyan-900/30 pt-8">
              {[
                { label: 'Electronics', val: '512 units', sub: '96% active', icon: Zap },
                { label: 'Infrastructure', val: '340 nodes', sub: '91% uptime', icon: BarChart3 },
                { label: 'Vehicles', val: '96 units', sub: '74% in service', icon: Wrench },
              ].map(({ label, val, sub, icon: Icon }) => (
                <div key={label} className="relative group/stat">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-cyan-100/50 mb-2">
                    <Icon className="h-4 w-4" />
                    <p className="text-xs font-mono uppercase tracking-wider">{label}</p>
                  </div>
                  {/* Values in serif to match the humanized design language */}
                  <p className="text-2xl font-serif text-slate-800 dark:text-slate-200 group-hover/stat:text-cyan-600 dark:group-hover/stat:text-cyan-300 transition-colors">{val}</p>
                  <p className="text-xs text-slate-400 dark:text-cyan-100/40 mt-1">{sub}</p>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Fleet Health Restored with original styles */}
          <GlassCard className="col-span-1 md:col-span-4 p-8 relative overflow-hidden bg-gradient-to-br from-slate-50 dark:from-[#0A1E3F] to-white dark:to-[#010810]">
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-emerald-500/10 blur-[60px] rounded-full pointer-events-none" />

            <div className="h-full flex flex-col justify-between relative z-10">
              <div>
                <div className="bg-emerald-100 dark:bg-emerald-500/20 w-fit p-3 rounded-2xl mb-6 border border-emerald-200 dark:border-emerald-400/30 shadow-sm dark:shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                  <Wrench className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-2xl font-serif text-slate-900 dark:text-white mb-3">Fleet Health</h3>
                <p className="text-slate-500 dark:text-cyan-100/60 text-sm leading-relaxed">
                  No critical maintenance backlog. Average time-to-repair is holding at <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">4.2 hrs</span>, well under the 8 hr SLA target.
                </p>
              </div>
              <button className="mt-8 w-full bg-white dark:bg-cyan-950/40 border border-slate-200 dark:border-cyan-500/30 text-slate-700 dark:text-cyan-300 hover:bg-slate-50 dark:hover:bg-cyan-900 hover:border-cyan-400 py-3.5 rounded-2xl text-sm font-bold transition-all shadow-sm flex items-center justify-center gap-2 group/btn">
                View Maintenance Log
                <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </GlassCard>

          {/* Stats */}
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <GlassCard
                key={stat.label}
                className="col-span-1 md:col-span-3 p-6 group/card cursor-pointer"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className={`p-3 rounded-2xl border ${stat.bg} shadow-inner`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-[#0A1E3F] text-cyan-600 dark:text-cyan-300 border border-slate-200 dark:border-cyan-900/50">
                    {stat.trend}
                  </span>
                </div>
                {/* Stats in serif */}
                <h3 className="text-4xl font-serif tracking-tight text-slate-900 dark:text-white mb-2">{stat.value}</h3>
                <p className="text-xs font-mono text-slate-500 dark:text-cyan-100/50 uppercase tracking-widest">{stat.label}</p>
              </GlassCard>
            );
          })}

          {/* Operational Flow */}
          <GlassCard className="col-span-1 md:col-span-7">
            <div className="p-6 border-b border-slate-200 dark:border-cyan-900/30 flex justify-between items-center bg-slate-50/50 dark:bg-[#051324]/50">
              <h2 className="text-sm font-mono font-bold text-cyan-600 dark:text-cyan-500/80 uppercase tracking-widest flex items-center gap-2">
                <Zap className="h-4 w-4" /> Operational Flow
              </h2>
              <button className="text-xs font-mono text-cyan-600 hover:text-cyan-800 dark:text-cyan-400 dark:hover:text-cyan-200 transition-colors uppercase tracking-wider">Expand Log _</button>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-cyan-900/20">
              {[
                {
                  icon: Laptop,
                  iconColor: 'text-cyan-600 dark:text-cyan-400',
                  iconBg: 'bg-cyan-50 dark:bg-cyan-950/40 border-cyan-200 dark:border-cyan-500/30',
                  title: 'MacBook Pro 16"',
                  tag: 'AF-0114',
                  desc: <>Checked out to <span className="font-medium text-slate-700 dark:text-slate-300">Priya Shah</span> in Engineering.</>,
                  time: 'Just now',
                },
                {
                  icon: Projector,
                  iconColor: 'text-emerald-600 dark:text-emerald-400',
                  iconBg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-500/30',
                  title: 'Sony 4K Projector',
                  tag: 'AF-0062',
                  desc: <>Maintenance closed out. Status set to <span className="text-emerald-600 dark:text-emerald-400 font-mono text-xs border border-emerald-300 dark:border-emerald-500/30 px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 ml-1">Available</span>.</>,
                  time: '2h ago',
                },
                {
                  icon: Calendar,
                  iconColor: 'text-blue-600 dark:text-blue-400',
                  iconBg: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-500/30',
                  title: 'Conference Room B2',
                  tag: null,
                  desc: <>Reserved by <span className="font-medium text-slate-700 dark:text-slate-300">Raj Patel</span> for tomorrow, 10:00 - 11:30 AM.</>,
                  time: '5h ago',
                },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="p-6 hover:bg-slate-50 dark:hover:bg-[#0A1E3F]/40 transition-colors flex gap-5 items-start group/row">
                    <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 shadow-[inset_0_0_10px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] ${item.iconBg}`}>
                      <Icon className={`h-5 w-5 ${item.iconColor} group-hover/row:scale-110 transition-transform`} />
                    </div>
                    <div className="flex-1 pt-1">
                      <div className="flex justify-between items-start mb-1">
                        <p className="text-base text-slate-800 dark:text-slate-200 font-semibold flex items-center gap-3">
                          {item.title}
                          {item.tag && (
                            <span className="text-cyan-600 dark:text-cyan-400 font-mono border border-cyan-200 dark:border-cyan-800 bg-cyan-50 dark:bg-[#0A1E3F] px-2 py-0.5 rounded-md text-[10px] tracking-widest shadow-inner">
                              {item.tag}
                            </span>
                          )}
                        </p>
                        <span className="text-xs text-slate-400 dark:text-cyan-100/40 font-mono tracking-wider shrink-0">{item.time}</span>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-cyan-100/60 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>

          {/* Quick Actions */}
          <GlassCard className="col-span-1 md:col-span-5 p-6">
            <h2 className="text-sm font-mono font-bold text-cyan-600 dark:text-cyan-500/80 uppercase tracking-widest mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 gap-4">
              {[
                { icon: ArrowUpRight, label: 'Transfer Asset', desc: 'Move equipment between departments or sites', color: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-50 dark:bg-cyan-950/40 border-cyan-200 dark:border-cyan-500/30', hover: 'hover:border-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-900/20' },
                { icon: ShieldAlert, label: 'Report Damage', desc: 'Flag a fault for immediate triage', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-500/30', hover: 'hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20' },
                { icon: CheckCircle2, label: 'Approve Maintenance', desc: '3 requests awaiting sign-off', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-500/30', hover: 'hover:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20' },
              ].map((wf) => {
                const Icon = wf.icon;
                return (
                  <motion.button
                    key={wf.label}
                    // Imperfect human hover logic for inner buttons
                    whileHover={{ scale: 1.01, x: 4, transition: smoothTransition }}
                    className={`flex items-center gap-5 p-4 rounded-2xl border border-slate-200 dark:border-cyan-900/30 bg-white dark:bg-[#051324]/50 transition-all text-left group/btn ${wf.hover}`}
                  >
                    <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shadow-inner ${wf.bg}`}>
                      <Icon className={`h-5 w-5 ${wf.color}`} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover/btn:text-slate-900 dark:group-hover/btn:text-white transition-colors">{wf.label}</h4>
                      <p className="text-xs text-slate-500 dark:text-cyan-100/50 mt-1">{wf.desc}</p>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </GlassCard>

        </div>
      </motion.div>
    </div>
  );
}