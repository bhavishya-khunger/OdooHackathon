"use client";

import { Search, Plus, Grid3X3, Box, CheckCircle2, Package, Wrench, CalendarClock, ArrowRightLeft } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import { StatsCardGrid, StatItem } from '../../components/ui/StatsCardGrid';
import { AlertBanner } from '../../components/ui/AlertBanner';
import { ActionButtonGroup } from '../../components/ui/ActionButtonGroup';
import { ActivityFeed, ActivityItem } from '../../components/ui/ActivityFeed';
import { AssetDistribution } from '../../components/ui/AssetDistribution';
import { apiFetch } from '@/lib/api';

// Helper for relative time
function timeAgo(dateStr: string) {
  const date = new Date(dateStr + "Z"); // Backend returns UTC without Z
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " mins ago";
  return "Just now";
}

export default function Dashboard() {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [statsData, setStatsData] = useState<StatItem[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [rawAssets, setRawAssets] = useState<any[]>([]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const results = await Promise.allSettled([
          apiFetch('/assets'),
          apiFetch('/allocations'),
          apiFetch('/maintenance'),
          apiFetch('/bookings'),
          apiFetch('/transfers'),
          apiFetch('/activity-logs')
        ]);

        const assets: any = results[0].status === 'fulfilled' ? results[0].value : [];
        const allocations: any = results[1].status === 'fulfilled' ? results[1].value : [];
        const maintenance: any = results[2].status === 'fulfilled' ? results[2].value : { items: [] };
        const bookings: any = results[3].status === 'fulfilled' ? results[3].value : { items: [] };
        const transfers: any = results[4].status === 'fulfilled' ? results[4].value : [];
        const logs: any = results[5].status === 'fulfilled' ? results[5].value : [];

        const totalAssets = assets.length;
        const availableAssets = assets.filter((a: any) => a.status === 'available').length;
        const allocatedAssets = assets.filter((a: any) => a.status === 'allocated').length;
        
        // Count tickets that are not resolved or rejected
        const openMaintenance = maintenance.items ? maintenance.items.filter((m: any) => m.status !== 'resolved' && m.status !== 'rejected').length : 0;
        
        // Active bookings (upcoming or ongoing)
        const activeBookings = bookings.items ? bookings.items.filter((b: any) => b.status === 'upcoming' || b.status === 'ongoing').length : 0;
        
        // Pending transfers
        const pendingTransfers = transfers.items ? transfers.items.filter((t: any) => t.status === 'pending').length : 0;

        setStatsData([
          { label: "Total Assets", value: totalAssets, icon: Box, color: "text-primary" },
          { label: "Assets Available", value: availableAssets, icon: CheckCircle2, color: "text-emerald-500" },
          { label: "Assets Allocated", value: allocatedAssets, icon: Package, color: "text-blue-500" },
          { label: "Maintenance Tickets", value: openMaintenance, icon: Wrench, color: "text-amber-500" },
          { label: "Active Bookings", value: activeBookings, icon: CalendarClock, color: "text-indigo-500" },
          { label: "Pending Transfers", value: pendingTransfers, icon: ArrowRightLeft, color: "text-purple-500" }
        ]);

        const mappedActivities: ActivityItem[] = logs.map((log: any) => ({
          id: log.id,
          action: log.action,
          asset: log.details || "",
          time: timeAgo(log.created_at),
          type: log.action.toLowerCase()
        }));
        
        setActivities(mappedActivities);
        setRawAssets(assets);

      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (isMounted) {
      fetchDashboardData();
    }
  }, [isMounted]);

  if (!isMounted) return null;

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden font-sans selection:bg-primary/30 p-6 md:p-8 lg:p-12">

      <div className="max-w-[1400px] mx-auto relative z-10 flex flex-col gap-10 animate-in fade-in duration-500">
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-8 mb-4">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
              </div>
              <span className="text-xs font-mono text-primary uppercase tracking-[0.2em] font-semibold">Fleet Synchronized</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-medium tracking-tight text-foreground">
              Command Rhythm.
            </h1>
            <p className="text-muted mt-4 max-w-lg text-base leading-relaxed">
              Track every asset from check-out to retirement — utilization, maintenance, and lifecycle status, all in one console.
            </p>
          </div>

          <ActionButtonGroup />
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4 opacity-70">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-muted font-medium text-sm tracking-wide">Syncing data...</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-6 mt-4 animate-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-xl font-serif font-medium text-foreground">Today's Overview</h2>
              <StatsCardGrid statsData={statsData} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4 animate-in slide-in-from-bottom-8 duration-700">
              <div className="w-full">
                <ActivityFeed activities={activities} />
              </div>
              <div className="w-full hidden lg:block">
                <AssetDistribution assets={rawAssets} />
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
