"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { AlertOctagon, X, ArrowRight } from 'lucide-react';
import { itemVariants } from './motionVariants';

export const AlertBanner = () => {
  return (
    <motion.div 
      variants={itemVariants}
      className="bg-red-50 dark:bg-[#2a1215] border border-red-200 dark:border-[#4a1a1f] rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full transition-colors duration-300"
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-[#4a1a1f] flex items-center justify-center shrink-0 transition-colors duration-300">
          <AlertOctagon className="h-5 w-5 text-red-600 dark:text-[#ff4444]" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-red-900 dark:text-[#ff8888]">Action Required</h3>
          <p className="text-[13px] text-red-700 dark:text-[#ffaaaa] mt-0.5">3 assets overdue for return - flagged for follow-up</p>
        </div>
      </div>
      
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <button className="flex-1 sm:flex-none px-4 py-2 text-[13px] font-semibold text-red-600 dark:text-[#ff4444] bg-red-100 dark:bg-[#4a1a1f] hover:bg-red-200 dark:hover:bg-[#5a1a1f] border border-red-200 dark:border-[#ff4444]/30 rounded-xl transition-colors flex items-center justify-center gap-2">
          Review Now <ArrowRight className="h-3.5 w-3.5" />
        </button>
        <button className="p-2 text-red-700 dark:text-[#ff8888] hover:text-red-900 dark:hover:text-[#ff4444] hover:bg-red-100 dark:hover:bg-[#4a1a1f] rounded-xl transition-colors shrink-0">
          <X className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
};
