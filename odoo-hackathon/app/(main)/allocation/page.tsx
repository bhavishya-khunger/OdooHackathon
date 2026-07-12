"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, History, ArrowRightLeft, CheckCircle2, Box, Users, CalendarClock, CornerDownLeft, Check, X } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import { ProcessReturnModal } from '@/components/allocation/ProcessReturnModal';

// --- MOCK DATA ---
const initialAssets = [
  {
    assetId: "AF-0114",
    name: "Dell laptop",
    status: "Allocated",
    currentOwner: { employeeId: "emp_042", name: "Priya Shah", department: "Engineering" },
    expectedReturnDate: "2026-12-31", // Future
    history: [
      { id: "log_88", date: "2026-03-12", action: "Allocated to Priya Shah - Engineering" }
    ]
  },
  {
    assetId: "AF-0062",
    name: "Sony 4K Projector",
    status: "Allocated",
    currentOwner: { employeeId: "emp_089", name: "Rahul Verma", department: "Marketing" },
    expectedReturnDate: "2026-07-01", // Overdue!
    history: [
      { id: "log_92", date: "2026-04-02", action: "Allocated to Rahul Verma - Marketing" }
    ]
  },
  {
    assetId: "AF-0201",
    name: "Ergonomic Office Chair",
    status: "Available",
    currentOwner: null,
    expectedReturnDate: null,
    history: [
      { id: "log_105", date: "2026-05-10", action: "Returned by Sarah Jones - Good condition" }
    ]
  }
];

const initialTransfers = [
  {
    id: "tr_001",
    assetId: "AF-0114",
    assetName: "Dell laptop",
    from: { name: "Priya Shah", department: "Engineering" },
    to: { employeeId: "emp_115", name: "Amit Patel", department: "Engineering" },
    reason: "Priya is getting a new Macbook, passing this to Amit.",
    dateRequested: "2026-07-10"
  }
];

const employeeDirectory = [
  { id: "emp_042", name: "Priya Shah", department: "Engineering" },
  { id: "emp_089", name: "Rahul Verma", department: "Marketing" },
  { id: "emp_102", name: "Sarah Jones", department: "Design" },
  { id: "emp_115", name: "Amit Patel", department: "Engineering" }
];

export default function AllocationTransferPage() {
  const [activeTab, setActiveTab] = useState<'assign' | 'pending' | 'returns'>('assign');

  const [assets, setAssets] = useState(initialAssets);
  const [transfers, setTransfers] = useState(initialTransfers);

  // -- Tab 1: Assign/Transfer State
  const [activeAssetId, setActiveAssetId] = useState(assets[0].assetId);
  const activeAsset = assets.find(a => a.assetId === activeAssetId) || assets[0];
  
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [expectedReturn, setExpectedReturn] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // -- Tab 3: Returns State
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [assetToReturn, setAssetToReturn] = useState<any>(null);

  // --- Handlers ---

  const handleAssetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setActiveAssetId(e.target.value);
    setSelectedEmployeeId('');
    setExpectedReturn('');
    setReason('');
    setSuccessMsg('');
  };

  const handleSubmitAssign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployeeId) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const emp = employeeDirectory.find(e => e.id === selectedEmployeeId);
      
      setAssets(prev => prev.map(a => {
        if (a.assetId === activeAsset.assetId) {
          return {
            ...a,
            status: "Allocated",
            currentOwner: emp ? { employeeId: emp.id, name: emp.name, department: emp.department } : null,
            expectedReturnDate: expectedReturn || null,
            history: [{ id: `log_${Date.now()}`, date: new Date().toISOString().split('T')[0], action: `Allocated to ${emp?.name} - ${emp?.department}` }, ...a.history]
          };
        }
        return a;
      }));

      setIsSubmitting(false);
      setSuccessMsg(`Successfully allocated ${activeAsset.name} to ${emp?.name}.`);
      setSelectedEmployeeId('');
      setExpectedReturn('');
      setTimeout(() => setSuccessMsg(''), 3000);
    }, 800);
  };

  const handleSubmitTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployeeId || !reason) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const emp = employeeDirectory.find(e => e.id === selectedEmployeeId);
      if (emp) {
        setTransfers(prev => [{
          id: `tr_${Date.now()}`,
          assetId: activeAsset.assetId,
          assetName: activeAsset.name,
          from: activeAsset.currentOwner!,
          to: { employeeId: emp.id, name: emp.name, department: emp.department },
          reason,
          dateRequested: new Date().toISOString().split('T')[0]
        }, ...prev]);
      }

      setIsSubmitting(false);
      setSuccessMsg(`Transfer request submitted for ${activeAsset.name}.`);
      setSelectedEmployeeId('');
      setReason('');
      setTimeout(() => setSuccessMsg(''), 3000);
    }, 800);
  };

  const handleApproveTransfer = (transferId: string) => {
    const transfer = transfers.find(t => t.id === transferId);
    if (!transfer) return;

    // Update asset
    setAssets(prev => prev.map(a => {
      if (a.assetId === transfer.assetId) {
        return {
          ...a,
          currentOwner: transfer.to,
          history: [{ id: `log_${Date.now()}`, date: new Date().toISOString().split('T')[0], action: `Transfer approved. Re-allocated to ${transfer.to.name}.` }, ...a.history]
        };
      }
      return a;
    }));

    // Remove transfer
    setTransfers(prev => prev.filter(t => t.id !== transferId));
  };

  const handleRejectTransfer = (transferId: string) => {
    setTransfers(prev => prev.filter(t => t.id !== transferId));
  };

  const handleProcessReturn = (assetId: string, notes: string, newStatus: string) => {
    setAssets(prev => prev.map(a => {
      if (a.assetId === assetId) {
        return {
          ...a,
          status: newStatus,
          currentOwner: null,
          expectedReturnDate: null,
          history: [{ id: `log_${Date.now()}`, date: new Date().toISOString().split('T')[0], action: `Returned. Notes: ${notes}. Status set to ${newStatus}.` }, ...a.history]
        };
      }
      return a;
    }));
    setIsReturnModalOpen(false);
    setAssetToReturn(null);
  };

  // Helper for overdue
  const isOverdue = (dateString: string | null) => {
    if (!dateString) return false;
    return new Date(dateString) < new Date('2026-07-12'); // Using static date for demo
  };

  return (
    <div className="min-h-full bg-bg-base text-text-primary p-10 font-sans">
      <div className="max-w-[900px] mx-auto">
        <PageHeader title="Allocation & Transfer" subtitle="Manage asset assignments, handle transfer requests, and process returns." />

        <AnimatePresence>
          {successMsg && (
            <motion.div
              initial={{ opacity: 0, y: -20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -20, height: 0 }}
              className="mb-6 overflow-hidden"
            >
              <div className="p-4 rounded-xl bg-[#0a2015] border border-[#104020] flex items-center gap-3 text-[#00ff88]">
                <CheckCircle2 className="h-5 w-5 shrink-0" />
                <span className="font-medium text-[13px]">{successMsg}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tabs */}
        <div className="flex border-b border-border-base mb-8 overflow-x-auto hide-scrollbar">
          <button
            onClick={() => setActiveTab('assign')}
            className={`px-6 py-4 text-[13px] font-semibold whitespace-nowrap transition-colors relative ${activeTab === 'assign' ? 'text-text-primary' : 'text-text-muted hover:text-text-secondary'}`}
          >
            Assign / Transfer
            {activeTab === 'assign' && (
              <motion.div layoutId="alloc-tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-text-primary" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-6 py-4 text-[13px] font-semibold whitespace-nowrap transition-colors relative flex items-center gap-2 ${activeTab === 'pending' ? 'text-text-primary' : 'text-text-muted hover:text-text-secondary'}`}
          >
            Pending Transfers
            {transfers.length > 0 && (
              <span className="bg-bg-inverted text-text-inverted text-[10px] px-2 py-0.5 rounded-full font-bold">{transfers.length}</span>
            )}
            {activeTab === 'pending' && (
              <motion.div layoutId="alloc-tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-text-primary" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('returns')}
            className={`px-6 py-4 text-[13px] font-semibold whitespace-nowrap transition-colors relative ${activeTab === 'returns' ? 'text-text-primary' : 'text-text-muted hover:text-text-secondary'}`}
          >
            Returns
            {activeTab === 'returns' && (
              <motion.div layoutId="alloc-tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-text-primary" />
            )}
          </button>
        </div>

        {/* --- TAB 1: ASSIGN / TRANSFER --- */}
        {activeTab === 'assign' && (
          <div className="bg-bg-surface border border-border-base rounded-3xl p-8 space-y-8">
            <div className="space-y-4">
              <div>
                <label className="block text-[13px] font-medium text-text-secondary mb-2">Select Asset</label>
                <div className="relative">
                  <select 
                    value={activeAssetId}
                    onChange={handleAssetChange}
                    className="w-full px-4 py-3 bg-bg-base border border-border-strong rounded-xl text-[13px] text-text-primary focus:outline-none focus:border-border-focus appearance-none cursor-pointer transition-colors"
                  >
                    {assets.map(asset => (
                      <option key={asset.assetId} value={asset.assetId}>
                        {asset.assetId} - {asset.name} ({asset.status})
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-text-muted">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-bg-surface-alt border border-border-base rounded-2xl">
                <div className="w-12 h-12 rounded-xl bg-bg-surface-alt border border-border-strong flex items-center justify-center shrink-0">
                  <Box className="h-6 w-6 text-text-secondary" />
                </div>
                <div>
                  <h3 className="text-[15px] font-semibold text-text-primary">{activeAsset.assetId} - {activeAsset.name}</h3>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 mt-1 rounded-full text-[10px] font-mono font-semibold border ${activeAsset.status === 'Available' ? 'bg-[#dcfce7] text-[#16a34a] border-[#bbf7d0] dark:bg-[#10301a] dark:text-[#4ade80] dark:border-[#1a4d29]' : 'bg-[#e0f2fe] text-[#0284c7] border-[#bae6fd] dark:bg-[#102a40] dark:text-[#4ea8ff] dark:border-[#1a4266]'}`}>
                    {activeAsset.status}
                  </span>
                </div>
              </div>
            </div>

            {activeAsset.status === 'Available' ? (
              <form onSubmit={handleSubmitAssign} className="space-y-6 bg-bg-base border border-border-base p-6 rounded-3xl">
                <h3 className="text-[11px] font-bold text-text-muted uppercase tracking-[0.15em] flex items-center gap-2 mb-4">
                  <Users className="h-[14px] w-[14px]" /> Allocate Asset
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[13px] font-medium text-text-secondary mb-2">Assign To *</label>
                    <select 
                      value={selectedEmployeeId}
                      onChange={(e) => setSelectedEmployeeId(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-bg-surface border border-border-strong rounded-xl text-[13px] text-text-primary focus:outline-none focus:border-border-focus appearance-none cursor-pointer"
                    >
                      <option value="" disabled>Select employee...</option>
                      {employeeDirectory.map(emp => (
                        <option key={emp.id} value={emp.id}>{emp.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-text-secondary mb-2">Expected Return Date</label>
                    <input 
                      type="date" 
                      value={expectedReturn}
                      onChange={(e) => setExpectedReturn(e.target.value)}
                      className="w-full px-4 py-3 bg-bg-surface border border-border-strong rounded-xl text-[13px] text-text-primary focus:outline-none focus:border-border-focus"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <button type="submit" disabled={!selectedEmployeeId || isSubmitting} className="px-8 py-3 text-[13px] font-medium text-text-inverted bg-bg-inverted hover:opacity-90 rounded-full disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
                    {isSubmitting ? 'Processing...' : 'Allocate'}
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="rounded-2xl bg-[#2a1215] border border-[#4a1a1f] p-5 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#4a1a1f] flex items-center justify-center shrink-0">
                    <AlertTriangle className="h-5 w-5 text-[#ff4444]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#ff8888]">Currently Allocated to {activeAsset.currentOwner?.name}</h3>
                    <p className="text-[13px] text-[#ffaaaa] mt-1">Direct reassignment is locked. You must initiate a transfer request workflow.</p>
                  </div>
                </div>
                <form onSubmit={handleSubmitTransfer} className="space-y-6 bg-bg-base border border-border-base p-6 rounded-3xl">
                  <h3 className="text-[11px] font-bold text-text-muted uppercase tracking-[0.15em] flex items-center gap-2 mb-4">
                    <ArrowRightLeft className="h-[14px] w-[14px]" /> Transfer Request
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[13px] font-medium text-text-secondary mb-2">From</label>
                      <input type="text" value={activeAsset.currentOwner?.name || ''} disabled className="w-full px-4 py-3 bg-bg-surface-alt border border-border-base rounded-xl text-[13px] text-text-muted cursor-not-allowed" />
                    </div>
                    <div>
                      <label className="block text-[13px] font-medium text-text-secondary mb-2">To (New Assignee) *</label>
                      <select 
                        value={selectedEmployeeId}
                        onChange={(e) => setSelectedEmployeeId(e.target.value)}
                        required
                        className="w-full px-4 py-3 bg-bg-surface border border-border-strong rounded-xl text-[13px] text-text-primary focus:outline-none focus:border-border-focus appearance-none cursor-pointer"
                      >
                        <option value="" disabled>Select employee...</option>
                        {employeeDirectory.filter(emp => emp.id !== activeAsset.currentOwner?.employeeId).map(emp => (
                          <option key={emp.id} value={emp.id}>{emp.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-text-secondary mb-2">Reason for Transfer *</label>
                    <textarea 
                      value={reason} onChange={(e) => setReason(e.target.value)} required rows={3}
                      placeholder="Why is this asset being transferred?"
                      className="w-full px-4 py-3 bg-bg-surface border border-border-strong rounded-xl text-[13px] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-border-focus resize-none"
                    />
                  </div>
                  <div className="flex justify-end pt-2">
                    <button type="submit" disabled={!selectedEmployeeId || !reason || isSubmitting} className="px-8 py-3 text-[13px] font-medium text-text-inverted bg-bg-inverted hover:opacity-90 rounded-full disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
                      {isSubmitting ? 'Processing...' : 'Submit Request'}
                    </button>
                  </div>
                </form>
              </>
            )}

            <div className="border-t border-border-base pt-8">
              <h3 className="text-[11px] font-bold text-text-muted uppercase tracking-[0.15em] flex items-center gap-2 mb-6">
                <History className="h-[14px] w-[14px]" /> Allocation History
              </h3>
              <div className="space-y-4">
                {activeAsset.history.map((log: any, index: number) => (
                  <div key={log.id} className="flex gap-4 group">
                    <div className="flex flex-col items-center mt-1">
                      <div className="w-2 h-2 rounded-full bg-[#555] border-2 border-[#141414]" />
                      {index !== activeAsset.history.length - 1 && <div className="w-px h-full bg-bg-surface-hover mt-1" />}
                    </div>
                    <div className="pb-4">
                      <span className="text-[11px] font-mono text-text-secondary font-semibold mb-1 block tracking-widest">{log.date}</span>
                      <p className="text-[13px] text-text-primary">{log.action}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* --- TAB 2: PENDING TRANSFERS --- */}
        {activeTab === 'pending' && (
          <div className="space-y-6">
            {transfers.length === 0 ? (
              <div className="bg-bg-surface border border-border-base rounded-3xl p-12 text-center flex flex-col items-center">
                <CheckCircle2 className="h-10 w-10 text-[#16a34a] mb-4 opacity-50" />
                <h3 className="text-[15px] font-semibold text-text-primary mb-1">All Caught Up!</h3>
                <p className="text-[13px] text-text-secondary">There are no pending transfer requests at the moment.</p>
              </div>
            ) : (
              transfers.map(tr => (
                <div key={tr.id} className="bg-bg-surface border border-border-base rounded-3xl p-6 flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold border bg-[#fef3c7] text-[#d97706] border-[#fde68a] dark:bg-[#3d250c] dark:text-[#fbbf24] dark:border-[#663d14]">Pending Approval</span>
                      <span className="text-[11px] font-medium text-text-muted">{tr.dateRequested}</span>
                    </div>
                    <div>
                      <h4 className="text-[15px] font-semibold text-text-primary">{tr.assetId} - {tr.assetName}</h4>
                      <div className="flex items-center gap-2 mt-2 text-[13px] text-text-secondary">
                        <span className="font-medium">{tr.from.name}</span>
                        <ArrowRightLeft className="h-3 w-3 text-text-muted" />
                        <span className="font-medium text-text-primary">{tr.to.name}</span>
                      </div>
                      <p className="text-[12px] text-text-muted mt-2 border-l-2 border-border-strong pl-2 italic">"{tr.reason}"</p>
                    </div>
                  </div>
                  <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-auto shrink-0">
                    <button onClick={() => handleApproveTransfer(tr.id)} className="flex-1 px-4 py-2 bg-bg-inverted text-text-inverted hover:opacity-90 rounded-xl text-[13px] font-medium flex items-center justify-center gap-2 transition-colors">
                      <Check className="h-4 w-4" /> Approve
                    </button>
                    <button onClick={() => handleRejectTransfer(tr.id)} className="flex-1 px-4 py-2 bg-transparent border border-border-strong text-text-primary hover:bg-bg-surface-hover rounded-xl text-[13px] font-medium flex items-center justify-center gap-2 transition-colors">
                      <X className="h-4 w-4" /> Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* --- TAB 3: RETURNS --- */}
        {activeTab === 'returns' && (
          <div className="bg-bg-surface border border-border-base rounded-3xl overflow-hidden">
            <table className="w-full text-[13px] text-left">
              <thead className="text-[11px] text-text-muted uppercase tracking-wider bg-bg-surface-alt border-b border-border-base">
                <tr>
                  <th className="px-6 py-4 font-semibold">Asset</th>
                  <th className="px-6 py-4 font-semibold">Current Owner</th>
                  <th className="px-6 py-4 font-semibold">Expected Return</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-base">
                {assets.filter(a => a.status === 'Allocated').map(asset => {
                  const overdue = isOverdue(asset.expectedReturnDate);
                  return (
                    <tr key={asset.assetId} className="hover:bg-bg-surface-hover transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-mono text-text-primary font-semibold">{asset.assetId}</span>
                        <span className="block text-[12px] text-text-secondary mt-0.5">{asset.name}</span>
                      </td>
                      <td className="px-6 py-4 text-text-primary">
                        {asset.currentOwner?.name}
                        <span className="block text-[11px] text-text-muted mt-0.5">{asset.currentOwner?.department}</span>
                      </td>
                      <td className="px-6 py-4">
                        {asset.expectedReturnDate ? (
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold border ${overdue ? 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/50' : 'bg-bg-surface-alt text-text-secondary border-border-strong'}`}>
                            <CalendarClock className="h-3 w-3" />
                            {asset.expectedReturnDate}
                            {overdue && " (Overdue)"}
                          </span>
                        ) : (
                          <span className="text-text-muted italic">Not set</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => { setAssetToReturn(asset); setIsReturnModalOpen(true); }}
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-bg-base border border-border-strong hover:bg-bg-surface-alt hover:border-border-focus rounded-lg text-[12px] font-medium text-text-primary transition-colors"
                        >
                          <CornerDownLeft className="h-3.5 w-3.5 text-text-secondary" /> Process Return
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {assets.filter(a => a.status === 'Allocated').length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-16 text-center text-text-muted text-sm">
                      No assets are currently allocated.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isReturnModalOpen && (
          <ProcessReturnModal
            isOpen={isReturnModalOpen}
            asset={assetToReturn}
            onClose={() => { setIsReturnModalOpen(false); setAssetToReturn(null); }}
            onConfirm={handleProcessReturn}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
