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
  error?: string | null;
  onClose: () => void;
  onSave: (booking: Booking) => void;
  onCancel?: (bookingId: string) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ isOpen, mode, initialData, error, onClose, onSave, onCancel }) => {
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
        className="absolute inset-0 bg-black/50 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-sm bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden transition-colors duration-300"
      >
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            {mode === 'add' ? 'Book a Slot' : 'Edit Booking'}
          </h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-[13px] text-red-600 dark:text-red-400 flex items-start gap-2">
              <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-[13px] font-medium text-muted-foreground mb-2">Meeting Title *</label>
            <input 
              type="text" 
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="e.g. Procurement Team"
              className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-[13px] text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-medium text-muted-foreground mb-2">Start Time *</label>
              <input 
                type="time" 
                value={formData.startTime}
                onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-muted-foreground mb-2">End Time *</label>
              <input 
                type="time" 
                value={formData.endTime}
                onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center justify-between bg-muted p-4 rounded-xl border border-border">
            <div>
              <p className="text-[13px] font-medium text-foreground flex items-center gap-2">
                Set Reminder
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Get notified 15 mins before</p>
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
        
        <div className="p-6 border-t border-border flex justify-end gap-3 bg-muted transition-colors duration-300">
          {mode === 'edit' && onCancel && formData.status !== 'Cancelled' && (
            <button 
              onClick={() => onCancel(initialData!.bookingId)}
              className="px-5 py-2 mr-auto text-[13px] font-medium text-red-600 dark:text-[#ff4444] hover:bg-accent rounded-full transition-colors"
            >
              Cancel Booking
            </button>
          )}
          <button 
            onClick={onClose}
            className="px-5 py-2 text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={!formData.title || !formData.startTime || !formData.endTime}
            className="px-5 py-2 text-[13px] font-medium text-primary-foreground bg-primary hover:opacity-90 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit
          </button>
        </div>
      </motion.div>
    </div>
  );
};
