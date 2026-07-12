import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-sm bg-bg-surface border border-border-base rounded-2xl shadow-2xl overflow-hidden p-6 text-center"
      >
        <div className="mx-auto w-12 h-12 bg-[#2a1215] text-[#ff4444] flex items-center justify-center rounded-full mb-4">
          <Trash2 className="h-5 w-5" />
        </div>
        <h2 className="text-lg font-semibold text-text-primary mb-2">
          Delete Asset?
        </h2>
        <p className="text-text-secondary mb-6 text-[13px]">
          Are you sure you want to delete <span className="font-bold text-text-primary">{asset.tag} - {asset.name}</span>? This action cannot be undone.
        </p>
        <div className="flex gap-3 justify-center">
          <button 
            onClick={onClose}
            className="px-5 py-2 flex-1 text-[13px] font-medium text-text-secondary hover:text-text-primary bg-bg-surface-hover hover:bg-border-strong rounded-full transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className="px-5 py-2 flex-1 text-[13px] font-medium text-text-inverted bg-[#ff4444] hover:bg-[#ff6666] rounded-full transition-colors"
          >
            Delete
          </button>
        </div>
      </motion.div>
    </div>
  );
};
