"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowDown, ArrowUp, Laptop, Calendar, Wrench, ArrowRightLeft, Plus, RefreshCw, FileText } from 'lucide-react';
import { ActivityItem } from './ActivityFeed';

interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  activities: ActivityItem[];
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

export const ActivityModal: React.FC<ActivityModalProps> = ({ isOpen, onClose, activities }) => {
  const [sortField, setSortField] = useState<'date' | 'details'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  if (!isOpen) return null;

  const sortedActivities = [...activities].sort((a, b) => {
    let comparison = 0;
    if (sortField === 'details') {
      comparison = (a.asset || "").localeCompare(b.asset || "");
    } else {
      comparison = 1; 
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const toggleSort = (field: 'date' | 'details') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const SortIcon = ({ field }: { field: 'date' | 'details' }) => {
    if (sortField !== field) return null;
    return sortOrder === 'asc' ? <ArrowUp className="w-3 h-3 ml-1" /> : <ArrowDown className="w-3 h-3 ml-1" />;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={e => e.stopPropagation()}
          className="w-full max-w-2xl bg-surface border border-border rounded-3xl p-6 shadow-2xl flex flex-col max-h-[80vh]"
        >
          <div className="flex items-center justify-between mb-6 shrink-0">
            <div>
              <h2 className="text-xl font-bold text-foreground">All Recent Activity</h2>
              <p className="text-sm text-muted-foreground mt-1">Full history of operational changes</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-surface-hover text-muted-foreground transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex items-center gap-4 mb-4 pb-4 border-b border-border shrink-0">
            <span className="text-[13px] font-semibold text-muted-foreground">Sort by:</span>
            <button 
              onClick={() => toggleSort('date')}
              className={`flex items-center px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${sortField === 'date' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground hover:bg-surface-hover'}`}
            >
              Time/Date <SortIcon field="date" />
            </button>
            <button 
              onClick={() => toggleSort('details')}
              className={`flex items-center px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${sortField === 'details' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground hover:bg-surface-hover'}`}
            >
              Details (Asset) <SortIcon field="details" />
            </button>
          </div>

          <div className="overflow-y-auto pr-2 space-y-4">
            {sortedActivities.map((item) => {
              const { icon: Icon, color, bg } = getIconForType(item.type);
              return (
                <div key={item.id} className="flex items-start gap-4 p-4 rounded-2xl bg-background border border-border hover:border-primary transition-colors group">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${bg}`}>
                    <Icon className={`h-[18px] w-[18px] ${color}`} />
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <h4 className="text-[14px] font-semibold text-foreground">{item.action}</h4>
                    {item.asset && <p className="text-[13px] text-muted-foreground mt-0.5">{item.asset}</p>}
                  </div>
                  <div className="text-right shrink-0">
                    <span className="block text-[12px] font-semibold text-foreground">{item.time}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
