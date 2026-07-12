"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { AlertOctagon, X, ArrowRight } from 'lucide-react';
import { itemVariants } from './motionVariants';

export const AlertBanner = () => {
  return (
    <motion.div 
      variants={itemVariants}
      className="w-full relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-50 to-red-100/50 dark:from-red-950/40 dark:to-red-900/20 border border-red-200 dark:border-red-500/30 shadow-sm"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 dark:bg-red-500/20 blur-[80px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2" />
      
      <div className="px-6 py-4 flex items-center justify-between relative z-10 gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-red-100 dark:bg-red-500/20 p-2.5 rounded-xl border border-red-200 dark:border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.15)] flex-shrink-0 animate-pulse">
            <AlertOctagon className="h-5 w-5 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-red-900 dark:text-red-200 font-sans">
              Action Required
            </h3>
            <p className="text-sm text-red-700/80 dark:text-red-300/80 mt-0.5">
              <span className="font-bold text-red-800 dark:text-red-300">3 assets</span> overdue for return - flagged for follow-up.
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="hidden sm:flex px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors items-center gap-2 group">
            Resolve Now
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
          <button className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
