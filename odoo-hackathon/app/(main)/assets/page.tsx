"use client";

import { useState, useEffect, useCallback } from 'react';
import { Box, Search, Plus, Grid } from 'lucide-react';

import { AssetTable, AssetResponse } from '@/components/assets/AssetTable';
import { AssetFormModal } from '@/components/assets/AssetFormModal';
import { DeleteConfirmModal } from '@/components/assets/DeleteConfirmModal';
import { AssetDetailsModal } from '@/components/assets/AssetDetailsModal';
import { apiFetch } from '@/lib/api';
import PageHeader from '@/components/ui/PageHeader';
import { useAuth } from '@/components/providers/AuthProvider';

export default function AssetsPage() {
  const { user } = useAuth();
  const [assets, setAssets] = useState<AssetResponse[]>([]);
  const [categories, setCategories] = useState<{id: number, name: string}[]>([]);
  const [departments, setDepartments] = useState<{id: number, name: string}[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search and Filters
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [currentAsset, setCurrentAsset] = useState<AssetResponse | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [assetToDelete, setAssetToDelete] = useState<AssetResponse | null>(null);

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [assetToView, setAssetToView] = useState<AssetResponse | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [assetsData, catsData, deptsData] = await Promise.all([
        apiFetch<AssetResponse[]>('/assets'),
        apiFetch<{id: number, name: string}[]>('/categories'),
        apiFetch<{id: number, name: string}[]>('/departments')
      ]);
      setAssets(assetsData);
      setCategories(catsData);
      setDepartments(deptsData);
    } catch (err) {
      console.error("Failed to fetch assets data", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredAssets = assets.filter(asset => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      asset.tag.toLowerCase().includes(q) || 
      asset.name.toLowerCase().includes(q) ||
      (asset.serial_number || '').toLowerCase().includes(q) ||
      (asset.category_name || '').toLowerCase().includes(q) ||
      asset.status.toLowerCase().includes(q) ||
      (asset.department_name || '').toLowerCase().includes(q) ||
      asset.location.toLowerCase().includes(q);
    return matchesSearch;
  });

  const handleOpenAdd = () => {
    setFormMode('add');
    setCurrentAsset(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (asset: AssetResponse) => {
    setFormMode('edit');
    setCurrentAsset(asset);
    setIsFormOpen(true);
  };

  const handleOpenDelete = (asset: AssetResponse) => {
    setAssetToDelete(asset);
    setIsDeleteOpen(true);
  };

  const handleOpenDetails = (asset: AssetResponse) => {
    setAssetToView(asset);
    setIsDetailsOpen(true);
  };

  const handleSaveAsset = async (payload: any) => {
    try {
      if (formMode === 'add') {
        await apiFetch('/assets', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
      } else if (currentAsset) {
        // Update basic details
        await apiFetch(`/assets/${currentAsset.id}`, {
          method: 'PATCH',
          body: JSON.stringify(payload)
        });
        
        // Update status separately if it changed
        if (payload.status !== currentAsset.status) {
            await apiFetch(`/assets/${currentAsset.id}/status`, {
                method: 'PATCH',
                body: JSON.stringify({ status: payload.status })
            });
        }
      }
      setIsFormOpen(false);
      fetchData();
    } catch (err: any) {
      console.error("Failed to save asset", err);
      alert(`Failed to save asset. ${err.message || 'Unknown error'}`);
    }
  };

  const handleConfirmDelete = async () => {
    if (assetToDelete) {
      try {
        await apiFetch(`/assets/${assetToDelete.id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status: 'retired' })
        });
        fetchData();
      } catch (err) {
        console.error("Failed to retire asset", err);
        alert("Failed to retire asset. You must be an admin.");
      }
      setIsDeleteOpen(false);
      setAssetToDelete(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 font-sans">
      {/* Header */}
      <PageHeader title="Assets" subtitle="Manage and track all company assets.">
        {(user?.role === 'admin' || user?.role === 'asset_manager') && (
          <button
            onClick={handleOpenAdd}
            className="px-6 py-3 bg-btn-bg hover:bg-btn-hover text-btn-text rounded-2xl text-sm font-bold shadow-sm flex items-center gap-2 transition-all duration-300"
          >
            <Plus className="h-4 w-4" />
            Register Asset
          </button>
        )}
      </PageHeader>

      {/* Main card */}
      <div className="bg-surface border border-border rounded-xl shadow-sm overflow-hidden relative transition-colors duration-300">
        
        {/* Search */}
        <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-background/50 border-b border-border">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search assets..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-surface text-foreground"
            />
          </div>
        </div>

        {/* Table Area */}
        <div className="overflow-x-auto">

      {isLoading ? (
        <div className="p-10 text-center text-muted">Loading assets...</div>
      ) : assets.length === 0 ? (
        <div className="px-6 py-16 text-center text-muted text-sm font-mono">
          No assets yet.
        </div>
      ) : (
        <AssetTable 
          assets={filteredAssets} 
          onEdit={handleOpenEdit} 
          onDelete={handleOpenDelete} 
          onViewDetails={handleOpenDetails}
        />
      )}
      </div>
      </div>

      <AssetFormModal 
        isOpen={isFormOpen}
        mode={formMode}
        initialData={currentAsset}
        categories={categories}
        departments={departments}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveAsset}
      />

      <DeleteConfirmModal 
        isOpen={isDeleteOpen}
        asset={assetToDelete}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
      />

      <AssetDetailsModal 
        isOpen={isDetailsOpen}
        asset={assetToView}
        onClose={() => setIsDetailsOpen(false)}
      />

    </div>
  );
}
