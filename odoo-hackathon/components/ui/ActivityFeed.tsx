"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Laptop, Calendar, Wrench, Activity } from 'lucide-react';
import { itemVariants } from './motionVariants';

const activities = [
  {
    asset: "Laptop AF-0114",
    action: "allocated to Priya shah - IT dept",
    icon: Laptop,
    time: "10 mins ago",
    colorClass: "text-blue-600 dark:text-blue-400",
    bgClass: "bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-500/30"
  },
  {
    asset: "Room B2",
    action: "booking confirmed - 2:00 to 3:00 PM",
    icon: Calendar,
    time: "1 hour ago",
    colorClass: "text-purple-600 dark:text-purple-400",
    bgClass: "bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-500/30"
  },
  {
    asset: "Projector AF-0062",
    action: "maintenance resolved",
    icon: Wrench,
    time: "3 hours ago",
    colorClass: "text-emerald-600 dark:text-emerald-400",
    bgClass: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-500/30"
  }
];

export const ActivityFeed = () => {
  return (
    <motion.div 
      variants={itemVariants}
      className="bg-white/80 dark:bg-[#051324]/60 backdrop-blur-2xl border border-slate-200 dark:border-cyan-900/30 rounded-3xl shadow-[0_4px_16px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden w-full relative"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent" />
      
      <div className="p-6 border-b border-slate-200 dark:border-cyan-900/30 flex justify-between items-center bg-slate-50/50 dark:bg-[#051324]/50">
        <h2 className="text-sm font-mono font-bold text-slate-800 dark:text-cyan-500/80 uppercase tracking-widest flex items-center gap-2">
          <Activity className="h-4 w-4 text-cyan-600 dark:text-cyan-400" /> Recent Activity
        </h2>
        <button className="text-xs font-mono text-cyan-600 hover:text-cyan-800 dark:text-cyan-400 dark:hover:text-cyan-200 transition-colors uppercase tracking-wider">
          View All _
        </button>
      </div>
      
      <div className="divide-y divide-slate-100 dark:divide-cyan-900/20">
        {activities.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="p-5 hover:bg-slate-50 dark:hover:bg-[#0A1E3F]/40 transition-colors flex gap-4 items-start group/row">
              <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center shrink-0 shadow-[inset_0_0_10px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] ${item.bgClass}`}>
                <Icon className={`h-4 w-4 ${item.colorClass} group-hover/row:scale-110 transition-transform`} />
              </div>
              
              <div className="flex-1 pt-0.5">
                <div className="flex justify-between items-start gap-4">
                  <p className="text-sm text-slate-800 dark:text-slate-200 font-semibold truncate flex items-center gap-2">
                    {item.asset}
                  </p>
                  <span className="text-[11px] text-slate-400 dark:text-cyan-100/40 font-mono tracking-wider shrink-0 mt-0.5">
                    {item.time}
                  </span>
                </div>
                <p className="text-sm text-slate-500 dark:text-cyan-100/60 leading-relaxed mt-1">
                  {item.action}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};
