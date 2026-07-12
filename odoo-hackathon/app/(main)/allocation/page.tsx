"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, History, ArrowRightLeft, CheckCircle2, Box, Users, CalendarClock, CornerDownLeft, Check, X } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import { ProcessReturnModal } from '@/components/allocation/ProcessReturnModal';
import { apiFetch } from '@/lib/api';
import { useEffect } from 'react';

export default function AllocationTransferPage() {
    const [activeTab, setActiveTab] = useState<'assign' | 'pending' | 'returns'>('assign');

  const [assets, setAssets] = useState<any[]>([]);
  const [transfers, setTransfers] = useState<any[]>([]);
  const [employeeDirectory, setEmployeeDirectory] = useState<any[]>([]);
  const [activeAllocations, setActiveAllocations] = useState<any[]>([]);
  const [activeAssetHistory, setActiveAssetHistory] = useState<any[]>([]);

  const [activeAssetId, setActiveAssetId] = useState<string>('');
  
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [expectedReturn, setExpectedReturn] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [assetToReturn, setAssetToReturn] = useState<any>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [assetsData, employeesData, allocData, transfersData]: any[] = await Promise.all([
        apiFetch('/assets'),
        apiFetch('/employees'),
        apiFetch('/allocations?status=active'),
        apiFetch('/transfers?status=pending')
      ]);
      setAssets(assetsData);
      setEmployeeDirectory(employeesData);
      setActiveAllocations(allocData.items || []);
      setTransfers(transfersData.items || []);
      
      if (assetsData.length > 0 && !activeAssetId) {
        setActiveAssetId(String(assetsData[0].id));
      }
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!activeAssetId) return;
    apiFetch(`/assets/${activeAssetId}/history`)
      .then((res: any) => {
         const combined = [...(res.allocations || []), ...(res.maintenance_requests || [])];
         combined.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
         setActiveAssetHistory(combined);
      })
      .catch(console.error);
  }, [activeAssetId]);

  const activeAsset = assets.find(a => String(a.id) === String(activeAssetId)) || assets[0];
  const currentAllocation = activeAsset ? activeAllocations.find(alloc => alloc.asset_id === activeAsset.id) : null;
  const currentOwner = currentAllocation ? {
      employeeId: currentAllocation.user_id,
      name: currentAllocation.user_name || 'Unknown',
      department: currentAllocation.department_name || ''
  } : null;

  const handleAssetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setActiveAssetId(e.target.value);
    setSelectedEmployeeId('');
    setExpectedReturn('');
    setReason('');
    setSuccessMsg('');
  };

  const handleSubmitAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployeeId || !activeAsset) return;

    setIsSubmitting(true);
    try {
      await apiFetch('/allocations', {
        method: 'POST',
        body: JSON.stringify({
          asset_id: activeAsset.id,
          user_id: Number(selectedEmployeeId),
          expected_return_date: expectedReturn || null
        })
      });
      setSuccessMsg(`Successfully allocated ${activeAsset.name}.`);
      setSelectedEmployeeId('');
      setExpectedReturn('');
      setTimeout(() => setSuccessMsg(''), 3000);
      fetchData();
      
      // Refresh history
      apiFetch(`/assets/${activeAsset.id}/history`)
        .then((res: any) => {
           const combined = [...(res.allocations || []), ...(res.maintenance_requests || [])];
           combined.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
           setActiveAssetHistory(combined);
        })
        .catch(console.error);
        
    } catch (error: any) {
      alert(`Failed to allocate asset: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployeeId || !reason || !currentAllocation) return;

    setIsSubmitting(true);
    try {
      await apiFetch('/transfers', {
        method: 'POST',
        body: JSON.stringify({
          allocation_id: currentAllocation.id,
          target_user_id: Number(selectedEmployeeId),
          reason
        })
      });
      setSuccessMsg(`Transfer request submitted for ${activeAsset.name}.`);
      setSelectedEmployeeId('');
      setReason('');
      setTimeout(() => setSuccessMsg(''), 3000);
      fetchData();
    } catch (error: any) {
      alert(`Failed to submit transfer request: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApproveTransfer = async (transferId: number) => {
    try {
      await apiFetch(`/transfers/${transferId}/approve`, { method: 'POST' });
      fetchData();
    } catch (error: any) {
      alert(`Failed to approve transfer: ${error.message}`);
    }
  };

  const handleRejectTransfer = async (transferId: number) => {
    try {
      await apiFetch(`/transfers/${transferId}/reject`, { method: 'POST' });
      fetchData();
    } catch (error: any) {
      alert(`Failed to reject transfer: ${error.message}`);
    }
  };

  const handleProcessReturn = async (assetId: string | number, notes: string, newStatus: string) => {
    const alloc = activeAllocations.find(a => String(a.asset_id) === String(assetId));
    if (!alloc) return;
    
    try {
      await apiFetch(`/allocations/${alloc.id}/return`, {
        method: 'POST',
        body: JSON.stringify({ condition_notes: notes })
      });
      
      // Also update asset status if newStatus is different from 'available'
      // Note: the return endpoint already sets it to available if it's not set.
      if (newStatus !== 'available') {
         await apiFetch(`/assets/${assetId}/status`, {
             method: 'PATCH',
             body: JSON.stringify({ status: newStatus })
         });
      }
      
      setIsReturnModalOpen(false);
      setAssetToReturn(null);
      fetchData();
    } catch (error: any) {
      alert(`Failed to process return: ${error.message}`);
    }
  };

  const isOverdue = (dateString: string | null) => {
    if (!dateString) return false;
    // Use actual current date for comparison instead of hardcoded
    return new Date(dateString) < new Date(); 
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 font-sans">
      <div>
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
        <div className="flex border-b border-border mb-8 overflow-x-auto hide-scrollbar">
          <button
            onClick={() => setActiveTab('assign')}
            className={`px-6 py-4 text-[13px] font-semibold whitespace-nowrap transition-colors relative ${activeTab === 'assign' ? 'text-foreground' : 'text-muted hover:text-muted-foreground'}`}
          >
            Assign / Transfer
            {activeTab === 'assign' && (
              <motion.div layoutId="alloc-tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-text-primary" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-6 py-4 text-[13px] font-semibold whitespace-nowrap transition-colors relative flex items-center gap-2 ${activeTab === 'pending' ? 'text-foreground' : 'text-muted hover:text-muted-foreground'}`}
          >
            Pending Transfers
            {transfers.length > 0 && (
              <span className="bg-primary text-primary-foreground text-[10px] px-2 py-0.5 rounded-full font-bold">{transfers.length}</span>
            )}
            {activeTab === 'pending' && (
              <motion.div layoutId="alloc-tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-text-primary" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('returns')}
            className={`px-6 py-4 text-[13px] font-semibold whitespace-nowrap transition-colors relative ${activeTab === 'returns' ? 'text-foreground' : 'text-muted hover:text-muted-foreground'}`}
          >
            Returns
            {activeTab === 'returns' && (
              <motion.div layoutId="alloc-tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-text-primary" />
            )}
          </button>
        </div>
          </div>


        <div className="bg-surface border border-border rounded-xl shadow-sm overflow-hidden relative transition-colors duration-300 p-6 sm:p-8 min-h-[400px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full py-20 text-muted">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
              <p>Loading allocation data...</p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* --- TAB 1: ASSIGN / TRANSFER --- */}
        {activeTab === 'assign' && (
          <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
            <div className="space-y-4">
              <div>
                <label className="block text-[13px] font-medium text-muted-foreground mb-2">Select Asset</label>
                <div className="relative">
                  <select 
                    value={activeAssetId}
                    onChange={handleAssetChange}
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none cursor-pointer transition-colors"
                  >
                    {assets.map(asset => (
                      <option key={asset.id} value={asset.id}>
                        {asset.id} - {asset.name} ({asset.status})
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-muted">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-muted border border-border rounded-2xl">
                <div className="w-12 h-12 rounded-xl bg-muted border border-border flex items-center justify-center shrink-0">
                  <Box className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-[15px] font-semibold text-foreground">{activeAsset?.tag || activeAsset?.id} - {activeAsset?.name}</h3>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 mt-1 rounded-full text-[10px] font-mono font-semibold border ${activeAsset?.status === 'available' ? 'bg-[#dcfce7] text-[#16a34a] border-[#bbf7d0] dark:bg-[#10301a] dark:text-[#4ade80] dark:border-[#1a4d29]' : 'bg-[#e0f2fe] text-[#0284c7] border-[#bae6fd] dark:bg-[#102a40] dark:text-[#4ea8ff] dark:border-[#1a4266]'}`}>
                    {activeAsset?.status}
                  </span>
                </div>
              </div>
            </div>

            {activeAsset?.status === 'available' ? (
              <form onSubmit={handleSubmitAssign} className="space-y-6 bg-background border border-border p-6 rounded-2xl shadow-sm">
                <h3 className="text-[11px] font-bold text-muted uppercase tracking-[0.15em] flex items-center gap-2 mb-4">
                  <Users className="h-[14px] w-[14px]" /> Allocate Asset
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[13px] font-medium text-muted-foreground mb-2">Assign To *</label>
                    <select 
                      value={selectedEmployeeId}
                      onChange={(e) => setSelectedEmployeeId(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none cursor-pointer"
                    >
                      <option value="" disabled>Select employee...</option>
                      {employeeDirectory.map(emp => (
                        <option key={emp.id} value={emp.id}>{emp.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-muted-foreground mb-2">Expected Return Date</label>
                    <input 
                      type="date" 
                      value={expectedReturn}
                      onChange={(e) => setExpectedReturn(e.target.value)}
                      className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <button type="submit" disabled={!selectedEmployeeId || isSubmitting} className="px-8 py-3 text-[13px] font-medium text-primary-foreground bg-primary hover:opacity-90 rounded-full disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
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
                    <h3 className="text-sm font-semibold text-[#ff8888]">Currently Allocated to {currentOwner?.name}</h3>
                    <p className="text-[13px] text-[#ffaaaa] mt-1">Direct reassignment is locked. You must initiate a transfer request workflow.</p>
                  </div>
                </div>
                <form onSubmit={handleSubmitTransfer} className="space-y-6 bg-background border border-border p-6 rounded-2xl shadow-sm">
                  <h3 className="text-[11px] font-bold text-muted uppercase tracking-[0.15em] flex items-center gap-2 mb-4">
                    <ArrowRightLeft className="h-[14px] w-[14px]" /> Transfer Request
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[13px] font-medium text-muted-foreground mb-2">From</label>
                      <input type="text" value={currentOwner?.name || ''} disabled className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-[13px] text-muted cursor-not-allowed" />
                    </div>
                    <div>
                      <label className="block text-[13px] font-medium text-muted-foreground mb-2">To (New Assignee) *</label>
                      <select 
                        value={selectedEmployeeId}
                        onChange={(e) => setSelectedEmployeeId(e.target.value)}
                        required
                        className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none cursor-pointer"
                      >
                        <option value="" disabled>Select employee...</option>
                        {employeeDirectory.filter(emp => emp.id !== currentOwner?.employeeId).map(emp => (
                          <option key={emp.id} value={emp.id}>{emp.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-muted-foreground mb-2">Reason for Transfer *</label>
                    <textarea 
                      value={reason} onChange={(e) => setReason(e.target.value)} required rows={3}
                      placeholder="Why is this asset being transferred?"
                      className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-[13px] text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    />
                  </div>
                  <div className="flex justify-end pt-2">
                    <button type="submit" disabled={!selectedEmployeeId || !reason || isSubmitting} className="px-8 py-3 text-[13px] font-medium text-primary-foreground bg-primary hover:opacity-90 rounded-full disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
                      {isSubmitting ? 'Processing...' : 'Submit Request'}
                    </button>
                  </div>
                </form>
              </>
            )}

            <div className="border-t border-border pt-8">
              <h3 className="text-[11px] font-bold text-muted uppercase tracking-[0.15em] flex items-center gap-2 mb-6">
                <History className="h-[14px] w-[14px]" /> Allocation History
              </h3>
              <div className="space-y-4">
                {activeAssetHistory.map((log: any, index: number) => (
                  <div key={log.id + (log.description ? 'm' : 'a')} className="flex gap-4 group">
                    <div className="flex flex-col items-center mt-1">
                      <div className="w-2 h-2 rounded-full bg-[#555] border-2 border-[#141414]" />
                      {index !== activeAssetHistory.length - 1 && <div className="w-px h-full hover:bg-accent mt-1" />}
                    </div>
                    <div className="pb-4">
                      <span className="text-[11px] font-mono text-muted-foreground font-semibold mb-1 block tracking-widest">{log.created_at.split('T')[0]}</span>
                      <p className="text-[13px] text-foreground">{log.description ? `Maintenance: ${log.description} (${log.status})` : `Allocation ${log.status} to ${log.user_name || 'Department'}`}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* --- TAB 2: PENDING TRANSFERS --- */}
        {activeTab === 'pending' && (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
            {transfers.length === 0 ? (
              <div className="bg-surface border border-border rounded-3xl p-12 text-center flex flex-col items-center">
                <CheckCircle2 className="h-10 w-10 text-[#16a34a] mb-4 opacity-50" />
                <h3 className="text-[15px] font-semibold text-foreground mb-1">All Caught Up!</h3>
                <p className="text-[13px] text-muted-foreground">There are no pending transfer requests at the moment.</p>
              </div>
            ) : (
              transfers.map(tr => (
                <div key={tr.id} className="bg-surface border border-border rounded-3xl p-6 flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold border bg-[#fef3c7] text-[#d97706] border-[#fde68a] dark:bg-[#3d250c] dark:text-[#fbbf24] dark:border-[#663d14]">Pending Approval</span>
                      <span className="text-[11px] font-medium text-muted">{tr.created_at.split('T')[0]}</span>
                    </div>
                    <div>
                      <h4 className="text-[15px] font-semibold text-foreground">{tr.assetId} - {tr.allocation.asset_name}</h4>
                      <div className="flex items-center gap-2 mt-2 text-[13px] text-muted-foreground">
                        <span className="font-medium">{tr.requested_by_name}</span>
                        <ArrowRightLeft className="h-3 w-3 text-muted" />
                        <span className="font-medium text-foreground">{tr.target_user_name || tr.target_department_name}</span>
                      </div>
                      <p className="text-[12px] text-muted mt-2 border-l-2 border-border pl-2 italic">"{tr.reason}"</p>
                    </div>
                  </div>
                  <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-auto shrink-0">
                    <button onClick={() => handleApproveTransfer(tr.id)} className="flex-1 px-4 py-2 bg-primary text-primary-foreground hover:opacity-90 rounded-xl text-[13px] font-medium flex items-center justify-center gap-2 transition-colors">
                      <Check className="h-4 w-4" /> Approve
                    </button>
                    <button onClick={() => handleRejectTransfer(tr.id)} className="flex-1 px-4 py-2 bg-transparent border border-border text-foreground hover:bg-accent rounded-xl text-[13px] font-medium flex items-center justify-center gap-2 transition-colors">
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
          <div className="overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <table className="w-full text-[13px] text-left">
              <thead className="text-[11px] text-muted uppercase tracking-wider bg-muted border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-semibold">Asset</th>
                  <th className="px-6 py-4 font-semibold">Current Owner</th>
                  <th className="px-6 py-4 font-semibold">Expected Return</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-base">
                {assets.filter(a => a.status === 'allocated').map(asset => {
                  const overdue = isOverdue(activeAllocations.find(a => a.asset_id === asset.id)?.expected_return_date);
                  return (
                    <tr key={asset.id} className="hover:bg-accent transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-mono text-foreground font-semibold">{asset.id}</span>
                        <span className="block text-[12px] text-muted-foreground mt-0.5">{asset.name}</span>
                      </td>
                      <td className="px-6 py-4 text-foreground">
                        {activeAllocations.find(a => a.asset_id === asset.id)?.user_name}
                        <span className="block text-[11px] text-muted mt-0.5">{activeAllocations.find(a => a.asset_id === asset.id)?.department_name}</span>
                      </td>
                      <td className="px-6 py-4">
                        {activeAllocations.find(a => a.asset_id === asset.id)?.expected_return_date ? (
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold border ${overdue ? 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/50' : 'bg-muted text-muted-foreground border-border'}`}>
                            <CalendarClock className="h-3 w-3" />
                            {activeAllocations.find(a => a.asset_id === asset.id)?.expected_return_date}
                            {overdue && " (Overdue)"}
                          </span>
                        ) : (
                          <span className="text-muted italic">Not set</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => { setAssetToReturn(asset); setIsReturnModalOpen(true); }}
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-background border border-border hover:bg-muted hover:border-primary rounded-lg text-[12px] font-medium text-foreground transition-colors"
                        >
                          <CornerDownLeft className="h-3.5 w-3.5 text-muted-foreground" /> Process Return
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {assets.filter(a => a.status === 'allocated').length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-16 text-center text-muted text-sm">
                      No assets are currently allocated.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
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
