import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

export interface Booking {
  bookingId: string;
  title: string;
  startTime: string;
  endTime: string;
  status: string;
}

interface BookingModalProps {
  isOpen: boolean;
  mode: 'add' | 'edit';
  initialData: Booking | null;
  onClose: () => void;
  onSave: (booking: Booking) => void;
  onDelete?: (bookingId: string) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ isOpen, mode, initialData, onClose, onSave, onDelete }) => {
  const [formData, setFormData] = useState<Partial<Booking>>({
    title: '',
    startTime: '09:00',
    endTime: '10:00',
  });

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && initialData) {
        setFormData(initialData);
      } else {
        setFormData({ title: '', startTime: '10:00', endTime: '11:00' });
      }
    }
  }, [isOpen, mode, initialData]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!formData.title || !formData.startTime || !formData.endTime) return;
    
    const bookingToSave: Booking = {
      bookingId: initialData?.bookingId || `bk_${Date.now()}`,
      title: formData.title,
      startTime: formData.startTime,
      endTime: formData.endTime,
      status: initialData?.status || 'Confirmed'
    };
    onSave(bookingToSave);
  };

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
        initial={{ opacity: 0, scale: 0.95, y: 20 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }} 
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-sm bg-white dark:bg-[#0A1E3F] border border-slate-200 dark:border-cyan-900/50 rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-cyan-900/30">
          <h2 className="text-xl font-serif font-medium text-slate-900 dark:text-white">
            {mode === 'add' ? 'Book a Slot' : 'Edit Booking'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-cyan-100/80 mb-2">Meeting Title *</label>
            <input 
              type="text" 
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="e.g. Procurement Team"
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#030b14] border border-slate-200 dark:border-cyan-900/40 rounded-xl text-slate-800 dark:text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-cyan-100/80 mb-2">Start Time *</label>
              <input 
                type="time" 
                value={formData.startTime}
                onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#030b14] border border-slate-200 dark:border-cyan-900/40 rounded-xl text-slate-800 dark:text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 appearance-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-cyan-100/80 mb-2">End Time *</label>
              <input 
                type="time" 
                value={formData.endTime}
                onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#030b14] border border-slate-200 dark:border-cyan-900/40 rounded-xl text-slate-800 dark:text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 appearance-none"
              />
            </div>
          </div>
        </div>
        
        <div className="p-6 border-t border-slate-100 dark:border-cyan-900/30 flex justify-end gap-3 bg-slate-50/50 dark:bg-cyan-950/10">
          {mode === 'edit' && onDelete && (
            <button 
              onClick={() => onDelete(initialData!.bookingId)}
              className="px-5 py-2.5 mr-auto text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/40 rounded-xl transition-colors"
            >
              Cancel Booking
            </button>
          )}
          <button 
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-semibold text-slate-600 dark:text-cyan-100/70 hover:bg-slate-100 dark:hover:bg-cyan-900/40 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={!formData.title || !formData.startTime || !formData.endTime}
            className="px-5 py-2.5 text-sm font-bold text-white bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-500 dark:hover:bg-cyan-400 rounded-xl shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit
          </button>
        </div>
      </motion.div>
    </div>
  );
};
