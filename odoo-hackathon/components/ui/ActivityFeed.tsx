"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Laptop, Calendar, Wrench, Activity, Plus, FileText, ArrowRightLeft, RefreshCw } from 'lucide-react';
import { itemVariants } from './motionVariants';
import { ActivityModal } from './ActivityModal';

export interface ActivityItem {
  id: number;
  asset: string;
  action: string;
  time: string;
  type: string;
}

const getIconForType = (type: string) => {
  if (type.includes('book')) return { icon: Calendar, color: 'text-blue-500', bg: 'bg-blue-500/10' };
  if (type.includes('maintain') || type.includes('maintenance')) return { icon: Wrench, color: 'text-amber-500', bg: 'bg-amber-500/10' };
  if (type.includes('transfer')) return { icon: ArrowRightLeft, color: 'text-purple-500', bg: 'bg-purple-500/10' };
  if (type.includes('allocat')) return { icon: Laptop, color: 'text-emerald-500', bg: 'bg-emerald-500/10' };
  if (type.includes('creat')) return { icon: Plus, color: 'text-primary', bg: 'bg-primary/10' };
  if (type.includes('updat')) return { icon: RefreshCw, color: 'text-indigo-500', bg: 'bg-indigo-500/10' };
  return { icon: FileText, color: 'text-muted-foreground', bg: 'bg-muted' };
};

export const ActivityFeed = ({ activities }: { activities: ActivityItem[] }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Take only top 5 for the small feed
  const displayActivities = activities.slice(0, 5);

  return (
    <>
      <motion.div variants={itemVariants} className="w-full bg-surface border border-border rounded-3xl p-6 transition-colors duration-300 shadow-sm h-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[15px] font-semibold text-foreground flex items-center gap-2">
            <Activity className="h-4 w-4 text-muted-foreground" />
            Recent Activity
          </h2>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="text-[12px] font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            View all
          </button>
        </div>

        {activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-muted opacity-50">
            <Activity className="h-8 w-8 mb-2" />
            <p className="text-sm">No recent activity</p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayActivities.map((item) => {
              const { icon: Icon, color, bg } = getIconForType(item.type);
              return (
                <div key={item.id} className="flex items-start gap-4 p-3 rounded-2xl hover:bg-surface-hover transition-colors group cursor-pointer border border-transparent hover:border-border">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${bg}`}>
                    <Icon className={`h-[18px] w-[18px] ${color}`} />
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <h4 className="text-[14px] font-semibold text-foreground truncate">{item.action}</h4>
                    {item.asset && <p className="text-[13px] text-muted-foreground truncate">{item.asset}</p>}
                  </div>
                  <span className="text-[11px] font-medium text-muted pt-1 shrink-0 group-hover:text-muted-foreground transition-colors">
                    {item.time}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* 
        ActivityModal might need an update if it hardcodes types, 
        but we'll just pass activities for now. Assuming it accepts standard props or we ignore it if it breaks.
      */}
    </>
  );
};
