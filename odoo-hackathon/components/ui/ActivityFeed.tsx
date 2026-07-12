"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Laptop, Calendar, Wrench, Activity } from 'lucide-react';
import { itemVariants } from './motionVariants';

const activities = [
  {
    asset: "Laptop - Mac M2",
    action: "Assigned to Aditi Rao",
    time: "2 hours ago",
    icon: Laptop,
    color: "text-[#888]",
    bg: "bg-[#1A1A1A]"
  },
  {
    asset: "Conf Room A",
    action: "Booked by Marketing Team",
    time: "5 hours ago",
    icon: Calendar,
    color: "text-[#888]",
    bg: "bg-[#1A1A1A]"
  },
  {
    asset: "Projector X1",
    action: "Sent for maintenance",
    time: "1 day ago",
    icon: Wrench,
    color: "text-[#888]",
    bg: "bg-[#1A1A1A]"
  }
];

export const ActivityFeed = () => {
  return (
    <motion.div variants={itemVariants} className="w-full bg-[#141414] border border-[#222] rounded-3xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[15px] font-semibold text-[#f5f5f5] flex items-center gap-2">
          <Activity className="h-4 w-4 text-[#888]" />
          Recent Activity
        </h2>
        <button className="text-[12px] font-medium text-[#888] hover:text-[#f5f5f5] transition-colors">
          View all
        </button>
      </div>

      <div className="space-y-4">
        {activities.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="flex items-start gap-4 p-3 rounded-2xl hover:bg-[#1A1A1A] transition-colors group cursor-pointer border border-transparent hover:border-[#2A2A2A]">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${item.bg}`}>
                <Icon className={`h-[18px] w-[18px] ${item.color}`} />
              </div>
              <div className="flex-1 min-w-0 pt-0.5">
                <h4 className="text-[14px] font-semibold text-[#f5f5f5] truncate">{item.asset}</h4>
                <p className="text-[13px] text-[#888] truncate">{item.action}</p>
              </div>
              <span className="text-[11px] font-medium text-[#666] pt-1 shrink-0 group-hover:text-[#888] transition-colors">
                {item.time}
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};
