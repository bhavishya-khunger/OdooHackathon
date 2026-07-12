import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import { UserProfile } from './UserTable';

interface DeleteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  user: UserProfile | null;
}

export const DeleteUserModal: React.FC<DeleteUserModalProps> = ({ isOpen, onClose, onConfirm, user }) => {
  if (!isOpen || !user) return null;

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
          className="w-full max-w-sm bg-bg-surface border border-border-strong rounded-3xl p-6 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-danger-base" />
          
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 rounded-full bg-danger-base/10 flex items-center justify-center shrink-0">
              <AlertTriangle className="h-5 w-5 text-danger-base" />
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-bg-surface-hover text-text-secondary transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <h3 className="text-xl font-bold text-text-primary mb-2">Delete User</h3>
          <p className="text-text-secondary text-sm mb-6 leading-relaxed">
            Are you sure you want to delete <span className="font-semibold text-text-primary">{user.name}</span>? This action cannot be undone.
          </p>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl text-text-secondary hover:bg-bg-surface-hover hover:text-text-primary font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2.5 rounded-xl bg-danger-base hover:bg-danger-hover text-white font-medium transition-colors"
            >
              Delete
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
