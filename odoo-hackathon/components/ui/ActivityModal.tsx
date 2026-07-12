import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowDown, ArrowUp } from 'lucide-react';
import { activities as initialActivities } from './ActivityFeed'; // We'll export the mock data

interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  activities: any[];
}

export const ActivityModal: React.FC<ActivityModalProps> = ({ isOpen, onClose, activities }) => {
  const [sortField, setSortField] = useState<'date' | 'details'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  if (!isOpen) return null;

  // Basic mock sorting since date is a string in mock data ("2 hours ago").
  // In a real app we'd sort by actual Date objects. We'll just alphabetize or reverse based on the mock data.
  const sortedActivities = [...activities].sort((a, b) => {
    let comparison = 0;
    if (sortField === 'details') {
      comparison = a.asset.localeCompare(b.asset);
    } else {
      // Mock sorting for 'date' (just reverse order for demo purposes if asc)
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
          className="w-full max-w-2xl bg-bg-surface border border-border-strong rounded-3xl p-6 shadow-2xl flex flex-col max-h-[80vh]"
        >
          <div className="flex items-center justify-between mb-6 shrink-0">
            <div>
              <h2 className="text-xl font-bold text-text-primary">All Recent Activity</h2>
              <p className="text-sm text-text-secondary mt-1">Full history of operational changes</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-bg-surface-hover text-text-secondary transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Sort Controls */}
          <div className="flex items-center gap-4 mb-4 pb-4 border-b border-border-base shrink-0">
            <span className="text-[13px] font-semibold text-text-secondary">Sort by:</span>
            <button 
              onClick={() => toggleSort('date')}
              className={`flex items-center px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${sortField === 'date' ? 'bg-text-primary text-bg-base' : 'bg-bg-surface-alt text-text-primary hover:bg-bg-surface-hover'}`}
            >
              Time/Date <SortIcon field="date" />
            </button>
            <button 
              onClick={() => toggleSort('details')}
              className={`flex items-center px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${sortField === 'details' ? 'bg-text-primary text-bg-base' : 'bg-bg-surface-alt text-text-primary hover:bg-bg-surface-hover'}`}
            >
              Details (Asset) <SortIcon field="details" />
            </button>
          </div>

          <div className="overflow-y-auto pr-2 space-y-4">
            {sortedActivities.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="flex items-start gap-4 p-4 rounded-2xl bg-bg-base border border-border-base hover:border-border-strong transition-colors group">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${item.bg}`}>
                    <Icon className={`h-[18px] w-[18px] ${item.color}`} />
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <h4 className="text-[14px] font-semibold text-text-primary">{item.asset}</h4>
                    <p className="text-[13px] text-text-secondary mt-0.5">{item.action}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="block text-[12px] font-semibold text-text-primary">{item.time}</span>
                    <span className="block text-[11px] text-text-muted mt-0.5">Today</span>
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
