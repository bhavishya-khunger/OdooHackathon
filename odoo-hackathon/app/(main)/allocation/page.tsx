"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, History, ArrowRightLeft, CheckCircle2, Box } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';

const allocatedAssets = [
  {
    assetId: "AF-0114",
    name: "Dell laptop",
    status: "Allocated",
    currentOwner: {
      employeeId: "emp_042",
      name: "Priya Shah",
      department: "Engineering"
    },
    history: [
      { id: "log_88", date: "Mar 12", action: "Allocated to Priya Shah - Engineering" },
      { id: "log_87", date: "Jan 04", action: "Returned by Arjun Nair - condition: good" }
    ]
  },
  {
    assetId: "AF-0062",
    name: "Sony 4K Projector",
    status: "Allocated",
    currentOwner: {
      employeeId: "emp_089",
      name: "Rahul Verma",
      department: "Marketing"
    },
    history: [
      { id: "log_92", date: "Apr 02", action: "Allocated to Rahul Verma - Marketing" },
      { id: "log_91", date: "Feb 15", action: "Maintenance resolved" }
    ]
  },
  {
    assetId: "AF-0201",
    name: "Ergonomic Office Chair",
    status: "Allocated",
    currentOwner: {
      employeeId: "emp_102",
      name: "Sarah Jones",
      department: "Design"
    },
    history: [
      { id: "log_105", date: "May 10", action: "Allocated to Sarah Jones - Design" }
    ]
  }
];

const employeeDirectory = [
  { id: "emp_042", name: "Priya Shah" },
  { id: "emp_089", name: "Rahul Verma" },
  { id: "emp_102", name: "Sarah Jones" },
  { id: "emp_115", name: "Amit Patel" }
];

export default function AllocationTransferPage() {
  const router = useRouter();

  const [activeAssetId, setActiveAssetId] = useState(allocatedAssets[0].assetId);
  const activeAsset = allocatedAssets.find(a => a.assetId === activeAssetId) || allocatedAssets[0];

  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleAssetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setActiveAssetId(e.target.value);
    setSelectedEmployeeId('');
    setReason('');
    setSuccess(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployeeId || !reason) return;

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      
      setTimeout(() => {
        router.push('/assets');
      }, 1500);
    }, 800);
  };

  return (
    <div className="min-h-full bg-bg-base text-text-primary p-10 font-sans">
      <div className="max-w-[800px] mx-auto">
        <PageHeader title="Allocation & Transfer" subtitle="Manage asset assignment and transfer workflows." />

        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -20, height: 0 }}
              className="mb-6 overflow-hidden"
            >
              <div className="p-4 rounded-xl bg-[#0a2015] border border-[#104020] flex items-center gap-3 text-[#00ff88]">
                <CheckCircle2 className="h-5 w-5 shrink-0" />
                <span className="font-medium text-[13px]">Transfer request submitted successfully. Redirecting...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="bg-bg-surface border border-border-base rounded-3xl overflow-hidden p-8 space-y-8">
            
          {/* 1. Asset Selection & Read-Only Display */}
          <div className="space-y-4">
            <div>
              <label className="block text-[13px] font-medium text-text-secondary mb-2">
                Select Asset to Transfer
              </label>
              <div className="relative">
                <select 
                  value={activeAssetId}
                  onChange={handleAssetChange}
                  className="w-full px-4 py-3 bg-bg-base border border-border-strong rounded-xl text-[13px] text-text-primary focus:outline-none focus:border-border-focus appearance-none cursor-pointer transition-colors"
                >
                  {allocatedAssets.map(asset => (
                    <option key={asset.assetId} value={asset.assetId}>
                      {asset.assetId} - {asset.name} (Current: {asset.currentOwner.name})
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
                <h3 className="text-[15px] font-semibold text-text-primary">
                  {activeAsset.assetId} - {activeAsset.name}
                </h3>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 mt-1 rounded-full text-[10px] font-mono font-semibold border bg-bg-surface-alt text-text-secondary border-border-strong">
                  {activeAsset.status}
                </span>
              </div>
            </div>
          </div>

          {/* 2. Contextual Warning Banner */}
          {activeAsset.status === 'Allocated' && (
            <div className="rounded-2xl bg-[#2a1215] border border-[#4a1a1f] p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#4a1a1f] flex items-center justify-center shrink-0">
                <AlertTriangle className="h-5 w-5 text-[#ff4444]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#ff8888]">
                  Asset is Currently Allocated
                </h3>
                <p className="text-[13px] text-[#ffaaaa] mt-1 leading-relaxed">
                  Direct reassignment is locked. You must initiate a transfer request workflow to reassign this asset.
                </p>
              </div>
            </div>
          )}

          {/* 3. Transfer Request Form */}
          <form onSubmit={handleSubmit} className="space-y-6 bg-bg-base border border-border-base p-6 rounded-3xl">
            <h3 className="text-[11px] font-bold text-text-muted uppercase tracking-[0.15em] flex items-center gap-2 mb-4">
              <ArrowRightLeft className="h-[14px] w-[14px]" /> Transfer Request
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[13px] font-medium text-text-secondary mb-2">From (Current Owner)</label>
                <input 
                  type="text" 
                  value={`${activeAsset.currentOwner.name} - ${activeAsset.currentOwner.department}`}
                  disabled
                  className="w-full px-4 py-3 bg-bg-surface-alt border border-border-base rounded-xl text-[13px] text-text-muted cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-text-secondary mb-2">To (New Assignee) *</label>
                <div className="relative">
                  <select 
                    value={selectedEmployeeId}
                    onChange={(e) => setSelectedEmployeeId(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-bg-surface border border-border-strong rounded-xl text-[13px] text-text-primary focus:outline-none focus:border-border-focus appearance-none cursor-pointer transition-colors"
                  >
                    <option value="" disabled>Select employee...</option>
                    {employeeDirectory.filter(emp => emp.id !== activeAsset.currentOwner.employeeId).map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.name}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-text-muted">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-[13px] font-medium text-text-secondary mb-2">Reason for Transfer *</label>
              <textarea 
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
                placeholder={`e.g., ${activeAsset.currentOwner.name.split(' ')[0]} is getting an upgraded machine...`}
                rows={3}
                className="w-full px-4 py-3 bg-bg-surface border border-border-strong rounded-xl text-[13px] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-border-focus resize-none transition-colors"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button 
                disabled={!selectedEmployeeId || !reason || isSubmitting}
                type="submit"
                className="px-8 py-3 text-[13px] font-medium text-text-inverted bg-bg-inverted hover:opacity-90 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-w-[160px] flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#0F0F0F] border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : 'Submit Request'}
              </button>
            </div>
          </form>

          {/* 4. History Feed */}
          <div className="border-t border-border-base pt-8">
            <h3 className="text-[11px] font-bold text-text-muted uppercase tracking-[0.15em] flex items-center gap-2 mb-6">
              <History className="h-[14px] w-[14px]" /> Allocation History
            </h3>
            
            <div className="space-y-4">
              {activeAsset.history.map((log, index) => (
                <div key={log.id} className="flex gap-4 group">
                  <div className="flex flex-col items-center mt-1">
                    <div className="w-2 h-2 rounded-full bg-[#555] border-2 border-[#141414] group-hover:bg-bg-inverted transition-colors" />
                    {index !== activeAsset.history.length - 1 && (
                      <div className="w-px h-full bg-bg-surface-hover mt-1" />
                    )}
                  </div>
                  <div className="pb-4">
                    <span className="text-[11px] font-mono text-text-secondary font-semibold mb-1 block tracking-widest">
                      {log.date}
                    </span>
                    <p className="text-[13px] text-text-primary">
                      {log.action}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
