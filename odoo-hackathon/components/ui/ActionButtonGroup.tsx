"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Calendar, FileText } from 'lucide-react';
import { itemVariants, smoothTransition } from './motionVariants';

const buttons = [
  { label: 'Register Asset', icon: Plus, primary: true },
  { label: 'Schedule Maintenance', icon: Calendar, primary: false },
  { label: 'Generate Report', icon: FileText, primary: false }
];

export const ActionButtonGroup = () => {
  return (
    <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3">
      {buttons.map((btn, idx) => {
        const Icon = btn.icon;
        return (
          <motion.button
            key={idx}
            whileHover={{ scale: 1.02, transition: smoothTransition }}
            whileTap={{ scale: 0.98 }}
            className={`px-5 py-2.5 rounded-full text-[13px] font-medium flex items-center gap-2 transition-colors border ${
              btn.primary 
                ? 'bg-bg-inverted text-text-inverted border-transparent hover:opacity-90' 
                : 'bg-bg-surface text-text-primary border-border-strong hover:bg-bg-surface-hover hover:border-border-focus'
            }`}
          >
            <Icon className="h-4 w-4" />
            {btn.label}
          </motion.button>
        );
      })}
    </motion.div>
  );
};
