'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const categories = ['All', 'Alerts', 'Approvals', 'Bookings'];

const notificationsData = [
  {
    id: 1,
    title: 'Laptop AF-0014 assigned to Priya shah',
    time: '2m ago',
    type: 'Approvals',
    color: 'bg-blue-400 dark:bg-blue-500',
    dateGroup: 'Today',
    details: 'Asset transfer request #TR-992 was approved by IT admin. Device is now marked as Allocated.',
  },
  {
    id: 2,
    title: 'Maintenance request AF-0055 approved',
    time: '18m ago',
    type: 'Approvals',
    color: 'bg-emerald-400 dark:bg-emerald-500',
    dateGroup: 'Today',
    details: 'Projector AF-0055 will be serviced on 15-Jul-2026 by the hardware team. An external vendor has been notified.',
  },
  {
    id: 3,
    title: 'Booking confirmed : Room B2 : 2:00 to 3:00 PM',
    time: '1h ago',
    type: 'Bookings',
    color: 'bg-blue-400 dark:bg-blue-500',
    dateGroup: 'Today',
    details: 'Room B2 has been successfully booked for the weekly engineering sync. Attendees: 5.',
  },
  {
    id: 4,
    title: 'Transfer approved : AF-0033 to facilities dept',
    time: '3h ago',
    type: 'Approvals',
    color: 'bg-rose-400 dark:bg-rose-500',
    dateGroup: 'Today',
    details: 'Transfer of standing desk AF-0033 completed. The asset has been moved to the East Wing.',
  },
  {
    id: 5,
    title: 'Overdue return : AF-0021 was due 3 days ago',
    time: '1d ago',
    type: 'Alerts',
    color: 'bg-amber-500 dark:bg-amber-600',
    dateGroup: 'Yesterday',
    details: 'Monitor AF-0021 was due for return by Jane Doe on 09-Jul-2026. Please escalate to HR if not returned by tomorrow.',
  },
  {
    id: 6,
    title: 'audit discrepancy flagged : AF-0088 damaged',
    time: '2d ago',
    type: 'Alerts',
    color: 'bg-rose-500 dark:bg-rose-600',
    dateGroup: 'Older',
    details: 'During the Q3 audit, iPad AF-0088 was found to have a cracked screen. Status updated to Maintenance.',
  },
];

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState('All');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filteredData = notificationsData.filter(
    (n) => activeTab === 'All' || n.type === activeTab
  );

  const groupedData = filteredData.reduce((acc, notif) => {
    if (!acc[notif.dateGroup]) acc[notif.dateGroup] = [];
    acc[notif.dateGroup].push(notif);
    return acc;
  }, {} as Record<string, typeof notificationsData>);

  const groupOrder = ['Today', 'Yesterday', 'Older'];

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col pt-2 animate-in fade-in duration-300">
      <h1 className="text-3xl font-medium text-foreground tracking-tight mb-8">Notifications</h1>
      
      {/* Category Filters */}
      <div className="flex items-center gap-3 mb-6">
        {categories.map((cat) => {
          const isActive = activeTab === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-5 py-1.5 rounded-xl border text-sm font-medium transition-all ${
                isActive
                  ? cat === 'All' 
                    ? 'bg-emerald-900/10 border-emerald-700/50 text-emerald-600 dark:text-emerald-400 dark:bg-emerald-900/20' 
                    : 'bg-surface-hover border-border text-foreground shadow-sm'
                  : 'bg-transparent border-border text-muted hover:text-foreground hover:bg-surface-hover shadow-sm'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-6">
          {groupOrder.map((group) => {
            const groupItems = groupedData[group];
            if (!groupItems || groupItems.length === 0) return null;

            return (
              <div key={group} className="animate-in fade-in duration-300">
                <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 px-1">{group}</h3>
                <div className="border-t border-border">
                  {groupItems.map((notif) => {
                    const isExpanded = expandedId === notif.id;
                    return (
                      <div key={notif.id} className="border-b border-border transition-colors">
                        <div 
                          className="flex items-center justify-between p-4 cursor-pointer hover:bg-surface-hover/50 transition-colors group"
                          onClick={() => setExpandedId(isExpanded ? null : notif.id)}
                        >
                          <div className="flex items-center gap-4 flex-1">
                            <div className={`w-2.5 h-2.5 rounded-[3px] ${notif.color} opacity-90 shrink-0`} />
                            <span className="text-[15px] text-foreground font-medium">{notif.title}</span>
                          </div>
                          <div className="flex items-center gap-6 shrink-0">
                            <span className="text-[14px] text-muted">{notif.time}</span>
                            <button className="text-muted group-hover:text-foreground transition-colors">
                              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>
                        
                        {/* Expandable Details Area */}
                        {isExpanded && (
                          <div className="px-11 pb-5 pt-1 text-[14.5px] leading-relaxed text-muted animate-in fade-in slide-in-from-top-2 duration-200">
                            {notif.details}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {filteredData.length === 0 && (
            <div className="py-12 text-center text-muted border-t border-border">
              No notifications found for {activeTab}.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}