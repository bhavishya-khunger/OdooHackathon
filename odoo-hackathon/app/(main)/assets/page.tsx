"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter } from 'lucide-react';
import { containerVariants, itemVariants, smoothTransition } from '@/components/ui/motionVariants';
import PageHeader from '@/components/ui/PageHeader';

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
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('All');

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [currentAsset, setCurrentAsset] = useState<Asset | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [assetToDelete, setAssetToDelete] = useState<Asset | null>(null);

  // Filter options derived from data (or hardcoded, we will derive to make it robust)
  const categories = ['All', 'Electronics', 'Furniture', 'Vehicles', 'Infrastructure'];
  const statuses = ['All', 'Available', 'Allocated', 'Maintenance', 'Retired'];
  const locations = ['All', ...Array.from(new Set(assets.map(a => a.location)))];

  // Apply filters
  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || asset.category.toLowerCase() === categoryFilter.toLowerCase();
    const matchesStatus = statusFilter === 'All' || asset.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesLocation = locationFilter === 'All' || asset.location.toLowerCase() === locationFilter.toLowerCase();

    return matchesSearch && matchesCategory && matchesStatus && matchesLocation;
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

  const handleSaveAsset = (savedAsset: Asset) => {
    if (formMode === 'add') {
      setAssets([savedAsset, ...assets]);
    } else {
      setAssets(assets.map(a => a.id === savedAsset.id ? savedAsset : a));
    }
    setIsFormOpen(false);
  };

  const handleOpenDelete = (asset: Asset) => {
    setAssetToDelete(asset);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (assetToDelete) {
      setAssets(assets.filter(a => a.id !== assetToDelete.id));
      setIsDeleteOpen(false);
      setAssetToDelete(null);
    }
  };

  return (
    <div className="relative min-h-full">
      {/* Ambient background glows */}
      <div className="fixed top-0 right-[10%] w-[400px] h-[400px] bg-cyan-400/5 dark:bg-cyan-900/10 rounded-full blur-[120px] pointer-events-none -z-10 transition-colors duration-700" />
      <div className="fixed bottom-0 left-[20%] w-[500px] h-[500px] bg-indigo-400/5 dark:bg-emerald-900/10 rounded-full blur-[120px] pointer-events-none -z-10 transition-colors duration-700" />

      <motion.div
        className="max-w-[1400px] mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <PageHeader title="Asset Inventory" subtitle="Track and manage all organizational resources.">
          <motion.button
            onClick={handleOpenAdd}
            whileHover={{ y: -2, transition: smoothTransition }}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-2xl text-sm font-bold text-white dark:text-[#010810] shadow-[0_0_16px_rgba(6,182,212,0.3)] dark:shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center gap-2 hover:shadow-[0_0_24px_rgba(16,185,129,0.4)] transition-all duration-300 capitalize"
          >
            <Plus className="h-4 w-4" />
            Register Asset
          </motion.button>
        </PageHeader>

        <motion.div
          variants={itemVariants}
          className="bg-white/80 dark:bg-[#051324]/60 backdrop-blur-2xl border border-slate-200 dark:border-cyan-900/30 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.05)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden relative transition-colors duration-300"
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-200/80 dark:via-cyan-400/20 to-transparent pointer-events-none" />

          {/* Controls Bar */}
          <div className="p-5 flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-50/50 dark:bg-[#051324]/50 border-b border-slate-100 dark:border-cyan-900/30">
            {/* Global Search */}
            <div className="relative w-full md:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-cyan-500/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by tag or name..."
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-white dark:bg-[#051324]/80 border border-slate-200 dark:border-cyan-900/40 rounded-xl text-slate-700 dark:text-cyan-100/80 placeholder:text-slate-400 dark:placeholder:text-cyan-100/30 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 transition-all shadow-sm"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap md:flex-nowrap items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-2 bg-white dark:bg-[#030b14] border border-slate-200 dark:border-cyan-900/40 rounded-xl px-3 py-1.5 shadow-sm">
                <Filter className="h-3.5 w-3.5 text-slate-400 dark:text-cyan-500/60" />

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="text-xs font-semibold bg-transparent border-none focus:outline-none text-slate-600 dark:text-cyan-100/80 cursor-pointer"
                >
                  {categories.map(c => <option key={c} value={c}>{c === 'All' ? 'Category' : c}</option>)}
                </select>
                <div className="h-4 w-px bg-slate-200 dark:bg-cyan-900/50 mx-1"></div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="text-xs font-semibold bg-transparent border-none focus:outline-none text-slate-600 dark:text-cyan-100/80 cursor-pointer"
                >
                  {statuses.map(s => <option key={s} value={s}>{s === 'All' ? 'Status' : s}</option>)}
                </select>
                <div className="h-4 w-px bg-slate-200 dark:bg-cyan-900/50 mx-1"></div>

                <select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="text-xs font-semibold bg-transparent border-none focus:outline-none text-slate-600 dark:text-cyan-100/80 cursor-pointer w-20"
                >
                  {locations.map(l => <option key={l} value={l}>{l === 'All' ? 'Location' : l}</option>)}
                </select>
              </div>
            </div>
          </div>

          <AssetTable
            assets={filteredAssets}
            onEdit={handleOpenEdit}
            onDelete={handleOpenDelete}
          />

        </motion.div>
      </motion.div>

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
