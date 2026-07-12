"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Plus, MapPin } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import { BookingModal, Booking } from '@/components/booking/BookingModal';
import { Timeline } from '@/components/booking/Timeline';

const resourceContext = {
  resourceId: "room_B2",
  resourceName: "Conference room B2",
  selectedDate: "2026-07-07",
  displayDate: "Tue, 7 Jul"
};

const initialSchedule: Booking[] = [
  {
    bookingId: "bk_891",
    title: "Morning Sync",
    startTime: "09:00",
    endTime: "09:30",
    status: "Completed",
    reminder: false
  },
  {
    bookingId: "bk_892",
    title: "Procurement Team",
    startTime: "10:00",
    endTime: "11:00",
    status: "Ongoing",
    reminder: false
  },
  {
    bookingId: "bk_893",
    title: "Project Alpha Kickoff",
    startTime: "13:00",
    endTime: "14:30",
    status: "Upcoming",
    reminder: true
  },
  {
    bookingId: "bk_894",
    title: "Interview (John Doe)",
    startTime: "15:00",
    endTime: "16:00",
    status: "Cancelled",
    reminder: false
  }
];

export default function ResourceBookingPage() {
  const [schedule, setSchedule] = useState<Booking[]>(initialSchedule);
  const [conflict, setConflict] = useState<{ startTime: string; endTime: string; message: string } | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);

  const openAddModal = () => {
    setModalMode('add');
    setEditingBooking(null);
    setIsModalOpen(true);
    setConflict(null);
  };

  const openEditModal = (booking: Booking) => {
    setModalMode('edit');
    setEditingBooking(booking);
    setIsModalOpen(true);
    setConflict(null);
  };

  const toMinutes = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
  };

  const handleSaveBooking = (newBooking: Booking) => {
    const newStart = toMinutes(newBooking.startTime);
    const newEnd = toMinutes(newBooking.endTime);

    const hasCollision = schedule.some(existing => {
      if (modalMode === 'edit' && existing.bookingId === newBooking.bookingId) return false;
      if (existing.status === 'Cancelled') return false; // Ignore cancelled slots
      const existStart = toMinutes(existing.startTime);
      const existEnd = toMinutes(existing.endTime);
      return (newStart < existEnd && newEnd > existStart);
    });

    if (hasCollision) {
      setIsModalOpen(false);
      setConflict({
        startTime: newBooking.startTime,
        endTime: newBooking.endTime,
        message: `Requested ${newBooking.startTime} to ${newBooking.endTime} - conflict - slot is unavailable`
      });
      return;
    }

    if (modalMode === 'add') {
      setSchedule([...schedule, newBooking]);
    } else {
      setSchedule(schedule.map(b => b.bookingId === newBooking.bookingId ? newBooking : b));
    }
    
    setIsModalOpen(false);
    setConflict(null);
  };

  const handleCancelBooking = (bookingId: string) => {
    setSchedule(schedule.map(b => b.bookingId === bookingId ? { ...b, status: 'Cancelled' } : b));
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-full bg-bg-base text-text-primary p-10 font-sans transition-colors duration-300">
      <div className="max-w-[1000px] mx-auto">
        <PageHeader title="Resource Scheduling" subtitle="Manage bookings and resolve conflicts seamlessly." />

        <div className="bg-bg-surface border border-border-base rounded-3xl overflow-hidden mt-6 transition-colors duration-300">
          <div className="p-6 md:p-8 border-b border-border-base flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-bg-surface-alt transition-colors duration-300">
            
            <div className="flex items-center gap-4 px-5 py-3.5 bg-bg-base border border-border-strong rounded-2xl shadow-sm transition-colors duration-300">
              <div className="w-10 h-10 rounded-xl bg-bg-surface-alt border border-border-base flex items-center justify-center shrink-0">
                <MapPin className="h-5 w-5 text-text-secondary" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-text-primary">
                  {resourceContext.resourceName}
                </h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Calendar className="h-3 w-3 text-text-muted" />
                  <span className="text-[11px] font-mono font-medium text-text-secondary uppercase tracking-widest">
                    {resourceContext.displayDate}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={openAddModal}
              className="px-6 py-3 bg-bg-inverted hover:opacity-90 rounded-full text-[13px] font-medium text-text-inverted flex items-center gap-2 transition-colors w-full md:w-auto justify-center"
            >
              <Plus className="h-4 w-4" />
              Book a slot
            </button>
          </div>

          <div className="p-6 md:p-8">
            <Timeline 
              schedule={schedule} 
              conflict={conflict} 
              onEditBooking={openEditModal} 
              onClearConflict={() => setConflict(null)}
            />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <BookingModal 
            isOpen={isModalOpen}
            mode={modalMode}
            initialData={editingBooking}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveBooking}
            onCancel={handleCancelBooking}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
