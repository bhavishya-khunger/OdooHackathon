"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Plus, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import { BookingModal, Booking } from '@/components/booking/BookingModal';
import { Timeline } from '@/components/booking/Timeline';
import { apiFetch, ApiError } from '@/lib/api';

export default function ResourceBookingPage() {
  const [assets, setAssets] = useState<any[]>([]);
  const [activeAssetId, setActiveAssetId] = useState<string>('');
  
  const [schedule, setSchedule] = useState<Booking[]>([]);
  const [conflict, setConflict] = useState<{ startTime: string; endTime: string; message: string } | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Date selection (default today)
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Format date for display
  const displayDate = new Date(selectedDate).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });

  // Fetch all shared assets on mount
  useEffect(() => {
    const initFetch = async () => {
      try {
        const allAssets: any[] = await apiFetch('/assets');
        const sharedAssets = allAssets.filter(a => a.is_shared === true);
        setAssets(sharedAssets);
        if (sharedAssets.length > 0 && !activeAssetId) {
          setActiveAssetId(String(sharedAssets[0].id));
        }
      } catch (err) {
        console.error("Failed to load shared assets", err);
      }
    };
    initFetch();
  }, []);

  // Fetch bookings for the selected asset and date
  const fetchBookings = async () => {
    if (!activeAssetId) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const data: any = await apiFetch(`/bookings?asset_id=${activeAssetId}`);
      
      // Filter for selected date
      const targetDateStr = selectedDate;
      const daysBookings = data.items.filter((b: any) => b.start_time.startsWith(targetDateStr));
      
      // Map to UI format
      const mapped: Booking[] = daysBookings.map((b: any) => {
        const start = new Date(b.start_time);
        const end = new Date(b.end_time);
        
        // Capitalize status for UI (upcoming -> Upcoming)
        const uiStatus = b.status.charAt(0).toUpperCase() + b.status.slice(1);
        
        return {
          bookingId: String(b.id),
          title: `Booking by User ${b.user_id}`, // If user_name is returned, we can use it.
          startTime: start.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
          endTime: end.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
          status: uiStatus as any,
          reminder: false
        };
      });
      setSchedule(mapped);
    } catch (err) {
      console.error("Failed to fetch bookings", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [activeAssetId, selectedDate]);

  const openAddModal = () => {
    setModalMode('add');
    setEditingBooking(null);
    setModalError(null);
    setIsModalOpen(true);
    setConflict(null);
  };

  const openEditModal = (booking: Booking) => {
    setModalMode('edit');
    setEditingBooking(booking);
    setModalError(null);
    setIsModalOpen(true);
    setConflict(null);
  };

  const handleSaveBooking = async (newBooking: Booking) => {
    setConflict(null);
    setModalError(null);
    
    // Construct ISO datetime strings without Z to keep them as naive local times
    const startDateTime = `${selectedDate}T${newBooking.startTime}:00`;
    const endDateTime = `${selectedDate}T${newBooking.endTime}:00`;

    try {
      if (modalMode === 'add') {
        await apiFetch('/bookings', {
          method: 'POST',
          body: JSON.stringify({
            asset_id: Number(activeAssetId),
            start_time: startDateTime,
            end_time: endDateTime
          })
        });
      } else {
        await apiFetch(`/bookings/${newBooking.bookingId}`, {
          method: 'PATCH',
          body: JSON.stringify({
            start_time: startDateTime,
            end_time: endDateTime
          })
        });
      }
      setIsModalOpen(false);
      fetchBookings();
    } catch (err: any) {
      if (err instanceof ApiError && err.status === 409) {
        setIsModalOpen(false);
        setConflict({
          startTime: newBooking.startTime,
          endTime: newBooking.endTime,
          message: err.message || "Slot is unavailable due to an existing booking."
        });
      } else {
        setModalError(err.message || "Failed to save booking");
      }
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      await apiFetch(`/bookings/${bookingId}/cancel`, {
        method: 'POST'
      });
      setIsModalOpen(false);
      fetchBookings();
    } catch (err: any) {
      alert(`Failed to cancel booking: ${err.message}`);
    }
  };
  
  const handleDateChange = (days: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + days);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const activeAsset = assets.find(a => String(a.id) === activeAssetId);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 font-sans">
      <div>
        <PageHeader title="Resource Scheduling" subtitle="Manage bookings and resolve conflicts seamlessly." />

        <div className="bg-surface border border-border rounded-xl shadow-sm overflow-hidden mt-6 transition-colors duration-300">
          <div className="p-6 md:p-8 border-b border-border flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-background/50 transition-colors duration-300">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 w-full md:w-auto">
              <div className="flex items-center gap-4 px-5 py-3.5 bg-background border border-border rounded-2xl shadow-sm transition-colors duration-300">
                <div className="w-10 h-10 rounded-xl bg-muted border border-border flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <select 
                    value={activeAssetId}
                    onChange={(e) => setActiveAssetId(e.target.value)}
                    className="text-sm font-semibold text-foreground bg-transparent focus:outline-none appearance-none pr-4 cursor-pointer"
                  >
                    {assets.length === 0 && <option value="">No shared resources</option>}
                    {assets.map(a => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[11px] font-mono font-medium text-muted-foreground uppercase tracking-widest">
                      {activeAsset?.location || 'Location Not Set'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button onClick={() => handleDateChange(-1)} className="p-2 border border-border rounded-xl hover:bg-muted text-muted-foreground transition-colors">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <div className="flex flex-col items-center min-w-[100px]">
                  <span className="text-sm font-semibold text-foreground">{displayDate}</span>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono">Date</span>
                </div>
                <button onClick={() => handleDateChange(1)} className="p-2 border border-border rounded-xl hover:bg-muted text-muted-foreground transition-colors">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <button
              onClick={openAddModal}
              disabled={!activeAssetId}
              className="px-6 py-3 bg-primary hover:opacity-90 rounded-full text-[13px] font-medium text-primary-foreground flex items-center gap-2 transition-colors w-full md:w-auto justify-center disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
              Book a slot
            </button>
          </div>

          <div className="p-6 md:p-8 min-h-[500px]">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-full py-20 text-muted">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                <p>Loading schedule...</p>
              </div>
            ) : (
              <Timeline 
                schedule={schedule} 
                conflict={conflict} 
                onEditBooking={openEditModal} 
                onClearConflict={() => setConflict(null)}
              />
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <BookingModal 
            isOpen={isModalOpen}
            mode={modalMode}
            initialData={editingBooking}
            error={modalError}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveBooking}
            onCancel={handleCancelBooking}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
