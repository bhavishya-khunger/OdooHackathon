import React from 'react';
import { Trash2 } from 'lucide-react';
import { AssetResponse } from './AssetTable';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  asset: AssetResponse | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({ isOpen, asset, onClose, onConfirm }) => {
  if (!isOpen || !asset) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans">
      <div 
        className="absolute inset-0 bg-black/50 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />
      <div 
        className="relative w-full max-w-sm bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden p-6 text-center transition-colors duration-300 animate-in zoom-in-95 duration-200"
      >
        <div className="mx-auto w-12 h-12 bg-red-100 dark:bg-[#2a1215] text-rose-500 flex items-center justify-center rounded-full mb-4 transition-colors duration-300">
          <Trash2 className="h-5 w-5" />
        </div>
        <h2 className="text-lg font-semibold text-foreground mb-2 transition-colors duration-300">
          Retire Asset?
        </h2>
        <p className="text-muted mb-6 text-[13px] transition-colors duration-300">
          Are you sure you want to retire <span className="font-bold text-foreground">{asset.tag} - {asset.name}</span>? It will no longer be available for allocation.
        </p>
        <div className="flex gap-3 justify-center">
          <button 
            onClick={onClose}
            className="px-5 py-2 flex-1 text-[13px] font-medium text-muted hover:text-foreground bg-surface-hover hover:bg-border-strong rounded-full transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className="px-5 py-2 flex-1 text-[13px] font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-full transition-colors"
          >
            Retire Asset
          </button>
        </div>
      </div>
    </div>
  );
};
