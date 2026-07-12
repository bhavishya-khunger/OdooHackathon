"use client";

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Box, Search, Plus, Grid } from 'lucide-react';

import { Asset, AssetTable } from '@/components/assets/AssetTable';
import { AssetFormModal } from '@/components/assets/AssetFormModal';
import { DeleteConfirmModal } from '@/components/assets/DeleteConfirmModal';

const initialAssets: Asset[] = [
  {
    id: "asset_001",
    tag: "AF-0012",
    name: "Dell Laptop",
    category: "Electronics",
    status: "Allocated",
    location: "bengaluru"
  },
  {
    id: "asset_002",
    tag: "AF-0062",
    name: "Projector",
    category: "Electronics",
    status: "Maintenance",
    location: "HQ floor 2"
  },
  {
    id: "asset_003",
    tag: "AF-0201",
    name: "Office chair",
    category: "Furniture",
    status: "Available",
    location: "Warehouse"
  }
];

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>(initialAssets);

  // Search and Filters
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [currentAsset, setCurrentAsset] = useState<Asset | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [assetToDelete, setAssetToDelete] = useState<Asset | null>(null);

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.tag.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          asset.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleOpenAdd = () => {
    setFormMode('add');
    setCurrentAsset(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (asset: Asset) => {
    setFormMode('edit');
    setCurrentAsset(asset);
    setIsFormOpen(true);
  };

  const handleOpenDelete = (asset: Asset) => {
    setAssetToDelete(asset);
    setIsDeleteOpen(true);
  };

  const handleSaveAsset = (savedAsset: Asset) => {
    if (formMode === 'add') {
      setAssets([...assets, savedAsset]);
    } else {
      setAssets(assets.map(a => a.id === savedAsset.id ? savedAsset : a));
    }
    setIsFormOpen(false);
  };

  const handleConfirmDelete = () => {
    if (assetToDelete) {
      setAssets(assets.filter(a => a.id !== assetToDelete.id));
      setIsDeleteOpen(false);
      setAssetToDelete(null);
    }
  };

  return (
    <div className="min-h-full bg-bg-base text-text-primary p-10 flex flex-col font-sans relative">
      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-10">
        <h1 className="text-[28px] font-semibold tracking-tight">Assets</h1>
        
        <div className="flex flex-wrap items-center gap-6">
          {/* Filters Pill (Design Placeholder as per screenshot) */}
          <div className="flex items-center bg-bg-surface border border-border-base rounded-full p-1 text-[13px] font-medium text-text-secondary">
            <button className="px-4 py-1.5 bg-bg-surface-hover text-text-primary rounded-full transition-colors">By you</button>
            <button className="px-4 py-1.5 hover:text-text-primary transition-colors">Recents</button>
            <button className="px-4 py-1.5 hover:text-text-primary transition-colors">By others</button>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for an asset"
              className="pl-10 pr-4 py-2 w-64 md:w-72 bg-bg-surface border border-border-base rounded-full text-[13px] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-border-focus transition-colors"
            />
          </div>

          <div className="flex items-center gap-4 text-text-secondary">
            <Grid className="h-5 w-5 hover:text-text-primary cursor-pointer transition-colors" />
            <button 
              onClick={handleOpenAdd}
              className="h-8 w-8 bg-bg-inverted hover:opacity-90 text-text-inverted rounded-full flex items-center justify-center transition-colors"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {assets.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center -mt-20">
          <div className="w-[100px] h-[100px] mb-8 text-[#333]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
          </div>
          <p className="text-[14px] text-text-secondary mb-8">
            No assets yet. As you register and view assets, they'll appear here.
          </p>
          <button 
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-5 py-2.5 bg-transparent border border-border-strong hover:bg-bg-surface-alt hover:border-border-focus rounded-full text-[13px] font-medium text-text-primary transition-colors mb-4"
          >
            <Box className="h-[18px] w-[18px] text-text-secondary" />
            Register your first asset
          </button>
        </div>
      ) : (
        <AssetTable 
          assets={filteredAssets} 
          onEdit={handleOpenEdit} 
          onDelete={handleOpenDelete} 
        />
      )}

      {/* Floating Action Button (N) */}
      <div className="absolute bottom-10 right-10 w-11 h-11 bg-bg-surface-alt border border-border-strong rounded-full flex items-center justify-center cursor-pointer hover:bg-bg-surface-hover transition-colors shadow-lg z-10">
        <span className="text-text-primary font-semibold text-sm">N</span>
      </div>

      <AnimatePresence>
        {isFormOpen && (
          <AssetFormModal 
            isOpen={isFormOpen}
            mode={formMode}
            initialData={currentAsset}
            onClose={() => setIsFormOpen(false)}
            onSave={handleSaveAsset}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isDeleteOpen && (
          <DeleteConfirmModal 
            isOpen={isDeleteOpen}
            asset={assetToDelete}
            onClose={() => setIsDeleteOpen(false)}
            onConfirm={handleConfirmDelete}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
