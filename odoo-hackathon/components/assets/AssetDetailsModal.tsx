import React, { useEffect, useState } from 'react';
import { X, Calendar, Wrench, Package, User } from 'lucide-react';
import { AssetResponse } from './AssetTable';
import { apiFetch } from '@/lib/api';

interface AllocationHistoryItem {
  id: number;
  user_name?: string;
  department_name?: string;
  allocated_by_name?: string;
  status: string;
  created_at: string;
}

interface MaintenanceHistoryItem {
  id: number;
  requested_by_name?: string;
  description: string;
  status: string;
  created_at: string;
}

interface AssetHistoryResponse {
  asset_id: number;
  asset_tag: string;
  allocations: AllocationHistoryItem[];
  maintenance_requests: MaintenanceHistoryItem[];
}

interface AssetDetailsModalProps {
  isOpen: boolean;
  asset: AssetResponse | null;
  onClose: () => void;
}

export const AssetDetailsModal: React.FC<AssetDetailsModalProps> = ({ isOpen, asset, onClose }) => {
  const [historyData, setHistoryData] = useState<AssetHistoryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && asset) {
      const fetchHistory = async () => {
        setIsLoading(true);
        try {
          const data = await apiFetch<AssetHistoryResponse>(`/assets/${asset.id}/history`);
          setHistoryData(data);
        } catch (error) {
          console.error("Failed to load history", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchHistory();
    }
  }, [isOpen, asset]);

  if (!isOpen || !asset) return null;

  // Combine and sort history
  const combinedHistory: any[] = [];
  if (historyData) {
    historyData.allocations.forEach(a => {
      combinedHistory.push({
        type: 'Allocation',
        date: new Date(a.created_at).toLocaleDateString(),
        timestamp: new Date(a.created_at).getTime(),
        description: `Status: ${a.status.toUpperCase()} (Assigned to ${a.user_name || a.department_name || 'System'})`,
        user: a.allocated_by_name || 'System'
      });
    });
    historyData.maintenance_requests.forEach(m => {
      combinedHistory.push({
        type: 'Maintenance',
        date: new Date(m.created_at).toLocaleDateString(),
        timestamp: new Date(m.created_at).getTime(),
        description: `${m.description} [${m.status.toUpperCase()}]`,
        user: m.requested_by_name || 'System'
      });
    });
  }
  combinedHistory.sort((a, b) => b.timestamp - a.timestamp); // newest first

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans">
      <div 
        className="absolute inset-0 bg-black/50 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />
      <div 
        className="relative w-full max-w-2xl bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden transition-colors duration-300 flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200"
      >
        <div className="flex items-center justify-between p-6 border-b border-border shrink-0">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground">{asset.name}</h2>
            <p className="text-sm text-muted mt-1 font-mono">{asset.tag}</p>
          </div>
          <button onClick={onClose} className="text-muted hover:text-foreground transition-colors p-2 rounded-xl hover:bg-surface-hover">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto space-y-8">
          
          {/* Details Grid */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <Package className="h-4 w-4 text-muted" /> Asset Details
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="bg-surface-alt p-3 rounded-xl border border-border">
                <p className="text-[11px] text-muted uppercase tracking-wider font-semibold mb-1">Category</p>
                <p className="text-[13px] text-foreground font-medium">{asset.category_name || 'N/A'}</p>
              </div>
              <div className="bg-surface-alt p-3 rounded-xl border border-border">
                <p className="text-[11px] text-muted uppercase tracking-wider font-semibold mb-1">Status</p>
                <p className="text-[13px] text-foreground font-medium capitalize">{asset.status.replace('_', ' ')}</p>
              </div>
              <div className="bg-surface-alt p-3 rounded-xl border border-border">
                <p className="text-[11px] text-muted uppercase tracking-wider font-semibold mb-1">Location</p>
                <p className="text-[13px] text-foreground font-medium">{asset.location}</p>
              </div>
              <div className="bg-surface-alt p-3 rounded-xl border border-border">
                <p className="text-[11px] text-muted uppercase tracking-wider font-semibold mb-1">Serial Number</p>
                <p className="text-[13px] text-foreground font-medium font-mono">{asset.serial_number || 'N/A'}</p>
              </div>
              <div className="bg-surface-alt p-3 rounded-xl border border-border">
                <p className="text-[11px] text-muted uppercase tracking-wider font-semibold mb-1">Condition</p>
                <p className="text-[13px] text-foreground font-medium capitalize">{asset.condition || 'N/A'}</p>
              </div>
              <div className="bg-surface-alt p-3 rounded-xl border border-border">
                <p className="text-[11px] text-muted uppercase tracking-wider font-semibold mb-1">Acquisition</p>
                <p className="text-[13px] text-foreground font-medium">{asset.acquisition_date || 'N/A'} {asset.acquisition_cost ? `($${asset.acquisition_cost})` : ''}</p>
              </div>
              <div className="bg-surface-alt p-3 rounded-xl border border-border">
                <p className="text-[11px] text-muted uppercase tracking-wider font-semibold mb-1">Department</p>
                <p className="text-[13px] text-foreground font-medium">{asset.department_name || 'N/A'}</p>
              </div>
              <div className="bg-surface-alt p-3 rounded-xl border border-border">
                <p className="text-[11px] text-muted uppercase tracking-wider font-semibold mb-1">Bookable</p>
                <p className="text-[13px] text-foreground font-medium">{asset.is_shared ? 'Yes' : 'No'}</p>
              </div>
            </div>
          </div>

          {/* History Timeline */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted" /> Asset History
            </h3>
            
            {isLoading ? (
              <p className="text-sm text-muted">Loading history...</p>
            ) : combinedHistory.length === 0 ? (
              <p className="text-sm text-muted italic">No history found for this asset.</p>
            ) : (
              <div className="space-y-4">
                {combinedHistory.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-surface-alt border border-border flex items-center justify-center shrink-0">
                        {item.type === 'Maintenance' ? (
                          <Wrench className="h-3.5 w-3.5 text-muted" />
                        ) : (
                          <User className="h-3.5 w-3.5 text-muted" />
                        )}
                      </div>
                      {index < combinedHistory.length - 1 && (
                        <div className="w-px h-full bg-border-strong mt-2"></div>
                      )}
                    </div>
                    <div className="pt-1.5 pb-4">
                      <div className="flex items-center gap-2">
                        <h4 className="text-[13px] font-semibold text-foreground">{item.type}</h4>
                        <span className="text-[11px] font-medium text-muted">{item.date}</span>
                      </div>
                      <p className="text-[13px] text-muted mt-1">{item.description}</p>
                      {item.user && (
                        <p className="text-[12px] text-muted mt-1">By: {item.user}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
};
