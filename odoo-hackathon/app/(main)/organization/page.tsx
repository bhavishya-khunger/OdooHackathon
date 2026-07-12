"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, MoreHorizontal, AlertCircle, Building2, Users, Tag } from 'lucide-react';
import { containerVariants, itemVariants, smoothTransition } from '@/components/ui/motionVariants';
import PageHeader from '@/components/ui/PageHeader';

const departments = [
  { id: 1, name: 'Engineering', head: 'Aditi Rao', initials: 'AR', color: 'bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-500/30', parent: '—', status: 'Active', assetCount: 142 },
  { id: 2, name: 'Facilities', head: 'Rohan Mehta', initials: 'RM', color: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30', parent: '—', status: 'Active', assetCount: 87 },
  { id: 3, name: 'Field Ops (East)', head: 'Sana Iqbal', initials: 'SI', color: 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-500/30', parent: 'Field Ops', status: 'Inactive', assetCount: 34 },
];

const tabs = [
  { id: 'departments', label: 'Departments', icon: Building2 },
  { id: 'categories', label: 'Categories', icon: Tag },
  { id: 'employees', label: 'Employees', icon: Users },
];

export default function OrganizationSetup() {
  const [activeTab, setActiveTab] = useState('departments');
  const [search, setSearch] = useState('');

  const filtered = departments.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

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
        {/* Header */}
        <PageHeader title="Organization Setup" subtitle="Manage departments, categories, and employees.">
          <motion.button
            whileHover={{ y: -2, transition: smoothTransition }}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-2xl text-sm font-bold text-white dark:text-[#010810] shadow-[0_0_16px_rgba(6,182,212,0.3)] dark:shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center gap-2 hover:shadow-[0_0_24px_rgba(16,185,129,0.4)] transition-all duration-300"
          >
            <Plus className="h-4 w-4" />
            Add Department
          </motion.button>
        </PageHeader>

        {/* Main card */}
        <motion.div
          variants={itemVariants}
          className="bg-white/80 dark:bg-[#051324]/60 backdrop-blur-2xl border border-slate-200 dark:border-cyan-900/30 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.05)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden relative transition-colors duration-300"
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-200/80 dark:via-cyan-400/20 to-transparent pointer-events-none" />

          {/* Tabs */}
          <div className="border-b border-slate-200 dark:border-cyan-900/30 px-6 bg-slate-50/50 dark:bg-[#051324]/50">
            <div className="flex gap-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-4 px-5 text-sm font-semibold border-b-2 transition-all -mb-px ${
                      activeTab === tab.id
                        ? 'border-cyan-500 text-cyan-600 dark:text-cyan-300'
                        : 'border-transparent text-slate-500 dark:text-cyan-100/40 hover:text-slate-700 dark:hover:text-cyan-200 hover:border-slate-300 dark:hover:border-cyan-900/50'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Toolbar */}
          <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/30 dark:bg-[#030D1A]/30 border-b border-slate-100 dark:border-cyan-900/20">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-cyan-500/40" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search departments..."
                className="w-full pl-9 pr-4 py-2 text-sm bg-white dark:bg-[#051324]/80 border border-slate-200 dark:border-cyan-900/40 rounded-full text-slate-700 dark:text-cyan-100/80 placeholder:text-slate-400 dark:placeholder:text-cyan-100/30 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 transition-all"
              />
            </div>
            <span className="text-xs text-slate-500 dark:text-cyan-400/60 font-mono px-3 py-1.5 bg-slate-100 dark:bg-cyan-950/40 border border-slate-200 dark:border-cyan-900/50 rounded-xl tracking-widest">
              {filtered.length} results
            </span>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-[10px] text-slate-400 dark:text-cyan-400/60 font-mono uppercase tracking-[0.15em] bg-slate-50/80 dark:bg-[#030D1A]/40 border-b border-slate-100 dark:border-cyan-900/20">
                <tr>
                  <th className="px-6 py-4 font-semibold">Department</th>
                  <th className="px-6 py-4 font-semibold">Head</th>
                  <th className="px-6 py-4 font-semibold">Parent Dept</th>
                  <th className="px-6 py-4 font-semibold">Assets</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-cyan-900/20">
                {filtered.map((dept, i) => (
                  <motion.tr
                    key={dept.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.25 }}
                    className="hover:bg-slate-50 dark:hover:bg-cyan-900/10 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-cyan-950/40 border border-slate-200 dark:border-cyan-900/40 flex items-center justify-center">
                          <Building2 className="h-4 w-4 text-slate-400 dark:text-cyan-400/60" />
                        </div>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{dept.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold border ${dept.color}`}>
                          {dept.initials}
                        </div>
                        <span className="text-slate-600 dark:text-cyan-100/70 font-medium">{dept.head}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-400 dark:text-cyan-100/40 font-mono text-xs">{dept.parent}</td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-800 dark:text-slate-200">{dept.assetCount}</span>
                      <span className="text-slate-400 dark:text-cyan-100/40 text-xs ml-1 font-mono">assets</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold border ${
                        dept.status === 'Active'
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30'
                          : 'bg-slate-100 dark:bg-slate-900/40 text-slate-500 border-slate-200 dark:border-slate-700/40'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          dept.status === 'Active'
                            ? 'bg-emerald-500 dark:shadow-[0_0_6px_rgba(52,211,153,0.8)]'
                            : 'bg-slate-400'
                        }`} />
                        {dept.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-slate-300 dark:text-cyan-100/20 hover:text-slate-600 dark:hover:text-cyan-300 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-cyan-900/30 transition-colors opacity-0 group-hover:opacity-100">
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center text-slate-400 dark:text-cyan-100/30 text-sm font-mono">
                      No departments match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Info banner */}
        <motion.div
          variants={itemVariants}
          className="mt-6 flex items-center gap-4 bg-cyan-50 dark:bg-cyan-950/30 backdrop-blur-sm border border-cyan-200 dark:border-cyan-900/40 p-5 rounded-2xl text-sm text-slate-600 dark:text-cyan-100/60 transition-colors duration-300"
        >
          <div className="w-9 h-9 rounded-xl bg-cyan-100 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-500/20 flex items-center justify-center shrink-0">
            <AlertCircle className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
          </div>
          <p>
            Editing a department here also drives the picklist in{' '}
            <span className="font-semibold text-slate-900 dark:text-slate-200">Asset Allocation</span> and{' '}
            <span className="font-semibold text-slate-900 dark:text-slate-200">Resource Booking</span> screens.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
