import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell } from 'lucide-react';
import { Booking } from './BookingModal';

interface TimelineProps {
  schedule: Booking[];
  conflict: { startTime: string; endTime: string; message: string } | null;
  onEditBooking: (booking: Booking) => void;
  onClearConflict: () => void;
}

const timeToMinutes = (timeStr: string) => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return (hours - 9) * 60 + minutes;
};

const TIMELINE_START_HOUR = 9;
const TIMELINE_END_HOUR = 17;
const TOTAL_HOURS = TIMELINE_END_HOUR - TIMELINE_START_HOUR;

export const Timeline: React.FC<TimelineProps> = ({ schedule, conflict, onEditBooking, onClearConflict }) => {
  const HOUR_HEIGHT = 80;

  return (
    <div className="relative bg-bg-base border border-border-base rounded-2xl p-6 md:p-8 overflow-hidden transition-colors duration-300">
      <div className="relative" style={{ height: `${TOTAL_HOURS * HOUR_HEIGHT}px` }}>
        
        {/* Background Grid Lines */}
        {Array.from({ length: TOTAL_HOURS + 1 }).map((_, i) => (
          <div 
            key={i} 
            className="absolute w-full flex items-center gap-4"
            style={{ top: `${i * HOUR_HEIGHT}px`, transform: 'translateY(-50%)' }}
          >
            <span className="text-[11px] font-mono font-medium text-text-muted w-12 text-right shrink-0">
              {String(TIMELINE_START_HOUR + i).padStart(2, '0')}:00
            </span>
            <div className="flex-1 border-b border-border-base transition-colors duration-300"></div>
          </div>
        ))}

        {/* Schedule Blocks Container */}
        <div className="absolute top-0 bottom-0 left-16 right-0">
          
          <AnimatePresence>
            {schedule.map(booking => {
              const startMins = timeToMinutes(booking.startTime);
              const endMins = timeToMinutes(booking.endTime);
              const top = (startMins / 60) * HOUR_HEIGHT;
              const height = ((endMins - startMins) / 60) * HOUR_HEIGHT;

              return (
                <motion.div
                  key={booking.bookingId}
                  initial={{ opacity: 0, scaleY: 0, originY: 0 }}
                  animate={{ opacity: 1, scaleY: 1 }}
                  exit={{ opacity: 0, scaleY: 0 }}
                  onClick={() => onEditBooking(booking)}
                  className={`absolute w-full md:w-3/4 left-0 md:left-4 rounded-xl cursor-pointer overflow-hidden p-3 border group hover:border-border-strong transition-colors duration-300 ${
                    booking.status === 'Ongoing' ? 'bg-[#f0fdf4] border-[#bbf7d0] dark:bg-[#10301a] dark:border-[#1a4d29]' :
                    booking.status === 'Completed' ? 'bg-[#f3f4f6] border-[#e5e7eb] dark:bg-[#1f2937] dark:border-[#374151] opacity-70' :
                    booking.status === 'Cancelled' ? 'bg-[#fef2f2] border-[#fecaca] dark:bg-[#2a1215] dark:border-[#4a1a1f] opacity-50' :
                    'bg-[#eff6ff] border-[#bfdbfe] dark:bg-[#102a40] dark:border-[#1a4266]'
                  }`}
                  style={{
                    top: `${top}px`,
                    height: `${height}px`,
                  }}
                >
                  <div className={`absolute left-0 top-0 bottom-0 w-1 transition-colors duration-300 ${
                    booking.status === 'Ongoing' ? 'bg-[#16a34a] dark:bg-[#4ade80]' :
                    booking.status === 'Completed' ? 'bg-[#6b7280] dark:bg-[#9ca3af]' :
                    booking.status === 'Cancelled' ? 'bg-[#ef4444] dark:bg-[#f87171]' :
                    'bg-[#2563eb] dark:bg-[#3b82f6]'
                  }`} />
                  <div className="flex items-start justify-between gap-2">
                    <h4 className={`font-semibold text-[13px] transition-colors duration-300 ${
                      booking.status === 'Cancelled' ? 'line-through text-text-muted' : 
                      booking.status === 'Ongoing' ? 'text-[#166534] dark:text-[#4ade80]' :
                      'text-text-primary'
                    }`}>
                      {booking.title}
                    </h4>
                    {booking.reminder && booking.status === 'Upcoming' && (
                      <Bell className="h-3.5 w-3.5 text-[#2563eb] dark:text-[#3b82f6] shrink-0" />
                    )}
                  </div>
                  <p className={`text-[11px] font-mono mt-1 transition-colors duration-300 ${
                    booking.status === 'Cancelled' ? 'text-text-muted' : 'text-text-secondary group-hover:text-text-primary'
                  }`}>
                    {booking.startTime} - {booking.endTime}
                    <span className="ml-2 px-1.5 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-[9px] uppercase tracking-wider">
                      {booking.status}
                    </span>
                  </p>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Conflict Block */}
          <AnimatePresence>
            {conflict && (() => {
              const startMins = timeToMinutes(conflict.startTime);
              const endMins = timeToMinutes(conflict.endTime);
              const top = (startMins / 60) * HOUR_HEIGHT;
              const height = ((endMins - startMins) / 60) * HOUR_HEIGHT;

              return (
                <motion.div
                  initial={{ opacity: 0, scaleY: 0, originY: 0 }}
                  animate={{ opacity: 1, scaleY: 1 }}
                  exit={{ opacity: 0, scaleY: 0 }}
                  className="absolute w-full md:w-3/4 left-0 md:left-12 rounded-xl overflow-hidden p-3 border border-dashed border-red-400 dark:border-[#ff4444] bg-red-50 dark:bg-[#2a1215] z-10 flex flex-col justify-center items-center transition-colors duration-300"
                  style={{
                    top: `${top}px`,
                    height: `${height}px`,
                  }}
                >
                  <button 
                    onClick={onClearConflict}
                    className="absolute top-2 right-2 p-1 text-red-600 dark:text-[#ff4444] hover:text-red-800 dark:hover:text-[#ff8888] rounded-md transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                  <span className="font-bold text-red-600 dark:text-[#ff4444] text-[13px] transition-colors duration-300">Conflict Detected</span>
                  <span className="text-[11px] text-red-500 dark:text-[#ff8888] mt-1 text-center font-medium max-w-[90%] break-words transition-colors duration-300">
                    {conflict.message}
                  </span>
                </motion.div>
              );
            })()}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
};
