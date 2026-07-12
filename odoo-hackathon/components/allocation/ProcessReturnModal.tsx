import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, CornerDownLeft } from 'lucide-react';

export interface ProcessReturnModalProps {
  isOpen: boolean;
  asset: any | null;
  onClose: () => void;
  onConfirm: (assetId: string, notes: string, newStatus: string) => void;
}

export const ProcessReturnModal: React.FC<ProcessReturnModalProps> = ({ isOpen, asset, onClose, onConfirm }) => {
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('Available');

  if (!isOpen || !asset) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(asset.assetId, notes, status);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        className="absolute inset-0 bg-black/50 dark:bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-md bg-bg-surface border border-border-base rounded-2xl shadow-2xl overflow-hidden transition-colors duration-300"
      >
        <div className="flex items-center justify-between p-6 border-b border-border-base shrink-0">
          <h2 className="text-lg font-semibold tracking-tight text-text-primary flex items-center gap-2">
            <CornerDownLeft className="h-5 w-5 text-text-secondary" /> Process Return
          </h2>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-5">
            <div className="bg-bg-surface-alt p-4 rounded-xl border border-border-base">
              <p className="text-[12px] text-text-secondary font-medium">Asset to Return</p>
              <p className="text-[14px] text-text-primary font-semibold mt-1">{asset.assetId} - {asset.name}</p>
              <p className="text-[12px] text-text-muted mt-1">Currently assigned to {asset.currentOwner?.name}</p>
            </div>

            <div>
              <label className="block text-[13px] font-medium text-text-secondary mb-2">Check-in Notes (Condition, accessories, etc.)</label>
              <textarea 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g., Device returned in good condition, charger included."
                rows={3}
                required
                className="w-full px-4 py-3 bg-bg-base border border-border-strong rounded-xl text-[13px] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-border-focus resize-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-text-secondary mb-2">Update Asset Status To</label>
              <select 
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-3 bg-bg-base border border-border-strong rounded-xl text-[13px] text-text-primary focus:outline-none focus:border-border-focus appearance-none cursor-pointer transition-colors"
              >
                <option value="Available">Available (Ready to be reassigned)</option>
                <option value="Maintenance">Under Maintenance (Needs repair/cleaning)</option>
                <option value="Retired">Retired (End of life/Damaged)</option>
              </select>
            </div>
          </div>
          
          <div className="p-6 border-t border-border-base flex justify-end gap-3 bg-bg-surface-alt transition-colors duration-300">
            <button 
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-[13px] font-medium text-text-secondary hover:text-text-primary transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={!notes}
              className="px-5 py-2 text-[13px] font-medium text-text-inverted bg-bg-inverted hover:opacity-90 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Complete Return
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
