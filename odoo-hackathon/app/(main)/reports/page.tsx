'use client';

import React, { useState } from 'react';
import { Download, ChevronDown, ChevronUp, Users } from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, LineChart, Line, YAxis, CartesianGrid } from 'recharts';
import { useTheme } from 'next-themes';

const utilizationData = [
  { name: 'HR', value: 45 },
  { name: 'IT', value: 65 },
  { name: 'Eng', value: 90 },
  { name: 'Ops', value: 55 },
  { name: 'Sales', value: 40 },
  { name: 'Mktg', value: 75 },
];

const maintenanceData = [
  { name: 'Jan', value: 5 },
  { name: 'Feb', value: 15 },
  { name: 'Mar', value: 12 },
  { name: 'Apr', value: 25 },
  { name: 'May', value: 30 },
  { name: 'Jun', value: 35 },
];

const mostUsedAssets = [
  {
    id: 1,
    name: 'Room B2',
    summary: '34 bookings this month',
    breakdown: [
      { user: 'Engineering Team', count: 18 },
      { user: 'Sarah Jenkins', count: 9 },
      { user: 'Mike Ross', count: 7 },
    ]
  },
  {
    id: 2,
    name: 'Van AF-343',
    summary: '21 trips this month',
    breakdown: [
      { user: 'Logistics Dept', count: 12 },
      { user: 'Dave from Sales', count: 6 },
      { user: 'Event Planning', count: 3 },
    ]
  },
  {
    id: 3,
    name: 'Projector AF-335',
    summary: '18 uses',
    breakdown: [
      { user: 'Marketing Team', count: 10 },
      { user: 'Design Dept', count: 5 },
      { user: 'John Doe', count: 3 },
    ]
  }
];

export default function ReportsPage() {
  const { resolvedTheme } = useTheme();
  const [expandedAsset, setExpandedAsset] = useState<number | null>(null);
  
  // Base colors that adapt to the theme manually for Recharts canvas
  const isDark = resolvedTheme === 'dark';
  const primaryColor = isDark ? '#A8C7FA' : '#0B57D0';
  const textColor = isDark ? '#C4C7C5' : '#444746';
  const gridColor = isDark ? '#444746' : '#E3E3E3';
  const tooltipBg = isDark ? '#1E1F22' : '#FFFFFF';
  const tooltipBorder = isDark ? '#444746' : '#E3E3E3';

  return (
    <div className="max-w-5xl mx-auto h-full flex flex-col pt-2 pb-12 animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-medium text-foreground tracking-tight">Reports & Analytics</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-surface hover:bg-surface-hover border border-border rounded-xl text-sm font-medium transition-colors cursor-pointer text-foreground">
          <Download className="h-4 w-4" />
          Export report
        </button>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* Utilization by Department - Bar Chart */}
        <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
          <h3 className="text-[15px] font-medium text-foreground mb-6">Utilization by department</h3>
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
          <h3 className="text-[15px] font-medium text-foreground mb-6">Maintenance Frequency</h3>
          <div className="h-64 w-full -ml-4 outline-none focus:outline-none">
            <ResponsiveContainer width="100%" height="100%" className="outline-none">
              <LineChart data={maintenanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} className="outline-none">
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: textColor, fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: textColor, fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, borderRadius: '8px', color: isDark ? '#fff' : '#000', fontSize: '13px' }}
                  itemStyle={{ color: primaryColor, fontWeight: 600 }}
                  wrapperStyle={{ outline: 'none' }}
                />
                <Line type="monotone" dataKey="value" stroke={primaryColor} strokeWidth={3} dot={{ r: 4, fill: tooltipBg, stroke: primaryColor, strokeWidth: 2 }} activeDot={{ r: 6, fill: primaryColor, outline: 'none' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Asset Usage Lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-10 mt-4">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-foreground">Most used assets</h3>
            <span className="text-xs text-muted font-medium bg-surface-hover px-2 py-1 rounded-md">Click to view users</span>
          </div>
          <ul className="space-y-3">
            {mostUsedAssets.map((asset) => {
              const isExpanded = expandedAsset === asset.id;
              return (
                <li 
                  key={asset.id} 
                  className="flex flex-col rounded-xl border border-border border-dashed hover:border-solid hover:bg-surface-hover transition-all cursor-pointer overflow-hidden group"
                  onClick={() => setExpandedAsset(isExpanded ? null : asset.id)}
                >
                  <div className="flex items-center justify-between p-4">
                    <div className="flex flex-col text-[15px] text-muted">
                      <span className="text-foreground font-medium">{asset.name}</span>
                      <span className="text-sm mt-0.5">{asset.summary}</span>
                    </div>
                    <button className="text-muted group-hover:text-foreground transition-colors p-1 rounded-md hover:bg-surface-hover/80">
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                  </div>
                  
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-0 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="border-t border-border/50 pt-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="h-3.5 w-3.5 text-primary" />
                          <span className="text-[12px] font-semibold uppercase tracking-wider text-muted">Top Users</span>
                        </div>
                        <div className="space-y-2 pl-5">
                          {asset.breakdown.map((b, idx) => (
                            <div key={idx} className="flex justify-between items-center text-[13.5px]">
                              <span className="text-foreground/90">{b.user}</span>
                              <span className="font-mono text-muted text-[13px]">{b.count}x</span>
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
        </div>

        <div>
          <h3 className="text-lg font-medium text-foreground mb-4">Idle assets</h3>
          <ul className="space-y-3">
            <li className="text-[15px] text-muted flex flex-col p-4 rounded-xl border border-border border-dashed hover:border-solid hover:bg-surface-hover transition-all">
              <span className="text-foreground font-medium">Camera AF-0301</span>
              <span className="text-sm mt-0.5">unused 60+ days</span>
            </li>
            <li className="text-[15px] text-muted flex flex-col p-4 rounded-xl border border-border border-dashed hover:border-solid hover:bg-surface-hover transition-all">
              <span className="text-foreground font-medium">Chair AF-0410</span>
              <span className="text-sm mt-0.5">unused 45 days</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="w-full h-px bg-border my-4"></div>

      {/* Maintenance & Retirement */}
      <div className="mt-6">
        <h3 className="text-lg font-medium text-foreground mb-4">Assets due for maintenance / nearing retirement</h3>
        <ul className="space-y-3">
          <li className="flex items-center gap-3 p-4 rounded-xl border border-border border-dashed hover:border-solid hover:bg-surface-hover transition-all">
            <div className="w-2.5 h-2.5 rounded-[3px] bg-amber-500 shrink-0"></div>
            <span className="text-[15px] text-foreground font-medium">Forklift AF-0087</span>
            <span className="text-[15px] text-muted">: service due in 5 days</span>
          </li>
          <li className="flex items-center gap-3 p-4 rounded-xl border border-border border-dashed hover:border-solid hover:bg-surface-hover transition-all">
            <div className="w-2.5 h-2.5 rounded-[3px] bg-rose-500 shrink-0"></div>
            <span className="text-[15px] text-foreground font-medium">Laptop AF-0020</span>
            <span className="text-[15px] text-muted">: 4 years old : nearing retirement</span>
          </li>
        </ul>
      </div>

    </div>
  );
}
