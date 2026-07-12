"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Plus, MapPin } from 'lucide-react';
import { containerVariants, itemVariants, smoothTransition } from '@/components/ui/motionVariants';
import PageHeader from '@/components/ui/PageHeader';

import { BookingModal, Booking } from '@/components/booking/BookingModal';
import { Timeline } from '@/components/booking/Timeline';

// 1. Resource Context
const resourceContext = {
  resourceId: "room_B2",
  resourceName: "Conference room B2",
  selectedDate: "2026-07-07",
  displayDate: "Tue, 7 Jul"
};

// 2. Existing Schedule Data
const initialSchedule: Booking[] = [
  {
    bookingId: "bk_892",
    title: "Procurement Team",
    startTime: "09:00",
    endTime: "10:00",
    status: "Confirmed"
  }
];

export default function ResourceBookingPage() {
  const [schedule, setSchedule] = useState<Booking[]>(initialSchedule);
  
  // Conflict State
  const [conflict, setConflict] = useState<{ startTime: string; endTime: string; message: string } | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);

  const openAddModal = () => {
    setModalMode('add');
    setEditingBooking(null);
    setIsModalOpen(true);
    setConflict(null); // Clear any previous conflicts
  };

  const openEditModal = (booking: Booking) => {
    setModalMode('edit');
    setEditingBooking(booking);
    setIsModalOpen(true);
    setConflict(null);
  };

  // Helper to convert time to minutes for collision logic
  const toMinutes = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
  };

  const handleSaveBooking = (newBooking: Booking) => {
    const newStart = toMinutes(newBooking.startTime);
    const newEnd = toMinutes(newBooking.endTime);

    // Validation Check (Ignore collision with itself if editing)
    const hasCollision = schedule.some(existing => {
      if (modalMode === 'edit' && existing.bookingId === newBooking.bookingId) return false;
      const existStart = toMinutes(existing.startTime);
      const existEnd = toMinutes(existing.endTime);
      
      // Math: New Start Time < Existing End Time AND New End Time > Existing Start Time
      return (newStart < existEnd && newEnd > existStart);
    });

    if (hasCollision) {
      // Reject and show conflict
      setIsModalOpen(false);
      setConflict({
        startTime: newBooking.startTime,
        endTime: newBooking.endTime,
        message: `Requested ${newBooking.startTime} to ${newBooking.endTime} - conflict - slot is unavailable`
      });
      return;
    }

    // Success
    if (modalMode === 'add') {
      setSchedule([...schedule, newBooking]);
    } else {
      setSchedule(schedule.map(b => b.bookingId === newBooking.bookingId ? newBooking : b));
    }
    
    setIsModalOpen(false);
    setConflict(null);
  };

  const handleDeleteBooking = (bookingId: string) => {
    setSchedule(schedule.filter(b => b.bookingId !== bookingId));
    setIsModalOpen(false);
  };

  return (
    <div className="relative min-h-full">
      {/* Ambient background glows */}
      <div className="fixed top-0 right-[10%] w-[400px] h-[400px] bg-cyan-400/5 dark:bg-cyan-900/10 rounded-full blur-[120px] pointer-events-none -z-10 transition-colors duration-700" />
      <div className="fixed bottom-0 left-[20%] w-[500px] h-[500px] bg-indigo-400/5 dark:bg-emerald-900/10 rounded-full blur-[120px] pointer-events-none -z-10 transition-colors duration-700" />

      <motion.div
        className="max-w-[1000px] mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <PageHeader title="Resource Scheduling" subtitle="Manage bookings and resolve conflicts seamlessly." />

        <motion.div
          variants={itemVariants}
          className="bg-white/80 dark:bg-[#051324]/60 backdrop-blur-2xl border border-slate-200 dark:border-cyan-900/30 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.05)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden relative transition-colors duration-300"
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-200/80 dark:via-cyan-400/20 to-transparent pointer-events-none" />

          {/* Context Header and Action Bar */}
          <div className="p-6 md:p-8 border-b border-slate-200 dark:border-cyan-900/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-slate-50/50 dark:bg-[#051324]/50">
            
            {/* Resource Context */}
            <div className="flex items-center gap-4 px-5 py-3.5 bg-white dark:bg-[#030b14] border border-slate-200 dark:border-cyan-900/40 rounded-2xl shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-cyan-950/40 border border-slate-200 dark:border-cyan-900/40 flex items-center justify-center shrink-0">
                <MapPin className="h-5 w-5 text-cyan-600 dark:text-cyan-400/80" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  {resourceContext.resourceName}
                </h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Calendar className="h-3 w-3 text-slate-400 dark:text-cyan-100/40" />
                  <span className="text-xs font-mono font-medium text-slate-500 dark:text-cyan-100/60 uppercase tracking-widest">
                    {resourceContext.displayDate}
                  </span>
                </div>
              </div>
            </div>

            <motion.button
              onClick={openAddModal}
              whileHover={{ y: -2, transition: smoothTransition }}
              className="px-6 py-3.5 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-xl text-sm font-bold text-white dark:text-[#010810] shadow-[0_0_16px_rgba(6,182,212,0.3)] dark:shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center gap-2 hover:shadow-[0_0_24px_rgba(16,185,129,0.4)] transition-all duration-300 w-full md:w-auto justify-center"
            >
              <Plus className="h-4 w-4" />
              Book a slot
            </motion.button>
          </div>

          <div className="p-6 md:p-8">
            <Timeline 
              schedule={schedule} 
              conflict={conflict} 
              onEditBooking={openEditModal} 
              onClearConflict={() => setConflict(null)}
            />
          </div>

        </motion.div>
      </motion.div>

      <AnimatePresence>
        {isModalOpen && (
          <BookingModal 
            isOpen={isModalOpen}
            mode={modalMode}
            initialData={editingBooking}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveBooking}
            onDelete={handleDeleteBooking}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
