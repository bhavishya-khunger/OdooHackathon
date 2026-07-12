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
  let bgColor = 'bg-bg-surface-alt text-text-secondary border-border-strong';
  let dotColor = 'bg-[#555]';
  
  if (status.toLowerCase() === 'allocated') {
    bgColor = 'bg-[#e0f2fe] text-[#0284c7] border-[#bae6fd] dark:bg-[#102a40] dark:text-[#4ea8ff] dark:border-[#1a4266]';
    dotColor = 'bg-[#0284c7] dark:bg-[#4ea8ff]';
  } else if (status.toLowerCase() === 'available') {
    bgColor = 'bg-[#dcfce7] text-[#16a34a] border-[#bbf7d0] dark:bg-[#10301a] dark:text-[#4ade80] dark:border-[#1a4d29]';
    dotColor = 'bg-[#16a34a] dark:bg-[#4ade80]';
  } else if (status.toLowerCase() === 'maintenance') {
    bgColor = 'bg-[#fef3c7] text-[#d97706] border-[#fde68a] dark:bg-[#3d250c] dark:text-[#fbbf24] dark:border-[#663d14]';
    dotColor = 'bg-[#d97706] dark:bg-[#fbbf24]';
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold border transition-colors duration-300 ${bgColor}`}>
      <span className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${dotColor}`} />
      {status}
    </span>
  );
};

export const AssetTable: React.FC<AssetTableProps> = ({ assets, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto bg-bg-surface border border-border-base rounded-3xl transition-colors duration-300">
      <table className="w-full text-[13px] text-left">
        <thead className="text-[11px] text-text-muted uppercase tracking-wider bg-bg-surface-alt border-b border-border-base transition-colors duration-300">
          <tr>
            <th className="px-6 py-4 font-semibold">Tag</th>
            <th className="px-6 py-4 font-semibold">Name</th>
            <th className="px-6 py-4 font-semibold">Category</th>
            <th className="px-6 py-4 font-semibold">Status</th>
            <th className="px-6 py-4 font-semibold">Location</th>
            <th className="px-6 py-4 font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-base transition-colors duration-300">
          {assets.map((asset, i) => (
            <motion.tr
              key={asset.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.25 }}
              className="hover:bg-bg-surface-hover transition-colors group"
            >
              <td className="px-6 py-4">
                <span className="font-mono text-text-primary font-semibold transition-colors duration-300">{asset.tag}</span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-bg-surface-hover flex items-center justify-center shrink-0 transition-colors duration-300">
                    <Box className="h-4 w-4 text-text-secondary transition-colors duration-300" />
                  </div>
                  <span className="font-semibold text-text-primary transition-colors duration-300">{asset.name}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-text-secondary capitalize transition-colors duration-300">
                {asset.category}
              </td>
              <td className="px-6 py-4">
                {getStatusBadge(asset.status)}
              </td>
              <td className="px-6 py-4 text-text-secondary capitalize transition-colors duration-300">
                {asset.location}
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => onEdit(asset)}
                    className="text-text-secondary hover:text-text-primary p-1.5 rounded-lg hover:bg-bg-surface-hover transition-colors"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => onDelete(asset)}
                    className="text-text-secondary hover:text-danger-base p-1.5 rounded-lg hover:bg-bg-surface-hover transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </motion.tr>
          ))}
          {assets.length === 0 && (
            <tr>
              <td colSpan={6} className="px-6 py-16 text-center text-text-muted text-sm transition-colors duration-300">
                No assets match your filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
