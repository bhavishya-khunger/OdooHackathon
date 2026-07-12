'use client';

import React, { useState } from 'react';
import { 
  Plus, MoreVertical, Wrench, AlertCircle, 
  ArrowRight, UserPlus, CheckCircle2, Play, Settings, XCircle, FileText, ImagePlus
} from 'lucide-react';

type MaintenanceState = 'Pending' | 'Approved' | 'Technician Assigned' | 'In Progress' | 'Resolved' | 'Rejected';
type Priority = 'Low' | 'Medium' | 'High';

interface Ticket {
  id: string;
  assetId: string;
  assetName: string;
  issue: string;
  status: MaintenanceState;
  priority: Priority;
  technician?: string;
  date: string;
}

const initialTickets: Ticket[] = [
  {
    id: 'MNT-101',
    assetId: 'AF-0062',
    assetName: 'Projector',
    issue: 'Bulb not turning on',
    status: 'Pending',
    priority: 'Medium',
    date: '12 Jul 2026',
  },
  {
    id: 'MNT-102',
    assetId: 'AF-003',
    assetName: 'AC Unit',
    issue: 'Noisy compressor',
    status: 'Approved',
    priority: 'Low',
    date: '11 Jul 2026',
  },
  {
    id: 'MNT-103',
    assetId: 'AF-0078',
    assetName: 'Forklift',
    issue: 'Hydraulic leak',
    status: 'Technician Assigned',
    priority: 'High',
    technician: 'R. Varma',
    date: '10 Jul 2026',
  },
  {
    id: 'MNT-104',
    assetId: 'AF-897',
    assetName: 'Printer',
    issue: 'Paper jam, parts ordered',
    status: 'In Progress',
    priority: 'Medium',
    technician: 'S. Patel',
    date: '08 Jul 2026',
  },
  {
    id: 'MNT-105',
    assetId: 'AF-873',
    assetName: 'Ergo Chair',
    issue: 'Broken wheel',
    status: 'Resolved',
    priority: 'Low',
    technician: 'A. Kumar',
    date: '07 Jul 2026',
  },
  {
    id: 'MNT-098',
    assetId: 'AF-442',
    assetName: 'Standing Desk',
    issue: 'Motor burned out',
    status: 'Rejected',
    priority: 'Low',
    date: '01 Jul 2026',
  },
  {
    id: 'MNT-095',
    assetId: 'AF-111',
    assetName: 'Coffee Machine',
    issue: 'Not heating water',
    status: 'Resolved',
    priority: 'High',
    technician: 'J. Doe',
    date: '28 Jun 2026',
  }
];

const COLUMNS: MaintenanceState[] = [
  'Pending', 
  'Approved', 
  'Technician Assigned', 
  'In Progress', 
  'Resolved'
];

export default function MaintenancePage() {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [isCreating, setIsCreating] = useState(false);
  
  // New ticket state
  const [newAsset, setNewAsset] = useState('');
  const [newIssue, setNewIssue] = useState('');
  const [newPriority, setNewPriority] = useState<Priority>('Medium');

  // Assign Tech state
  const [assigningTicketId, setAssigningTicketId] = useState<string | null>(null);
  const [technicianName, setTechnicianName] = useState('');

  const handleCreate = () => {
    if (!newAsset || !newIssue) return;
    const newTicket: Ticket = {
      id: `MNT-${Math.floor(Math.random() * 900) + 100}`,
      assetId: `AF-${Math.floor(Math.random() * 9000) + 1000}`,
      assetName: newAsset,
      issue: newIssue,
      status: 'Pending',
      priority: newPriority,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    };
    setTickets([newTicket, ...tickets]);
    setIsCreating(false);
    setNewAsset('');
    setNewIssue('');
    setNewPriority('Medium');
  };

  const moveTicket = (id: string, newStatus: MaintenanceState, extraData?: any) => {
    setTickets(prev => prev.map(t => {
      if (t.id === id) {
        return { ...t, status: newStatus, ...extraData };
      }
      return t;
    }));
  };

  const renderCardActions = (ticket: Ticket) => {
    switch (ticket.status) {
      case 'Pending':
        return (
          <div className="flex gap-2 w-full mt-3">
            <button 
              onClick={() => moveTicket(ticket.id, 'Rejected')}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-400 rounded-lg text-xs font-semibold transition-colors border border-rose-500/20"
            >
              <XCircle className="h-3.5 w-3.5" /> Reject
            </button>
            <button 
              onClick={() => moveTicket(ticket.id, 'Approved')}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 rounded-lg text-xs font-semibold transition-colors border border-emerald-500/20"
            >
              <CheckCircle2 className="h-3.5 w-3.5" /> Approve
            </button>
          </div>
        );
      case 'Approved':
        return (
          <button 
            onClick={() => {
              setAssigningTicketId(ticket.id);
              setTechnicianName('');
            }}
            className="w-full mt-3 flex items-center justify-center gap-2 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-xs font-semibold transition-colors border border-primary/20"
          >
            <UserPlus className="h-3.5 w-3.5" /> Assign Tech
          </button>
        );
      case 'Technician Assigned':
        return (
          <button 
            onClick={() => moveTicket(ticket.id, 'In Progress')}
            className="w-full mt-3 flex items-center justify-center gap-2 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 rounded-lg text-xs font-semibold transition-colors border border-amber-500/20"
          >
            <Play className="h-3.5 w-3.5" /> Start Work
          </button>
        );
      case 'In Progress':
        return (
          <button 
            onClick={() => moveTicket(ticket.id, 'Resolved')}
            className="w-full mt-3 flex items-center justify-center gap-2 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 rounded-lg text-xs font-semibold transition-colors border border-emerald-500/20"
          >
            <CheckCircle2 className="h-3.5 w-3.5" /> Mark Resolved
          </button>
        );
      case 'Resolved':
        return (
          <div className="w-full mt-3 flex items-center justify-center gap-2 py-1.5 bg-surface-hover text-muted rounded-lg text-xs font-medium border border-border">
            Work Completed
          </div>
        );
      default:
        return null;
    }
  };

  const previousReports = tickets.filter(t => t.status === 'Resolved' || t.status === 'Rejected');

  return (
    <div className="max-w-7xl mx-auto h-full flex flex-col pt-2 pb-12 animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div>
          <h1 className="text-3xl font-medium text-foreground tracking-tight">Maintenance</h1>
          <p className="text-sm text-muted mt-1">Route and track asset repairs across the workflow.</p>
        </div>
        <button 
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-btn-bg hover:bg-btn-hover text-btn-text rounded-full text-sm font-medium transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Raise Request
        </button>
      </div>

      {/* Kanban Board */}
      <div className="overflow-x-auto pb-4 custom-scrollbar mb-8">
        <div className="flex gap-4 h-[500px] min-w-max">
          {COLUMNS.map(column => {
            let columnTickets = tickets.filter(t => t.status === column);
            
            // Limit Resolved items in the Kanban view to 3
            if (column === 'Resolved') {
              columnTickets = columnTickets.slice(0, 3);
            }
            
            return (
              <div key={column} className="w-80 flex flex-col h-full bg-surface-hover/30 rounded-2xl border border-border">
                {/* Column Header */}
                <div className="p-4 flex items-center justify-between border-b border-border bg-surface-hover/50 rounded-t-2xl shrink-0">
                  <h3 className="font-semibold text-foreground text-[15px]">{column}</h3>
                  <span className="bg-background text-muted text-xs font-semibold px-2 py-0.5 rounded-full border border-border shadow-sm">
                    {columnTickets.length}
                  </span>
                </div>
                
                {/* Column Cards Container */}
                <div className="p-3 flex-1 overflow-y-auto space-y-3">
                  {columnTickets.map(ticket => (
                    <div 
                      key={ticket.id} 
                      className={`bg-background border rounded-xl p-4 shadow-sm hover:shadow transition-shadow group
                        ${ticket.status === 'Resolved' ? 'border-emerald-500/30' : 'border-border'}`
                      }
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-mono text-muted bg-surface-hover px-1.5 py-0.5 rounded">{ticket.assetId}</span>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border
                          ${ticket.priority === 'High' ? 'bg-rose-500/10 text-rose-600 border-rose-500/20' : 
                            ticket.priority === 'Medium' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' : 
                            'bg-blue-500/10 text-blue-600 border-blue-500/20'}`}
                        >
                          {ticket.priority}
                        </span>
                      </div>
                      
                      <h4 className="font-medium text-foreground text-[15px] leading-tight mb-1">{ticket.assetName}</h4>
                      <p className="text-sm text-muted leading-snug mb-3 line-clamp-2">{ticket.issue}</p>
                      
                      {ticket.technician && (
                        <div className="flex items-center gap-1.5 text-xs text-muted mb-3 bg-surface-hover w-fit px-2 py-1 rounded-md">
                          <Wrench className="h-3 w-3" />
                          <span>{ticket.technician}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between text-xs text-muted border-t border-border pt-3 mt-1">
                        <span>{ticket.id}</span>
                        <span>{ticket.date}</span>
                      </div>

                      {/* Dynamic Action Button based on Status */}
                      {renderCardActions(ticket)}
                    </div>
                  ))}
                  
                  {columnTickets.length === 0 && (
                    <div className="h-24 border-2 border-dashed border-border rounded-xl flex items-center justify-center text-sm text-muted opacity-50">
                      Empty
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="w-full h-px bg-border my-6"></div>

      {/* Previous Task Reports */}
      <div className="mt-4 shrink-0">
        <h2 className="text-xl font-medium text-foreground mb-6 flex items-center gap-2">
          <FileText className="h-5 w-5 text-muted" />
          Previous Task Reports
        </h2>
        
        {previousReports.length > 0 ? (
          <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="grid grid-cols-12 gap-4 p-4 border-b border-border bg-surface-hover/50 text-xs font-semibold uppercase tracking-wider text-muted">
              <div className="col-span-2 pl-2">Ticket ID</div>
              <div className="col-span-3">Asset</div>
              <div className="col-span-3">Issue</div>
              <div className="col-span-2">Date</div>
              <div className="col-span-2 text-right pr-2">Outcome</div>
            </div>
            <div className="divide-y divide-border">
              {previousReports.map(ticket => (
                <div key={ticket.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-surface-hover/30 transition-colors">
                  <div className="col-span-2 pl-2">
                    <span className="text-sm font-mono text-muted">{ticket.id}</span>
                  </div>
                  <div className="col-span-3">
                    <div className="font-medium text-foreground text-[14.5px]">{ticket.assetName}</div>
                    <div className="text-xs text-muted mt-0.5">{ticket.assetId}</div>
                  </div>
                  <div className="col-span-3 text-[14px] text-muted truncate pr-4">
                    {ticket.issue}
                  </div>
                  <div className="col-span-2 text-[14px] text-muted">
                    {ticket.date}
                  </div>
                  <div className="col-span-2 flex justify-end pr-2">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                      ticket.status === 'Resolved' 
                        ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' 
                        : 'bg-rose-500/10 text-rose-600 border-rose-500/20'
                    }`}>
                      {ticket.status === 'Resolved' ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                      {ticket.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-surface border border-border border-dashed rounded-2xl p-8 text-center text-muted">
            No previous reports found.
          </div>
        )}
      </div>

      {/* Assign Technician Modal */}
      {assigningTicketId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface border border-border rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-6">Assign Technician</h2>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Technician Name</label>
                <select 
                  value={technicianName}
                  onChange={(e) => setTechnicianName(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary/50 transition-colors" 
                  autoFocus
                >
                  <option value="" disabled>Select a technician...</option>
                  <option value="R. Varma">R. Varma</option>
                  <option value="S. Patel">S. Patel</option>
                  <option value="A. Kumar">A. Kumar</option>
                  <option value="J. Doe">J. Doe</option>
                  <option value="Mike Ross">Mike Ross</option>
                </select>
              </div>
              
              <div className="flex gap-3 w-full mt-8">
                <button onClick={() => setAssigningTicketId(null)} className="flex-1 py-2.5 rounded-xl border border-border text-foreground hover:bg-surface-hover font-medium transition-colors">Cancel</button>
                <button 
                  onClick={() => {
                    if (technicianName.trim()) {
                      moveTicket(assigningTicketId, 'Technician Assigned', { technician: technicianName.trim() });
                      setAssigningTicketId(null);
                    }
                  }} 
                  className="flex-1 py-2.5 rounded-full bg-btn-bg hover:bg-btn-hover text-btn-text font-medium transition-colors"
                >
                  Assign
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface border border-border rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-6">Raise Maintenance Request</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Asset Name</label>
                  <input 
                    type="text" 
                    value={newAsset}
                    onChange={(e) => setNewAsset(e.target.value)}
                    placeholder="e.g. Conference Room Projector" 
                    className="w-full bg-background border border-border rounded-xl px-4 py-2 text-foreground focus:outline-none focus:border-primary/50 transition-colors" 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Issue Description</label>
                  <textarea 
                    value={newIssue}
                    onChange={(e) => setNewIssue(e.target.value)}
                    placeholder="Describe the problem..." 
                    rows={3}
                    className="w-full bg-background border border-border rounded-xl px-4 py-2 text-foreground focus:outline-none focus:border-primary/50 transition-colors resize-none" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Priority</label>
                  <select 
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as Priority)}
                    className="w-full bg-background border border-border rounded-xl px-4 py-2 text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Attach Photo (Optional)</label>
                  <label htmlFor="file-upload" className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-border border-dashed rounded-xl bg-background hover:bg-surface-hover/50 transition-colors cursor-pointer group">
                    <div className="space-y-1 text-center flex flex-col items-center">
                      <ImagePlus className="mx-auto h-7 w-7 text-muted group-hover:text-primary transition-colors" />
                      <div className="flex text-sm text-muted mt-2">
                        <span className="font-medium text-primary group-hover:text-primary-hover">
                          Upload a file
                        </span>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-muted/70 mt-1">PNG, JPG up to 5MB</p>
                    </div>
                  </label>
                  <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" />
                </div>
              </div>
              
              <div className="flex gap-3 w-full mt-8">
                <button onClick={() => setIsCreating(false)} className="flex-1 py-2.5 rounded-xl border border-border text-foreground hover:bg-surface-hover font-medium transition-colors">Cancel</button>
                <button onClick={handleCreate} className="flex-1 py-2.5 rounded-full bg-btn-bg hover:bg-btn-hover text-btn-text font-medium transition-colors">Submit Request</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}