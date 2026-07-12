import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

export interface Booking {
  bookingId: string;
  title: string;
  startTime: string;
  endTime: string;
  status: 'Upcoming' | 'Ongoing' | 'Completed' | 'Cancelled';
  reminder?: boolean;
}

interface BookingModalProps {
  isOpen: boolean;
  mode: 'add' | 'edit';
  initialData: Booking | null;
  onClose: () => void;
  onSave: (booking: Booking) => void;
  onCancel?: (bookingId: string) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ isOpen, mode, initialData, onClose, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Booking>>({
    title: '',
    startTime: '09:00',
    endTime: '10:00',
    status: 'Upcoming',
    reminder: false
  });

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && initialData) {
        setFormData(initialData);
      } else {
        setFormData({ title: '', startTime: '10:00', endTime: '11:00', status: 'Upcoming', reminder: false });
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
      status: formData.status as 'Upcoming' | 'Ongoing' | 'Completed' | 'Cancelled',
      reminder: formData.reminder
    };
    onSave(bookingToSave);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
        className="relative w-full max-w-sm bg-bg-surface border border-border-base rounded-2xl shadow-2xl overflow-hidden transition-colors duration-300"
      >
        <div className="flex items-center justify-between p-6 border-b border-border-base">
          <h2 className="text-lg font-semibold tracking-tight text-text-primary">
            {mode === 'add' ? 'Book a Slot' : 'Edit Booking'}
          </h2>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-5">
          <div>
            <label className="block text-[13px] font-medium text-text-secondary mb-2">Meeting Title *</label>
            <input 
              type="text" 
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="e.g. Procurement Team"
              className="w-full px-4 py-2.5 bg-bg-base border border-border-strong rounded-xl text-[13px] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-border-focus transition-colors"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-medium text-text-secondary mb-2">Start Time *</label>
              <input 
                type="time" 
                value={formData.startTime}
                onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                className="w-full px-4 py-2.5 bg-bg-base border border-border-strong rounded-xl text-[13px] text-text-primary focus:outline-none focus:border-border-focus appearance-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-text-secondary mb-2">End Time *</label>
              <input 
                type="time" 
                value={formData.endTime}
                onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                className="w-full px-4 py-2.5 bg-bg-base border border-border-strong rounded-xl text-[13px] text-text-primary focus:outline-none focus:border-border-focus appearance-none transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center justify-between bg-bg-surface-alt p-4 rounded-xl border border-border-base">
            <div>
              <p className="text-[13px] font-medium text-text-primary flex items-center gap-2">
                Set Reminder
              </p>
              <p className="text-[11px] text-text-secondary mt-0.5">Get notified 15 mins before</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={formData.reminder || false}
                onChange={(e) => setFormData({...formData, reminder: e.target.checked})}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-border-strong peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-text-primary"></div>
            </label>
          </div>
        </div>
        
        <div className="p-6 border-t border-border-base flex justify-end gap-3 bg-bg-surface-alt transition-colors duration-300">
          {mode === 'edit' && onCancel && formData.status !== 'Cancelled' && (
            <button 
              onClick={() => onCancel(initialData!.bookingId)}
              className="px-5 py-2 mr-auto text-[13px] font-medium text-red-600 dark:text-[#ff4444] hover:bg-bg-surface-hover rounded-full transition-colors"
            >
              Cancel Booking
            </button>
          )}
          <button 
            onClick={onClose}
            className="px-5 py-2 text-[13px] font-medium text-text-secondary hover:text-text-primary transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={!formData.title || !formData.startTime || !formData.endTime}
            className="px-5 py-2 text-[13px] font-medium text-text-inverted bg-bg-inverted hover:opacity-90 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit
          </button>
        </div>
      </motion.div>
    </div>
  );
};
