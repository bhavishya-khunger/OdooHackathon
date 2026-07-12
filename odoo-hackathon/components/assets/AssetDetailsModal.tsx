import React from 'react';
import { motion } from 'framer-motion';
import { X, Calendar, Wrench, Package, User } from 'lucide-react';
import { Asset, AssetHistory } from './AssetTable';

interface AssetDetailsModalProps {
  isOpen: boolean;
  asset: Asset | null;
  onClose: () => void;
}

export const AssetDetailsModal: React.FC<AssetDetailsModalProps> = ({ isOpen, asset, onClose }) => {
  if (!isOpen || !asset) return null;

  const mockHistory: AssetHistory[] = asset.history || [
    { type: 'Allocation', date: '2026-06-15', description: 'Assigned to Engineering', user: 'Aditi Rao' },
    { type: 'Maintenance', date: '2026-05-10', description: 'Routine checkup and cleaning', user: 'Facilities Team' },
    { type: 'Allocation', date: '2026-01-20', description: 'Purchased and added to inventory', user: 'System' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        className="absolute inset-0 bg-black/50 dark:bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }} 
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl bg-bg-surface border border-border-base rounded-2xl shadow-2xl overflow-hidden transition-colors duration-300 flex flex-col max-h-[85vh]"
      >
        <div className="flex items-center justify-between p-6 border-b border-border-base shrink-0">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-text-primary">{asset.name}</h2>
            <p className="text-sm text-text-secondary mt-1 font-mono">{asset.tag}</p>
          </div>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary transition-colors p-2 rounded-xl hover:bg-bg-surface-hover">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto space-y-8">
          
          {/* Details Grid */}
          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
              <Package className="h-4 w-4 text-text-secondary" /> Asset Details
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="bg-bg-surface-alt p-3 rounded-xl border border-border-base">
                <p className="text-[11px] text-text-muted uppercase tracking-wider font-semibold mb-1">Category</p>
                <p className="text-[13px] text-text-primary font-medium">{asset.category}</p>
              </div>
              <div className="bg-bg-surface-alt p-3 rounded-xl border border-border-base">
                <p className="text-[11px] text-text-muted uppercase tracking-wider font-semibold mb-1">Status</p>
                <p className="text-[13px] text-text-primary font-medium">{asset.status}</p>
              </div>
              <div className="bg-bg-surface-alt p-3 rounded-xl border border-border-base">
                <p className="text-[11px] text-text-muted uppercase tracking-wider font-semibold mb-1">Location</p>
                <p className="text-[13px] text-text-primary font-medium">{asset.location}</p>
              </div>
              <div className="bg-bg-surface-alt p-3 rounded-xl border border-border-base">
                <p className="text-[11px] text-text-muted uppercase tracking-wider font-semibold mb-1">Serial Number</p>
                <p className="text-[13px] text-text-primary font-medium font-mono">{asset.serialNumber || 'N/A'}</p>
              </div>
              <div className="bg-bg-surface-alt p-3 rounded-xl border border-border-base">
                <p className="text-[11px] text-text-muted uppercase tracking-wider font-semibold mb-1">Condition</p>
                <p className="text-[13px] text-text-primary font-medium">{asset.condition || 'N/A'}</p>
              </div>
              <div className="bg-bg-surface-alt p-3 rounded-xl border border-border-base">
                <p className="text-[11px] text-text-muted uppercase tracking-wider font-semibold mb-1">Acquisition</p>
                <p className="text-[13px] text-text-primary font-medium">{asset.acquisitionDate || 'N/A'} {asset.acquisitionCost ? `(${asset.acquisitionCost})` : ''}</p>
              </div>
              <div className="bg-bg-surface-alt p-3 rounded-xl border border-border-base">
                <p className="text-[11px] text-text-muted uppercase tracking-wider font-semibold mb-1">Department</p>
                <p className="text-[13px] text-text-primary font-medium">{asset.department || 'N/A'}</p>
              </div>
              <div className="bg-bg-surface-alt p-3 rounded-xl border border-border-base">
                <p className="text-[11px] text-text-muted uppercase tracking-wider font-semibold mb-1">Bookable</p>
                <p className="text-[13px] text-text-primary font-medium">{asset.shared ? 'Yes' : 'No'}</p>
              </div>
            </div>
          </div>

          {/* History Timeline */}
          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-text-secondary" /> Asset History
            </h3>
            
            <div className="space-y-4">
              {mockHistory.map((item, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-bg-surface-alt border border-border-strong flex items-center justify-center shrink-0">
                      {item.type === 'Maintenance' ? (
                        <Wrench className="h-3.5 w-3.5 text-text-secondary" />
                      ) : (
                        <User className="h-3.5 w-3.5 text-text-secondary" />
                      )}
                    </div>
                    {index < mockHistory.length - 1 && (
                      <div className="w-px h-full bg-border-strong mt-2"></div>
                    )}
                  </div>
                  <div className="pt-1.5 pb-4">
                    <div className="flex items-center gap-2">
                      <h4 className="text-[13px] font-semibold text-text-primary">{item.type}</h4>
                      <span className="text-[11px] font-medium text-text-muted">{item.date}</span>
                    </div>
                    <p className="text-[13px] text-text-secondary mt-1">{item.description}</p>
                    {item.user && (
                      <p className="text-[12px] text-text-muted mt-1">By: {item.user}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </motion.div>
    </div>
  );
};
