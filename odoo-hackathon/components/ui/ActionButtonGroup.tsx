"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Calendar, FileText } from 'lucide-react';
import { itemVariants, smoothTransition } from './motionVariants';

const buttons = [
  { label: '+ Register Asset', type: 'primary', icon: Plus },
  { label: 'Book Resource', type: 'secondary', icon: Calendar },
  { label: 'Raise Requests', type: 'secondary', icon: FileText }
];

export const ActionButtonGroup = () => {
  return (
    <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4">
      {buttons.map((btn, idx) => {
        const Icon = btn.icon;
        if (btn.type === 'primary') {
          return (
            <motion.button
              key={idx}
              whileHover={{ y: -2, scale: 1.02, transition: smoothTransition }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-2xl text-sm font-bold text-[#010810] shadow-[0_0_20px_rgba(6,182,212,0.3)] flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all duration-300 border border-transparent"
            >
              <Icon className="h-4 w-4" />
              {btn.label.replace('+', '').trim()}
            </motion.button>
          );
        }
        return (
          <motion.button
            key={idx}
            whileHover={{ y: -2, scale: 1.02, transition: smoothTransition }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-3 bg-white dark:bg-[#0A1E3F]/50 border border-slate-200 dark:border-cyan-800/50 backdrop-blur-md rounded-2xl text-sm font-semibold text-slate-700 dark:text-cyan-300 shadow-sm flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-cyan-900/40 hover:border-slate-300 dark:hover:border-cyan-500/50 transition-colors duration-300"
          >
            <Icon className="h-4 w-4 text-slate-400 dark:text-cyan-500" />
            {btn.label}
          </motion.button>
        );
      })}
    </motion.div>
  );
};
