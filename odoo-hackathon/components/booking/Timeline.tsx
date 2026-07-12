import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Booking } from './BookingModal';

interface TimelineProps {
  schedule: Booking[];
  conflict: { startTime: string; endTime: string; message: string } | null;
  onEditBooking: (booking: Booking) => void;
  onClearConflict: () => void;
}

// Helper to convert "HH:mm" to minutes since 09:00
const timeToMinutes = (timeStr: string) => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return (hours - 9) * 60 + minutes;
};

// We will render timeline from 09:00 to 17:00 (8 hours total)
const TIMELINE_START_HOUR = 9;
const TIMELINE_END_HOUR = 17;
const TOTAL_HOURS = TIMELINE_END_HOUR - TIMELINE_START_HOUR;

export const Timeline: React.FC<TimelineProps> = ({ schedule, conflict, onEditBooking, onClearConflict }) => {
  
  // Height of one hour in pixels
  const HOUR_HEIGHT = 80;

  return (
    <div className="relative bg-white/50 dark:bg-[#030b14]/50 border border-slate-200 dark:border-cyan-900/30 rounded-3xl p-6 md:p-8 overflow-hidden shadow-inner">
      <div className="relative" style={{ height: `${TOTAL_HOURS * HOUR_HEIGHT}px` }}>
        
        {/* Background Grid Lines */}
        {Array.from({ length: TOTAL_HOURS + 1 }).map((_, i) => (
          <div 
            key={i} 
            className="absolute w-full flex items-center gap-4"
            style={{ top: `${i * HOUR_HEIGHT}px`, transform: 'translateY(-50%)' }}
          >
            <span className="text-xs font-mono font-medium text-slate-400 dark:text-cyan-100/30 w-12 text-right shrink-0">
              {String(TIMELINE_START_HOUR + i).padStart(2, '0')}:00
            </span>
            <div className="flex-1 border-b border-dashed border-slate-200 dark:border-cyan-900/20"></div>
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
                  className="absolute w-full md:w-3/4 left-0 md:left-4 rounded-xl cursor-pointer overflow-hidden p-3 shadow-sm border group hover:shadow-md transition-shadow"
                  style={{
                    top: `${top}px`,
                    height: `${height}px`,
                    backgroundColor: 'rgba(16, 185, 129, 0.1)', // emerald bg
                    borderColor: 'rgba(16, 185, 129, 0.3)'
                  }}
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500" />
                  <h4 className="font-semibold text-emerald-800 dark:text-emerald-300 text-sm">
                    {booking.title}
                  </h4>
                  <p className="text-xs font-mono text-emerald-600 dark:text-emerald-400/80 mt-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    {booking.startTime} - {booking.endTime}
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
                  className="absolute w-full md:w-3/4 left-0 md:left-12 rounded-xl overflow-hidden p-3 border-2 border-dashed border-red-400 dark:border-red-500/50 bg-red-50/50 dark:bg-red-950/30 backdrop-blur-sm z-10 flex flex-col justify-center items-center shadow-[0_0_20px_rgba(239,68,68,0.15)]"
                  style={{
                    top: `${top}px`,
                    height: `${height}px`,
                  }}
                >
                  <button 
                    onClick={onClearConflict}
                    className="absolute top-2 right-2 p-1 text-red-400 hover:text-red-600 bg-red-100/50 rounded-md transition-colors"
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                  <span className="font-bold text-red-700 dark:text-red-400 text-sm">Conflict Detected</span>
                  <span className="text-xs text-red-600 dark:text-red-300/80 mt-1 text-center font-medium max-w-[90%] break-words">
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
