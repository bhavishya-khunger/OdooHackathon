import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    location: ''
  });

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && initialData) {
        setFormData(initialData);
      } else {
        setFormData({ tag: '', name: '', category: 'Electronics', status: 'Available', location: '' });
      }
    }
  }, [isOpen, mode, initialData]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!formData.tag || !formData.name || !formData.category || !formData.status || !formData.location) return;
    
    const assetToSave: Asset = {
      id: initialData?.id || `asset_${Date.now()}`,
      tag: formData.tag,
      name: formData.name,
      category: formData.category,
      status: formData.status,
      location: formData.location
    };
    onSave(assetToSave);
  };

  const isFormValid = formData.tag && formData.name && formData.category && formData.status && formData.location;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        className="absolute inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }} 
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-lg bg-white dark:bg-[#0A1E3F] border border-slate-200 dark:border-cyan-900/50 rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-cyan-900/30">
          <h2 className="text-xl font-serif font-medium text-slate-900 dark:text-white">
            {mode === 'add' ? 'Register New Asset' : 'Edit Asset'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-semibold text-slate-700 dark:text-cyan-100/80 mb-2">Asset Tag *</label>
              <input 
                type="text" 
                value={formData.tag}
                onChange={(e) => setFormData({...formData, tag: e.target.value})}
                placeholder="e.g. AF-0012"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#030b14] border border-slate-200 dark:border-cyan-900/40 rounded-xl text-slate-800 dark:text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 font-mono"
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-semibold text-slate-700 dark:text-cyan-100/80 mb-2">Asset Name *</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="e.g. Dell Laptop"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#030b14] border border-slate-200 dark:border-cyan-900/40 rounded-xl text-slate-800 dark:text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-semibold text-slate-700 dark:text-cyan-100/80 mb-2">Category *</label>
              <select 
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#030b14] border border-slate-200 dark:border-cyan-900/40 rounded-xl text-slate-800 dark:text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 appearance-none"
              >
                <option value="Electronics">Electronics</option>
                <option value="Furniture">Furniture</option>
                <option value="Vehicles">Vehicles</option>
                <option value="Infrastructure">Infrastructure</option>
              </select>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-semibold text-slate-700 dark:text-cyan-100/80 mb-2">Status *</label>
              <select 
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#030b14] border border-slate-200 dark:border-cyan-900/40 rounded-xl text-slate-800 dark:text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 appearance-none"
              >
                <option value="Available">Available</option>
                <option value="Allocated">Allocated</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Retired">Retired</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-cyan-100/80 mb-2">Location / Department *</label>
            <input 
              type="text" 
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              placeholder="e.g. Bengaluru HQ"
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#030b14] border border-slate-200 dark:border-cyan-900/40 rounded-xl text-slate-800 dark:text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
            />
          </div>
        </div>
        
        <div className="p-6 border-t border-slate-100 dark:border-cyan-900/30 flex justify-end gap-3 bg-slate-50/50 dark:bg-cyan-950/10">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-semibold text-slate-600 dark:text-cyan-100/70 hover:bg-slate-100 dark:hover:bg-cyan-900/40 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={!isFormValid}
            className="px-5 py-2.5 text-sm font-bold text-white bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-500 dark:hover:bg-cyan-400 rounded-xl shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {mode === 'add' ? 'Register' : 'Save Changes'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
