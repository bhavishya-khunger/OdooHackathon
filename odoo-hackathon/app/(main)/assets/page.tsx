"use client";

import { Box, Search, Plus, Grid } from 'lucide-react';

export default function AssetsPage() {
  return (
    <div className="min-h-full bg-[#0F0F0F] text-[#f5f5f5] p-10 flex flex-col font-sans relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-20">
        <h1 className="text-[28px] font-semibold tracking-tight">Assets</h1>
        
        <div className="flex items-center gap-6">
          {/* Filters */}
          <div className="flex items-center bg-[#141414] border border-[#2A2A2A] rounded-full p-1 text-[13px] font-medium text-[#888]">
            <button className="px-4 py-1.5 bg-[#2A2A2A] text-[#f5f5f5] rounded-full transition-colors">By you</button>
            <button className="px-4 py-1.5 hover:text-[#f5f5f5] transition-colors">Recents</button>
            <button className="px-4 py-1.5 hover:text-[#f5f5f5] transition-colors">By others</button>
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-4 text-[#888]">
            <Grid className="h-5 w-5 hover:text-[#f5f5f5] cursor-pointer transition-colors" />
            <Plus className="h-5 w-5 hover:text-[#f5f5f5] cursor-pointer transition-colors" />
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-[#666]" />
            <input
              type="text"
              placeholder="Search for an asset"
              className="pl-10 pr-4 py-2.5 w-72 bg-[#141414] border border-[#2A2A2A] rounded-full text-[13px] text-[#f5f5f5] placeholder:text-[#666] focus:outline-none focus:border-[#444] transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Empty State */}
      <div className="flex-1 flex flex-col items-center justify-center -mt-20">
        <div className="w-[100px] h-[100px] mb-8 text-[#333]">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
          </svg>
        </div>
        
        <p className="text-[14px] text-[#888] mb-8">
          No assets yet. As you register and view assets, they'll appear here.
        </p>
        
        <button className="flex items-center gap-2 px-5 py-2.5 bg-transparent border border-[#333] hover:bg-[#1A1A1A] hover:border-[#444] rounded-full text-[13px] font-medium text-[#f5f5f5] transition-colors mb-4">
          <Box className="h-[18px] w-[18px] text-[#888]" />
          Allow system access
        </button>
        
        <p className="text-[13px] text-[#666]">
          to view assets stored in the database.
        </p>
      </div>

      {/* Floating Action Button (N) */}
      <div className="absolute bottom-10 right-10 w-11 h-11 bg-[#1A1A1A] border border-[#333] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#222] transition-colors shadow-lg">
        <span className="text-[#f5f5f5] font-semibold text-sm">N</span>
      </div>
    </div>
  );
}
