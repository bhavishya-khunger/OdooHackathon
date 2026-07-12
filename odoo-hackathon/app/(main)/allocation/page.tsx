"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, History, ArrowRightLeft, CheckCircle2, Box } from 'lucide-react';
import { containerVariants, itemVariants, smoothTransition } from '@/components/ui/motionVariants';
import PageHeader from '@/components/ui/PageHeader';

// Hardcoded Datasets
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

  // Selected Asset State
  const [activeAssetId, setActiveAssetId] = useState(allocatedAssets[0].assetId);
  const activeAsset = allocatedAssets.find(a => a.assetId === activeAssetId) || allocatedAssets[0];

  // Form State
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Handle Asset Change
  const handleAssetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setActiveAssetId(e.target.value);
    // Reset form
    setSelectedEmployeeId('');
    setReason('');
    setSuccess(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployeeId || !reason) return;

    setIsSubmitting(true);

    // Construct Payload as requested
    const payload = {
      requestId: `req_${Date.now()}`,
      assetId: activeAsset.assetId,
      transferFromId: activeAsset.currentOwner.employeeId,
      transferToId: selectedEmployeeId,
      reason: reason,
      status: "Pending Approval"
    };

    console.log("Submitting Transfer Request:", payload);

    // Simulate API delay
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      
      // Redirect after showing success toast briefly
      setTimeout(() => {
        router.push('/assets');
      }, 1500);
    }, 800);
  };

  return (
    <div className="relative min-h-full">
      {/* Ambient background glows */}
      <div className="fixed top-0 right-[10%] w-[400px] h-[400px] bg-cyan-400/5 dark:bg-cyan-900/10 rounded-full blur-[120px] pointer-events-none -z-10 transition-colors duration-700" />
      <div className="fixed bottom-0 left-[20%] w-[500px] h-[500px] bg-indigo-400/5 dark:bg-emerald-900/10 rounded-full blur-[120px] pointer-events-none -z-10 transition-colors duration-700" />

      <motion.div
        className="max-w-[800px] mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <PageHeader title="Allocation & Transfer" subtitle="Manage asset assignment and transfer workflows." />

        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -20, height: 0 }}
              className="mb-6 overflow-hidden"
            >
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/30 flex items-center gap-3 text-emerald-700 dark:text-emerald-400 shadow-sm">
                <CheckCircle2 className="h-5 w-5 shrink-0" />
                <span className="font-medium text-sm">Transfer request submitted successfully. Redirecting...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          variants={itemVariants}
          className="bg-white/80 dark:bg-[#051324]/60 backdrop-blur-2xl border border-slate-200 dark:border-cyan-900/30 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.05)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden relative transition-colors duration-300"
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-200/80 dark:via-cyan-400/20 to-transparent pointer-events-none" />

          <div className="p-8 space-y-8">
            
            {/* 1. Asset Selection & Read-Only Display */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-cyan-100/80 mb-2">
                  Select Asset to Transfer
                </label>
                <div className="relative">
                  <select 
                    value={activeAssetId}
                    onChange={handleAssetChange}
                    className="w-full px-4 py-3 bg-white dark:bg-[#030b14] border border-slate-200 dark:border-cyan-900/40 rounded-xl text-slate-800 dark:text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 appearance-none shadow-sm cursor-pointer"
                  >
                    {allocatedAssets.map(asset => (
                      <option key={asset.assetId} value={asset.assetId}>
                        {asset.assetId} - {asset.name} (Current: {asset.currentOwner.name})
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-[#030b14]/50 border border-slate-200 dark:border-cyan-900/20 rounded-2xl">
                <div className="w-12 h-12 rounded-xl bg-white dark:bg-cyan-950/40 border border-slate-200 dark:border-cyan-900/40 flex items-center justify-center shrink-0 shadow-sm">
                  <Box className="h-6 w-6 text-slate-400 dark:text-cyan-400/60" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {activeAsset.assetId} - {activeAsset.name}
                  </h3>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 mt-1 rounded-full text-[10px] font-mono font-semibold border ${
                    activeAsset.status === 'Allocated'
                      ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/30'
                      : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30'
                  }`}>
                    {activeAsset.status}
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Contextual Warning Banner */}
            {activeAsset.status === 'Allocated' && (
              <motion.div 
                key={activeAsset.assetId}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-50 to-red-100/50 dark:from-red-950/40 dark:to-red-900/20 border border-red-200 dark:border-red-500/30 shadow-sm p-5 flex items-start gap-4"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 dark:bg-red-500/20 blur-[80px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2" />
                <div className="bg-red-100 dark:bg-red-500/20 p-2.5 rounded-xl border border-red-200 dark:border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.15)] flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <div className="relative z-10">
                  <h3 className="text-sm font-semibold text-red-900 dark:text-red-200">
                    Asset is Currently Allocated
                  </h3>
                  <p className="text-sm text-red-700/80 dark:text-red-300/80 mt-1 leading-relaxed">
                    Direct reassignment is locked. You must initiate a transfer request workflow to reassign this asset.
                  </p>
                </div>
              </motion.div>
            )}

            {/* 3. Transfer Request Form */}
            <form onSubmit={handleSubmit} className="space-y-6 bg-slate-50/50 dark:bg-[#030b14]/50 border border-slate-100 dark:border-cyan-900/20 p-6 rounded-3xl">
              <h3 className="text-sm font-mono font-bold text-slate-800 dark:text-cyan-500/80 uppercase tracking-widest flex items-center gap-2 mb-4">
                <ArrowRightLeft className="h-4 w-4 text-cyan-600 dark:text-cyan-400" /> Transfer Request
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-cyan-100/80 mb-2">From (Current Owner)</label>
                  <input 
                    type="text" 
                    value={`${activeAsset.currentOwner.name} - ${activeAsset.currentOwner.department}`}
                    disabled
                    className="w-full px-4 py-3 bg-slate-100 dark:bg-[#0A1E3F]/40 border border-slate-200 dark:border-cyan-900/30 rounded-xl text-slate-500 dark:text-cyan-100/40 cursor-not-allowed shadow-inner"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-cyan-100/80 mb-2">To (New Assignee) *</label>
                  <div className="relative">
                    <select 
                      value={selectedEmployeeId}
                      onChange={(e) => setSelectedEmployeeId(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-white dark:bg-[#030b14] border border-slate-200 dark:border-cyan-900/40 rounded-xl text-slate-800 dark:text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 appearance-none shadow-sm cursor-pointer"
                    >
                      <option value="" disabled>Select employee...</option>
                      {employeeDirectory.filter(emp => emp.id !== activeAsset.currentOwner.employeeId).map(emp => (
                        <option key={emp.id} value={emp.id}>{emp.name}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                      <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-cyan-100/80 mb-2">Reason for Transfer *</label>
                <textarea 
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                  placeholder={`e.g., ${activeAsset.currentOwner.name.split(' ')[0]} is getting an upgraded machine...`}
                  rows={3}
                  className="w-full px-4 py-3 bg-white dark:bg-[#030b14] border border-slate-200 dark:border-cyan-900/40 rounded-xl text-slate-800 dark:text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 resize-none shadow-sm"
                />
              </div>

              <div className="flex justify-end pt-2">
                <motion.button 
                  whileHover={{ scale: 1.02, transition: smoothTransition }}
                  whileTap={{ scale: 0.98 }}
                  disabled={!selectedEmployeeId || !reason || isSubmitting}
                  type="submit"
                  className="px-8 py-3.5 text-sm font-bold text-[#010810] bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[200px]"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-4 h-4 border-2 border-[#010810] border-t-transparent rounded-full" />
                      Processing...
                    </span>
                  ) : 'Submit Request'}
                </motion.button>
              </div>
            </form>

            {/* 4. History Feed */}
            <div className="border-t border-slate-200 dark:border-cyan-900/30 pt-8">
              <h3 className="text-sm font-mono font-bold text-slate-800 dark:text-cyan-500/80 uppercase tracking-widest flex items-center gap-2 mb-6">
                <History className="h-4 w-4 text-cyan-600 dark:text-cyan-400" /> Allocation History
              </h3>
              
              <div className="space-y-4">
                {activeAsset.history.map((log, index) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    key={log.id} 
                    className="flex gap-4 group"
                  >
                    <div className="flex flex-col items-center mt-1">
                      <div className="w-2.5 h-2.5 rounded-full bg-cyan-200 dark:bg-cyan-900 border-2 border-white dark:border-[#051324] ring-2 ring-cyan-100 dark:ring-cyan-900/40 group-hover:bg-cyan-500 dark:group-hover:bg-cyan-400 transition-colors" />
                      {index !== activeAsset.history.length - 1 && (
                        <div className="w-px h-full bg-slate-200 dark:bg-cyan-900/40 mt-1" />
                      )}
                    </div>
                    <div className="pb-4">
                      <span className="text-xs font-mono text-cyan-600 dark:text-cyan-400 font-semibold mb-1 block tracking-wider">
                        {log.date}
                      </span>
                      <p className="text-sm text-slate-600 dark:text-cyan-100/70">
                        {log.action}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
