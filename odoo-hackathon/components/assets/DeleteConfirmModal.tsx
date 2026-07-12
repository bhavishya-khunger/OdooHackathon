import React from 'react';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { Asset } from './AssetTable';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  asset: Asset | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({ isOpen, asset, onClose, onConfirm }) => {
  if (!isOpen || !asset) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        className="absolute inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-md bg-white dark:bg-[#0A1E3F] border border-slate-200 dark:border-red-900/30 rounded-3xl shadow-2xl overflow-hidden p-6 text-center"
      >
        <div className="mx-auto w-12 h-12 bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-center rounded-full mb-4">
          <Trash2 className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-serif font-medium text-slate-900 dark:text-white mb-2">
          Delete Asset?
        </h2>
        <p className="text-slate-500 dark:text-cyan-100/60 mb-6 text-sm leading-relaxed">
          Are you sure you want to delete <span className="font-bold text-slate-800 dark:text-white">{asset.tag} - {asset.name}</span>? This action cannot be undone.
        </p>
        <div className="flex gap-3 justify-center">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 flex-1 text-sm font-semibold text-slate-600 dark:text-cyan-100/70 hover:bg-slate-100 dark:hover:bg-cyan-900/40 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className="px-5 py-2.5 flex-1 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-sm transition-colors"
          >
            Delete
          </button>
        </div>
      </motion.div>
    </div>
  );
};
