'use client';

import React, { useState } from 'react';
import { 
  CheckCircle2, XCircle, AlertTriangle, FileText, 
  Lock, Plus, Search, Filter, ChevronRight, Check, X, ShieldAlert,
  ArrowLeft
} from 'lucide-react';

type VerificationStatus = 'Pending' | 'Verified' | 'Missing' | 'Damaged';

interface AuditAsset {
  id: string;
  name: string;
  location: string;
  status: VerificationStatus;
}

interface AuditCycle {
  id: string;
  title: string;
  dateRange: string;
  auditors: string[];
  status: 'In Progress' | 'Completed';
  assets: AuditAsset[];
}

const initialMockAudits: AuditCycle[] = [
  {
    id: 'AUD-Q3-ENG',
    title: 'Q3 Audit: Engineering Dept',
    dateRange: 'Jul 1 - Jul 15, 2026',
    auditors: ['A. Rao', 'S. Iqbal'],
    status: 'In Progress',
    assets: [
      { id: 'AF-003', name: 'Dell laptop XPS 15', location: 'Desk E12', status: 'Verified' },
      { id: 'AF-9921', name: 'Herman Miller Office chair', location: 'Desk E14', status: 'Missing' },
      { id: 'AF-9838', name: 'LG 27" 4K Monitor', location: 'Desk E15', status: 'Damaged' },
      { id: 'AF-9840', name: 'LG 27" 4K Monitor', location: 'Desk E16', status: 'Pending' },
      { id: 'AF-010', name: 'MacBook Pro 16"', location: 'Desk E18', status: 'Pending' },
    ]
  },
  {
    id: 'AUD-Q2-SALES',
    title: 'Q2 Audit: Sales Dept',
    dateRange: 'Apr 1 - Apr 10, 2026',
    auditors: ['M. Smith'],
    status: 'Completed',
    assets: [
      { id: 'AF-102', name: 'iPad Pro', location: 'Field', status: 'Verified' },
      { id: 'AF-105', name: 'Company iPhone', location: 'Field', status: 'Verified' },
      { id: 'AF-109', name: 'Demo Kit A', location: 'Storage 2', status: 'Missing' },
    ]
  }
];

export default function AuditPage() {
  const [audits, setAudits] = useState<AuditCycle[]>(initialMockAudits);
  const [selectedAuditId, setSelectedAuditId] = useState<string | null>(initialMockAudits[0].id);
  const [isCreating, setIsCreating] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);

  const selectedAudit = audits.find(a => a.id === selectedAuditId);

  const handleStatusChange = (assetId: string, newStatus: VerificationStatus) => {
    if (!selectedAudit || selectedAudit.status === 'Completed') return;

    setAudits(prev => prev.map(audit => {
      if (audit.id !== selectedAudit.id) return audit;
      return {
        ...audit,
        assets: audit.assets.map(asset => 
          asset.id === assetId ? { ...asset, status: newStatus } : asset
        )
      };
    }));
  };

  const closeAuditCycle = () => {
    if (!selectedAudit) return;
    setAudits(prev => prev.map(audit => 
      audit.id === selectedAudit.id ? { ...audit, status: 'Completed' } : audit
    ));
    setShowCloseModal(false);
  };

  // Views
  if (isCreating) {
    return (
      <div className="max-w-3xl mx-auto h-full flex flex-col pt-2 pb-12 animate-in fade-in duration-300">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => setIsCreating(false)} className="p-2 rounded-xl hover:bg-surface-hover text-muted hover:text-foreground transition-colors border border-transparent hover:border-border">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-3xl font-medium text-foreground tracking-tight">Create Audit Cycle</h1>
        </div>
        <div className="bg-surface border border-border rounded-2xl p-8 shadow-sm">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Audit Title</label>
              <input type="text" placeholder="e.g. Q4 Audit: Marketing" className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary/50 transition-colors" />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Department / Scope</label>
                <select className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary/50 transition-colors">
                  <option>All Departments</option>
                  <option>Engineering</option>
                  <option>Marketing</option>
                  <option>Sales</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Assigned Auditors</label>
                <input type="text" placeholder="Search employees..." className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary/50 transition-colors" />
              </div>
            </div>
            <div className="pt-4 flex justify-end gap-3 border-t border-border mt-4">
              <button onClick={() => setIsCreating(false)} className="px-5 py-2.5 rounded-xl border border-border text-foreground hover:bg-surface-hover font-medium transition-colors">Cancel</button>
              <button onClick={() => setIsCreating(false)} className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground font-medium transition-colors">Start Audit</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (selectedAudit) {
    const discrepancies = selectedAudit.assets.filter(a => a.status === 'Missing' || a.status === 'Damaged');
    const isCompleted = selectedAudit.status === 'Completed';

    return (
      <div className="max-w-5xl mx-auto h-full flex flex-col pt-2 pb-12 animate-in fade-in duration-300">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button onClick={() => setSelectedAuditId(null)} className="p-2 rounded-xl hover:bg-surface-hover text-muted hover:text-foreground transition-colors border border-transparent hover:border-border">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-medium text-foreground tracking-tight flex items-center gap-3">
                {selectedAudit.title}
                {isCompleted ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border border-emerald-500/20">Closed</span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20">In Progress</span>
                )}
              </h1>
              <p className="text-sm text-muted mt-1">{selectedAudit.dateRange} • Auditors: {selectedAudit.auditors.join(', ')}</p>
            </div>
          </div>
          {!isCompleted && (
            <button onClick={() => setShowCloseModal(true)} className="flex items-center gap-2 px-5 py-2.5 bg-surface hover:bg-surface-hover border border-border rounded-xl text-sm font-medium transition-colors text-foreground shadow-sm">
              <Lock className="h-4 w-4" />
              Close audit cycle
            </button>
          )}
        </div>

        {/* Discrepancy Banner */}
        {discrepancies.length > 0 && (
          <div className={`mb-6 p-4 rounded-2xl border flex items-start gap-4 animate-in fade-in slide-in-from-top-2 ${isCompleted ? 'bg-surface border-border' : 'bg-amber-500/10 border-amber-500/20 text-amber-900 dark:text-amber-200'}`}>
            <ShieldAlert className={`h-5 w-5 shrink-0 mt-0.5 ${isCompleted ? 'text-muted' : 'text-amber-600 dark:text-amber-400'}`} />
            <div>
              <h3 className="font-semibold text-[15px]">{discrepancies.length} assets flagged — discrepancy report {isCompleted ? 'archived' : 'generated automatically'}</h3>
              <p className="text-sm opacity-80 mt-1">
                {isCompleted 
                  ? 'Statuses were automatically updated in the main asset registry when this cycle was closed.'
                  : 'Items marked as Missing or Damaged will trigger status updates in the main registry upon closing this cycle.'}
              </p>
            </div>
            {!isCompleted && (
              <button className="ml-auto px-4 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-700 dark:text-amber-300 rounded-lg text-xs font-semibold transition-colors">
                View Report
              </button>
            )}
          </div>
        )}

        {/* Audit Checklist */}
        <div className="bg-surface border border-border rounded-2xl shadow-sm overflow-hidden flex-1">
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-border bg-surface-hover/50 text-xs font-semibold uppercase tracking-wider text-muted">
            <div className="col-span-4 pl-2">Asset</div>
            <div className="col-span-3">Expected Location</div>
            <div className="col-span-5 text-right pr-2">Verification</div>
          </div>
          <div className="divide-y divide-border">
            {selectedAudit.assets.map(asset => (
              <div key={asset.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-surface-hover/30 transition-colors">
                <div className="col-span-4 pl-2">
                  <div className="font-medium text-foreground text-[15px]">{asset.name}</div>
                  <div className="text-xs text-muted font-mono mt-0.5">{asset.id}</div>
                </div>
                <div className="col-span-3 text-[14.5px] text-muted">
                  {asset.location}
                </div>
                <div className="col-span-5 flex justify-end gap-2 pr-2">
                  {isCompleted ? (
                    <div className="flex items-center justify-end w-full">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border ${
                        asset.status === 'Verified' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                        asset.status === 'Missing' ? 'bg-rose-500/10 text-rose-600 border-rose-500/20' :
                        asset.status === 'Damaged' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' :
                        'bg-surface-hover text-muted border-border'
                      }`}>
                        {asset.status === 'Verified' && <CheckCircle2 className="h-4 w-4" />}
                        {asset.status === 'Missing' && <XCircle className="h-4 w-4" />}
                        {asset.status === 'Damaged' && <AlertTriangle className="h-4 w-4" />}
                        {asset.status}
                      </span>
                    </div>
                  ) : (
                    <div className="flex bg-background border border-border rounded-xl p-1 shadow-sm gap-1">
                      <button 
                        onClick={() => handleStatusChange(asset.id, 'Verified')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                          asset.status === 'Verified' ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 shadow-sm' : 'text-muted hover:bg-surface-hover'
                        }`}
                      >
                        <CheckCircle2 className={`h-4 w-4 ${asset.status === 'Verified' ? 'text-emerald-600 dark:text-emerald-400' : ''}`} />
                        Verified
                      </button>
                      <button 
                        onClick={() => handleStatusChange(asset.id, 'Missing')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                          asset.status === 'Missing' ? 'bg-rose-500/15 text-rose-700 dark:text-rose-400 shadow-sm' : 'text-muted hover:bg-surface-hover'
                        }`}
                      >
                        <XCircle className={`h-4 w-4 ${asset.status === 'Missing' ? 'text-rose-600 dark:text-rose-400' : ''}`} />
                        Missing
                      </button>
                      <button 
                        onClick={() => handleStatusChange(asset.id, 'Damaged')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                          asset.status === 'Damaged' ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400 shadow-sm' : 'text-muted hover:bg-surface-hover'
                        }`}
                      >
                        <AlertTriangle className={`h-4 w-4 ${asset.status === 'Damaged' ? 'text-amber-600 dark:text-amber-400' : ''}`} />
                        Damaged
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Close Confirmation Modal */}
        {showCloseModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-surface border border-border rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-6">
                <div className="w-12 h-12 bg-amber-500/10 text-amber-600 rounded-full flex items-center justify-center mb-4">
                  <Lock className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-semibold text-foreground mb-2">Close Audit Cycle?</h2>
                <p className="text-muted text-[15px] leading-relaxed mb-6">
                  This action will permanently lock this audit cycle. Any assets flagged as <strong>Missing</strong> or <strong>Damaged</strong> will have their global statuses automatically updated in the registry. This cannot be undone.
                </p>
                
                {discrepancies.length > 0 && (
                  <div className="bg-background border border-border rounded-xl p-4 mb-6">
                    <h4 className="text-sm font-semibold text-foreground mb-2">Registry Updates:</h4>
                    <ul className="space-y-1.5">
                      {discrepancies.map(d => (
                        <li key={d.id} className="text-sm text-muted flex justify-between">
                          <span>{d.id}</span>
                          <span className={d.status === 'Missing' ? 'text-rose-500' : 'text-amber-500 font-medium'}>→ Mark as {d.status}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="flex gap-3 w-full">
                  <button onClick={() => setShowCloseModal(false)} className="flex-1 py-2.5 rounded-xl border border-border text-foreground hover:bg-surface-hover font-medium transition-colors">Cancel</button>
                  <button onClick={closeAuditCycle} className="flex-1 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground font-medium transition-colors">Confirm & Lock</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Dashboard View
  const activeAudits = audits.filter(a => a.status === 'In Progress');
  const pastAudits = audits.filter(a => a.status === 'Completed');

  return (
    <div className="max-w-5xl mx-auto h-full flex flex-col pt-2 pb-12 animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-medium text-foreground tracking-tight">Asset Audit</h1>
        <button onClick={() => setIsCreating(true)} className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-hover text-primary-foreground rounded-xl text-sm font-medium transition-colors shadow-sm">
          <Plus className="h-4 w-4" />
          New Audit Cycle
        </button>
      </div>

      <div className="grid grid-cols-1 gap-10">
        {/* Active Audits */}
        <div>
          <h2 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(11,87,208,0.6)]"></span>
            Active Audit Cycles
          </h2>
          {activeAudits.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeAudits.map(audit => {
                const pendingCount = audit.assets.filter(a => a.status === 'Pending').length;
                const totalCount = audit.assets.length;
                const progress = Math.round(((totalCount - pendingCount) / totalCount) * 100);

                return (
                  <div key={audit.id} onClick={() => setSelectedAuditId(audit.id)} className="bg-surface border border-border rounded-2xl p-5 hover:border-primary/40 hover:shadow-md transition-all cursor-pointer group">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-foreground text-[16px] group-hover:text-primary transition-colors">{audit.title}</h3>
                        <p className="text-sm text-muted mt-1">{audit.id}</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-md bg-primary/10 text-primary text-xs font-semibold">{progress}% Done</span>
                    </div>
                    <div className="w-full h-1.5 bg-background rounded-full mb-4 overflow-hidden border border-border/50">
                      <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted">
                      <span className="flex items-center gap-1.5"><FileText className="h-4 w-4" /> {totalCount} Assets</span>
                      <span>Due: {audit.dateRange.split(' - ')[1]}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-surface border border-border border-dashed rounded-2xl p-8 text-center">
              <p className="text-muted">No active audit cycles. Start one to begin verifying your assets.</p>
            </div>
          )}
        </div>

        {/* Past Audits */}
        <div>
          <h2 className="text-lg font-medium text-foreground mb-4">Audit History</h2>
          <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="divide-y divide-border">
              {pastAudits.map(audit => {
                const flaggedCount = audit.assets.filter(a => a.status === 'Missing' || a.status === 'Damaged').length;
                return (
                  <div key={audit.id} onClick={() => setSelectedAuditId(audit.id)} className="flex items-center justify-between p-5 hover:bg-surface-hover/50 cursor-pointer transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-emerald-600">
                        <Check className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground text-[15px]">{audit.title}</h3>
                        <div className="flex items-center gap-3 text-sm text-muted mt-0.5">
                          <span>{audit.dateRange}</span>
                          <span>•</span>
                          <span>{audit.assets.length} assets audited</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      {flaggedCount > 0 ? (
                        <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 text-sm font-medium bg-amber-500/10 px-3 py-1 rounded-full">
                          <AlertTriangle className="h-4 w-4" />
                          {flaggedCount} Discrepancies
                        </span>
                      ) : (
                        <span className="text-emerald-600 text-sm font-medium bg-emerald-500/10 px-3 py-1 rounded-full">All clear</span>
                      )}
                      <ChevronRight className="h-5 w-5 text-muted group-hover:text-foreground transition-colors" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
