"use client";

import React, { useState, useEffect } from 'react';
import { Download, ChevronDown, ChevronUp, Users } from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, LineChart, Line, YAxis, CartesianGrid } from 'recharts';
import { useTheme } from 'next-themes';
import { apiFetch } from '@/lib/api';

export default function ReportsPage() {
  const { resolvedTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [expandedAsset, setExpandedAsset] = useState<number | null>(null);

  const [utilizationData, setUtilizationData] = useState<any[]>([]);
  const [maintenanceData, setMaintenanceData] = useState<any[]>([]);
  const [mostUsedAssets, setMostUsedAssets] = useState<any[]>([]);
  const [idleAssets, setIdleAssets] = useState<any[]>([]);
  const [actionAssets, setActionAssets] = useState<any[]>([]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const results = await Promise.allSettled([
          apiFetch('/assets'),
          apiFetch('/maintenance'),
          apiFetch('/bookings')
        ]);

        const assets: any[] = results[0].status === 'fulfilled' ? (results[0].value as any[]) : [];
        const maintenance: any = results[1].status === 'fulfilled' ? results[1].value : { items: [] };
        const bookings: any = results[2].status === 'fulfilled' ? results[2].value : { items: [] };

        // 1. Utilization by Department (Count allocated assets by department)
        const deptCount: any = {};
        assets.forEach((a: any) => {
          if (a.department_name) {
            deptCount[a.department_name] = (deptCount[a.department_name] || 0) + 1;
          }
        });
        const utilData = Object.entries(deptCount)
          .map(([name, value]) => ({ name, value }))
          .sort((a: any, b: any) => b.value - a.value)
          .slice(0, 6);
        setUtilizationData(utilData.length > 0 ? utilData : [{ name: 'No Dept Data', value: 0 }]);

        // 2. Maintenance Frequency (Last 6 months)
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const currentMonth = new Date().getMonth();
        const last6Months = Array.from({length: 6}, (_, i) => {
          let m = currentMonth - 5 + i;
          if (m < 0) m += 12;
          return monthNames[m];
        });
        
        const mCounts: any = {};
        last6Months.forEach(m => mCounts[m] = 0);

        (maintenance.items || []).forEach((m: any) => {
          const d = new Date(m.created_at + "Z");
          const mStr = monthNames[d.getMonth()];
          if (mCounts[mStr] !== undefined) {
            mCounts[mStr]++;
          }
        });
        setMaintenanceData(last6Months.map(name => ({ name, value: mCounts[name] })));

        // 3. Most Used Assets
        const bookingCount: any = {};
        (bookings.items || []).forEach((b: any) => {
          bookingCount[b.asset_id] = (bookingCount[b.asset_id] || 0) + 1;
        });
        
        const topBookedIds = Object.keys(bookingCount)
          .sort((a, b) => bookingCount[b] - bookingCount[a])
          .slice(0, 3)
          .map(Number);
          
        const topAssets = topBookedIds.map(id => {
          const asset = assets.find((a: any) => a.id === id);
          return {
            id,
            name: asset ? asset.name : `Asset #${id}`,
            summary: `${bookingCount[id]} bookings total`,
            breakdown: [
              { user: 'All Users', count: bookingCount[id] }
            ]
          };
        });
        setMostUsedAssets(topAssets);

        // 4. Idle Assets
        const available = assets.filter(a => a.status === 'available' || a.status === 'retired');
        setIdleAssets(available.slice(0, 2).map(a => ({
          name: a.name,
          tag: a.tag,
          status: a.status
        })));

        // 5. Action Required (Poor condition or under maintenance)
        const actionReq = assets.filter(a => a.condition === 'poor' || a.status === 'under_maintenance');
        setActionAssets(actionReq.map(a => ({
          name: a.name,
          reason: a.condition === 'poor' ? 'Poor condition : Review for retirement' : 'Currently under maintenance',
          color: a.condition === 'poor' ? 'bg-rose-500' : 'bg-amber-500'
        })));

      } catch (err) {
        console.error("Failed to load reports data", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (isMounted) fetchData();
  }, [isMounted]);
  
  const isDark = resolvedTheme === 'dark';
  const primaryColor = isDark ? '#A8C7FA' : '#0B57D0';
  const textColor = isDark ? '#C4C7C5' : '#444746';
  const gridColor = isDark ? '#444746' : '#E3E3E3';
  const tooltipBg = isDark ? '#1E1F22' : '#FFFFFF';
  const tooltipBorder = isDark ? '#444746' : '#E3E3E3';

  if (!isMounted) return null;

  return (
    <div className="max-w-5xl mx-auto h-full flex flex-col pt-2 pb-12 animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-medium text-foreground tracking-tight">Reports & Analytics</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-surface hover:bg-surface-hover border border-border rounded-xl text-sm font-medium transition-colors cursor-pointer text-foreground">
          <Download className="h-4 w-4" />
          Export report
        </button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4 opacity-70 w-full h-full">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground font-medium text-sm tracking-wide">Crunching the numbers...</p>
        </div>
      ) : (
        <>
          {/* Charts Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {/* Utilization by Department - Bar Chart */}
            <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
              <h3 className="text-[15px] font-medium text-foreground mb-6">Asset Distribution by Department</h3>
              <div className="h-64 w-full -ml-4 outline-none focus:outline-none">
                <ResponsiveContainer width="100%" height="100%" className="outline-none">
                  <BarChart data={utilizationData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} className="outline-none">
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: textColor, fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: textColor, fontSize: 12 }} />
                    <Tooltip 
                      cursor={{ fill: isDark ? '#282A2C' : '#F1F3F4' }}
                      contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, borderRadius: '8px', color: isDark ? '#fff' : '#000', fontSize: '13px' }}
                      itemStyle={{ color: primaryColor, fontWeight: 600 }}
                      wrapperStyle={{ outline: 'none' }}
                    />
                    <Bar dataKey="value" fill={primaryColor} radius={[4, 4, 0, 0]} barSize={32} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Maintenance Frequency - Line Chart */}
            <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
              <h3 className="text-[15px] font-medium text-foreground mb-6">Maintenance Frequency (6 Mo)</h3>
              <div className="h-64 w-full -ml-4 outline-none focus:outline-none">
                <ResponsiveContainer width="100%" height="100%" className="outline-none">
                  <LineChart data={maintenanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} className="outline-none">
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: textColor, fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: textColor, fontSize: 12 }} allowDecimals={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, borderRadius: '8px', color: isDark ? '#fff' : '#000', fontSize: '13px' }}
                      itemStyle={{ color: primaryColor, fontWeight: 600 }}
                      wrapperStyle={{ outline: 'none' }}
                    />
                    <Line type="monotone" dataKey="value" stroke={primaryColor} strokeWidth={3} dot={{ r: 4, fill: tooltipBg, stroke: primaryColor, strokeWidth: 2 }} activeDot={{ r: 6, fill: primaryColor }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Asset Usage Lists */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-10 mt-4">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-foreground">Most Booked Assets</h3>
                {mostUsedAssets.length > 0 && <span className="text-xs text-muted-foreground font-medium bg-surface-hover px-2 py-1 rounded-md">Click to expand</span>}
              </div>
              
              {mostUsedAssets.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground border border-dashed border-border rounded-xl">No booking data available</div>
              ) : (
                <ul className="space-y-3">
                  {mostUsedAssets.map((asset) => {
                    const isExpanded = expandedAsset === asset.id;
                    return (
                      <li 
                        key={asset.id} 
                        className="flex flex-col rounded-xl border border-border hover:bg-surface-hover transition-all cursor-pointer overflow-hidden group"
                        onClick={() => setExpandedAsset(isExpanded ? null : asset.id)}
                      >
                        <div className="flex items-center justify-between p-4">
                          <div className="flex flex-col text-[15px] text-muted-foreground">
                            <span className="text-foreground font-medium">{asset.name}</span>
                            <span className="text-sm mt-0.5">{asset.summary}</span>
                          </div>
                          <button className="text-muted-foreground group-hover:text-foreground transition-colors p-1 rounded-md hover:bg-surface-hover/80">
                            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </button>
                        </div>
                        
                        {isExpanded && (
                          <div className="px-4 pb-4 pt-0 animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="border-t border-border pt-3">
                              <div className="flex items-center gap-2 mb-2">
                                <Users className="h-3.5 w-3.5 text-primary" />
                                <span className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">Booking Volume</span>
                              </div>
                              <div className="space-y-2 pl-5">
                                {asset.breakdown.map((b: any, idx: number) => (
                                  <div key={idx} className="flex justify-between items-center text-[13.5px]">
                                    <span className="text-foreground/90">{b.user}</span>
                                    <span className="font-mono text-muted-foreground text-[13px]">{b.count}x</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <div>
              <h3 className="text-lg font-medium text-foreground mb-4">Idle & Available Assets</h3>
              {idleAssets.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground border border-dashed border-border rounded-xl">No idle assets found</div>
              ) : (
                <ul className="space-y-3">
                  {idleAssets.map((asset, idx) => (
                    <li key={idx} className="text-[15px] text-muted-foreground flex flex-col p-4 rounded-xl border border-border border-dashed hover:border-solid hover:bg-surface-hover transition-all">
                      <span className="text-foreground font-medium">{asset.name}</span>
                      <span className="text-sm mt-0.5">Status: {asset.status} ({asset.tag})</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="w-full h-px bg-border my-4"></div>

          {/* Maintenance & Retirement */}
          <div className="mt-6">
            <h3 className="text-lg font-medium text-foreground mb-4">Action Required (Maintenance / Retirement)</h3>
            {actionAssets.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground border border-dashed border-border rounded-xl w-full max-w-md">All assets are in good condition</div>
            ) : (
              <ul className="space-y-3">
                {actionAssets.map((asset, idx) => (
                  <li key={idx} className="flex items-center gap-3 p-4 rounded-xl border border-border hover:bg-surface-hover transition-all">
                    <div className={`w-2.5 h-2.5 rounded-[3px] ${asset.color} shrink-0`}></div>
                    <span className="text-[15px] text-foreground font-medium">{asset.name}</span>
                    <span className="text-[15px] text-muted-foreground">: {asset.reason}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}
