import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    <div className="relative bg-bg-base border border-border-base rounded-2xl p-6 md:p-8 overflow-hidden">
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
            <div className="flex-1 border-b border-border-base"></div>
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
                  className="absolute w-full md:w-3/4 left-0 md:left-4 rounded-xl cursor-pointer overflow-hidden p-3 border group hover:border-border-strong transition-colors bg-bg-surface border-border-base"
                  style={{
                    top: `${top}px`,
                    height: `${height}px`,
                  }}
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-bg-inverted" />
                  <h4 className="font-semibold text-text-primary text-[13px]">
                    {booking.title}
                  </h4>
                  <p className="text-[11px] font-mono text-text-secondary mt-1 group-hover:text-text-secondary transition-colors">
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
                  className="absolute w-full md:w-3/4 left-0 md:left-12 rounded-xl overflow-hidden p-3 border border-dashed border-[#ff4444] bg-[#2a1215] z-10 flex flex-col justify-center items-center"
                  style={{
                    top: `${top}px`,
                    height: `${height}px`,
                  }}
                >
                  <button 
                    onClick={onClearConflict}
                    className="absolute top-2 right-2 p-1 text-[#ff4444] hover:text-[#ff8888] rounded-md transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                  <span className="font-bold text-[#ff4444] text-[13px]">Conflict Detected</span>
                  <span className="text-[11px] text-[#ff8888] mt-1 text-center font-medium max-w-[90%] break-words">
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
