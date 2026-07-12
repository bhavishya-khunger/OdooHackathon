import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Asset } from './AssetTable';

interface AssetFormModalProps {
  isOpen: boolean;
  mode: 'add' | 'edit';
  initialData: Asset | null;
  onClose: () => void;
  onSave: (asset: Asset) => void;
}

export const AssetFormModal: React.FC<AssetFormModalProps> = ({ isOpen, mode, initialData, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<Asset>>({
    tag: '',
    name: '',
    category: 'Electronics',
    status: 'Available',
    location: '',
    serialNumber: '',
    acquisitionDate: '',
    acquisitionCost: '',
    condition: 'Good',
    department: '',
    shared: false
  });

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && initialData) {
        setFormData(initialData);
      } else {
        setFormData({ 
          tag: '', name: '', category: 'Electronics', status: 'Available', location: '',
          serialNumber: '', acquisitionDate: '', acquisitionCost: '', condition: 'Good',
          department: '', shared: false
        });
      }
    }
  }, [isOpen, mode, initialData]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!formData.name || !formData.category || !formData.status || !formData.location) return;
    
    const generatedTag = formData.tag || `AF-${Math.floor(1000 + Math.random() * 9000)}`;
    
    const assetToSave: Asset = {
      id: initialData?.id || `asset_${Date.now()}`,
      tag: generatedTag,
      name: formData.name,
      category: formData.category,
      status: formData.status,
      location: formData.location,
      serialNumber: formData.serialNumber,
      acquisitionDate: formData.acquisitionDate,
      acquisitionCost: formData.acquisitionCost,
      condition: formData.condition,
      department: formData.department,
      shared: formData.shared,
      history: initialData?.history || []
    };
    onSave(assetToSave);
  };

  const isFormValid = formData.name && formData.category && formData.status && formData.location;

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
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-lg bg-bg-surface border border-border-base rounded-2xl shadow-2xl overflow-hidden transition-colors duration-300 flex flex-col max-h-[90vh]"
      >
        <div className="flex items-center justify-between p-6 border-b border-border-base shrink-0">
          <h2 className="text-lg font-semibold tracking-tight text-text-primary">
            {mode === 'add' ? 'Register New Asset' : 'Edit Asset'}
          </h2>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-5 overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-[13px] font-medium text-text-secondary mb-2">Asset Tag (Auto-generated if empty)</label>
              <input 
                type="text" 
                value={formData.tag || ''}
                onChange={(e) => setFormData({...formData, tag: e.target.value})}
                placeholder="Leave blank for auto"
                className="w-full px-4 py-2.5 bg-bg-base border border-border-strong rounded-xl text-[13px] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-border-focus font-mono transition-colors"
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-[13px] font-medium text-text-secondary mb-2">Asset Name *</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="e.g. Dell Laptop"
                className="w-full px-4 py-2.5 bg-bg-base border border-border-strong rounded-xl text-[13px] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-border-focus transition-colors"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-[13px] font-medium text-text-secondary mb-2">Category *</label>
              <select 
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-4 py-2.5 bg-bg-base border border-border-strong rounded-xl text-[13px] text-text-primary focus:outline-none focus:border-border-focus appearance-none cursor-pointer transition-colors"
              >
                <option value="Electronics">Electronics</option>
                <option value="Furniture">Furniture</option>
                <option value="Vehicles">Vehicles</option>
                <option value="Infrastructure">Infrastructure</option>
              </select>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-[13px] font-medium text-text-secondary mb-2">Status *</label>
              <select 
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full px-4 py-2.5 bg-bg-base border border-border-strong rounded-xl text-[13px] text-text-primary focus:outline-none focus:border-border-focus appearance-none cursor-pointer transition-colors"
              >
                <option value="Available">Available</option>
                <option value="Allocated">Allocated</option>
                <option value="Reserved">Reserved</option>
                <option value="Under Maintenance">Under Maintenance</option>
                <option value="Lost">Lost</option>
                <option value="Retired">Retired</option>
                <option value="Disposed">Disposed</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-[13px] font-medium text-text-secondary mb-2">Location *</label>
              <input 
                type="text" 
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                placeholder="e.g. Bengaluru HQ"
                className="w-full px-4 py-2.5 bg-bg-base border border-border-strong rounded-xl text-[13px] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-border-focus transition-colors"
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-[13px] font-medium text-text-secondary mb-2">Department</label>
              <input 
                type="text" 
                value={formData.department || ''}
                onChange={(e) => setFormData({...formData, department: e.target.value})}
                placeholder="e.g. Engineering"
                className="w-full px-4 py-2.5 bg-bg-base border border-border-strong rounded-xl text-[13px] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-border-focus transition-colors"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-[13px] font-medium text-text-secondary mb-2">Serial Number</label>
              <input 
                type="text" 
                value={formData.serialNumber || ''}
                onChange={(e) => setFormData({...formData, serialNumber: e.target.value})}
                placeholder="e.g. SN-10293"
                className="w-full px-4 py-2.5 bg-bg-base border border-border-strong rounded-xl text-[13px] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-border-focus font-mono transition-colors"
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-[13px] font-medium text-text-secondary mb-2">Condition</label>
              <select 
                value={formData.condition || 'Good'}
                onChange={(e) => setFormData({...formData, condition: e.target.value})}
                className="w-full px-4 py-2.5 bg-bg-base border border-border-strong rounded-xl text-[13px] text-text-primary focus:outline-none focus:border-border-focus appearance-none cursor-pointer transition-colors"
              >
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Poor">Poor</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-[13px] font-medium text-text-secondary mb-2">Acquisition Date</label>
              <input 
                type="date" 
                value={formData.acquisitionDate || ''}
                onChange={(e) => setFormData({...formData, acquisitionDate: e.target.value})}
                className="w-full px-4 py-2.5 bg-bg-base border border-border-strong rounded-xl text-[13px] text-text-primary focus:outline-none focus:border-border-focus transition-colors"
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-[13px] font-medium text-text-secondary mb-2">Acquisition Cost</label>
              <input 
                type="text" 
                value={formData.acquisitionCost || ''}
                onChange={(e) => setFormData({...formData, acquisitionCost: e.target.value})}
                placeholder="e.g. $1,200"
                className="w-full px-4 py-2.5 bg-bg-base border border-border-strong rounded-xl text-[13px] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-border-focus transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center justify-between bg-bg-surface-alt p-4 rounded-xl border border-border-base">
            <div>
              <p className="text-[13px] font-medium text-text-primary">Shared / Bookable</p>
              <p className="text-[11px] text-text-secondary mt-0.5">Allow this asset to be booked by others</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={formData.shared || false}
                onChange={(e) => setFormData({...formData, shared: e.target.checked})}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-border-strong peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-text-primary"></div>
            </label>
          </div>

          <div>
            <label className="block text-[13px] font-medium text-text-secondary mb-2">Photo / Documents</label>
            <div className="w-full h-24 border-2 border-dashed border-border-strong rounded-xl flex items-center justify-center bg-bg-base hover:bg-bg-surface-alt cursor-pointer transition-colors">
              <span className="text-[12px] text-text-muted font-medium">Click to upload or drag and drop</span>
            </div>
          </div>
        </div>
        
        <div className="p-6 border-t border-border-base flex justify-end gap-3 bg-bg-surface-alt transition-colors duration-300 shrink-0">
          <button 
            onClick={onClose}
            className="px-5 py-2 text-[13px] font-medium text-text-secondary hover:text-text-primary transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={!isFormValid}
            className="px-5 py-2 text-[13px] font-medium text-text-inverted bg-bg-inverted hover:opacity-90 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {mode === 'add' ? 'Register' : 'Save Changes'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
