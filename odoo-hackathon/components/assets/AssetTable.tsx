import React from 'react';
import { motion } from 'framer-motion';
import { Edit2, Trash2, Box } from 'lucide-react';

export interface Asset {
  id: string;
  tag: string;
  name: string;
  category: string;
  status: string;
  location: string;
}

interface AssetTableProps {
  assets: Asset[];
  onEdit: (asset: Asset) => void;
  onDelete: (asset: Asset) => void;
}

const getStatusBadge = (status: string) => {
  let colorClass = 'bg-slate-100 text-slate-500 border-slate-200';
  let dotClass = 'bg-slate-400';
  
  if (status.toLowerCase() === 'allocated') {
    colorClass = 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/30';
    dotClass = 'bg-blue-500 dark:shadow-[0_0_6px_rgba(59,130,246,0.8)]';
  } else if (status.toLowerCase() === 'available') {
    colorClass = 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30';
    dotClass = 'bg-emerald-500 dark:shadow-[0_0_6px_rgba(16,185,129,0.8)]';
  } else if (status.toLowerCase() === 'maintenance') {
    colorClass = 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/30';
    dotClass = 'bg-amber-500 dark:shadow-[0_0_6px_rgba(245,158,11,0.8)]';
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold border ${colorClass}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} />
      {status}
    </span>
  );
};

export const AssetTable: React.FC<AssetTableProps> = ({ assets, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-[10px] text-slate-400 dark:text-cyan-400/60 font-mono uppercase tracking-[0.15em] bg-slate-50/80 dark:bg-[#030D1A]/40 border-b border-slate-100 dark:border-cyan-900/20">
          <tr>
            <th className="px-6 py-4 font-semibold">Tag</th>
            <th className="px-6 py-4 font-semibold">Name</th>
            <th className="px-6 py-4 font-semibold">Category</th>
            <th className="px-6 py-4 font-semibold">Status</th>
            <th className="px-6 py-4 font-semibold">Location</th>
            <th className="px-6 py-4 font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-cyan-900/20">
          {assets.map((asset, i) => (
            <motion.tr
              key={asset.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.25 }}
              className="hover:bg-slate-50 dark:hover:bg-cyan-900/10 transition-colors group"
            >
              <td className="px-6 py-4">
                <span className="font-mono text-cyan-700 dark:text-cyan-400 font-semibold">{asset.tag}</span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-cyan-950/40 border border-slate-200 dark:border-cyan-900/40 flex items-center justify-center">
                    <Box className="h-4 w-4 text-slate-400 dark:text-cyan-400/60" />
                  </div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{asset.name}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-slate-500 dark:text-cyan-100/70 capitalize">
                {asset.category}
              </td>
              <td className="px-6 py-4">
                {getStatusBadge(asset.status)}
              </td>
              <td className="px-6 py-4 text-slate-500 dark:text-cyan-100/70 capitalize">
                {asset.location}
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => onEdit(asset)}
                    className="text-slate-400 hover:text-cyan-600 dark:text-cyan-100/40 dark:hover:text-cyan-300 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-cyan-900/30 transition-colors"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => onDelete(asset)}
                    className="text-slate-400 hover:text-red-600 dark:text-cyan-100/40 dark:hover:text-red-400 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </motion.tr>
          ))}
          {assets.length === 0 && (
            <tr>
              <td colSpan={6} className="px-6 py-16 text-center text-slate-400 dark:text-cyan-100/30 text-sm font-mono">
                No assets match your filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
