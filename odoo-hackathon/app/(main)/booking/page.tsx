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
    bookingId: "bk_892",
    title: "Procurement Team",
    startTime: "09:00",
    endTime: "10:00",
    status: "Confirmed"
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

  const handleDeleteBooking = (bookingId: string) => {
    setSchedule(schedule.filter(b => b.bookingId !== bookingId));
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-full bg-[#0F0F0F] text-[#f5f5f5] p-10 font-sans">
      <div className="max-w-[1000px] mx-auto">
        <PageHeader title="Resource Scheduling" subtitle="Manage bookings and resolve conflicts seamlessly." />

        <div className="bg-[#141414] border border-[#222] rounded-3xl overflow-hidden mt-6">
          <div className="p-6 md:p-8 border-b border-[#222] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-[#111]">
            
            <div className="flex items-center gap-4 px-5 py-3.5 bg-[#0F0F0F] border border-[#333] rounded-2xl shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center shrink-0">
                <MapPin className="h-5 w-5 text-[#888]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#f5f5f5]">
                  {resourceContext.resourceName}
                </h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Calendar className="h-3 w-3 text-[#666]" />
                  <span className="text-[11px] font-mono font-medium text-[#888] uppercase tracking-widest">
                    {resourceContext.displayDate}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={openAddModal}
              className="px-6 py-3 bg-[#f5f5f5] hover:bg-[#e5e5e5] rounded-full text-[13px] font-medium text-[#0F0F0F] flex items-center gap-2 transition-colors w-full md:w-auto justify-center"
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
            onDelete={handleDeleteBooking}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
