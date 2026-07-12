"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { itemVariants } from './motionVariants';
import Link from 'next/link';

const overdueItems = [
  {
    asset: "MacBook Pro M2",
    assignedTo: "David Chen",
    expectedReturn: "2026-07-10",
    daysOverdue: 2,
  },
  {
    asset: "Sony A7IV Camera",
    assignedTo: "Sarah Jenkins",
    expectedReturn: "2026-07-08",
    daysOverdue: 4,
  },
];

export const OverdueReturns = () => {
  return (
    <motion.div variants={itemVariants} className="w-full bg-danger-base/5 border border-danger-base/20 rounded-3xl p-6 transition-colors duration-300">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[15px] font-bold text-danger-base flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Overdue Returns
        </h2>
        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-danger-base text-white">
          {overdueItems.length} Action Required
        </span>
      </div>

      <div className="space-y-3">
        {overdueItems.map((item, index) => (
          <div key={index} className="flex flex-col gap-1 p-3 rounded-2xl bg-bg-surface border border-danger-base/10 hover:border-danger-base/30 transition-colors group cursor-pointer shadow-sm">
            <div className="flex justify-between items-start">
              <h4 className="text-[14px] font-semibold text-text-primary">{item.asset}</h4>
              <span className="text-[12px] font-bold text-danger-base">
                {item.daysOverdue} {item.daysOverdue === 1 ? 'day' : 'days'} overdue
              </span>
            </div>
            <div className="flex justify-between items-center text-[12px] text-text-secondary mt-1">
              <span>Assigned to: <span className="font-medium text-text-primary">{item.assignedTo}</span></span>
              <span>Expected: {item.expectedReturn}</span>
            </div>
          </div>
        ))}
      </div>
      
      <Link href="/allocation" className="block w-full mt-4">
        <button className="w-full py-2.5 rounded-xl text-[13px] font-semibold text-danger-base hover:bg-danger-base/10 transition-colors flex items-center justify-center gap-2">
          Follow Up All <ArrowRight className="h-4 w-4" />
        </button>
      </Link>
    </motion.div>
  );
};
