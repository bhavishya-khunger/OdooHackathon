import React from 'react';
import { motion } from 'framer-motion';
import { Edit2, Trash2 } from 'lucide-react';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

interface UserTableProps {
  users: UserProfile[];
  onEdit: (user: UserProfile) => void;
  onDelete: (user: UserProfile) => void;
}

const getStatusBadge = (status: string) => {
  const isActive = status.toLowerCase() === 'active';
  const bgColor = isActive ? 'bg-[#10301a] text-[#4ade80] border-[#1a4d29]' : 'bg-[#3d1a1a] text-[#ff4444] border-[#661a1a]';
  const dotColor = isActive ? 'bg-[#4ade80]' : 'bg-[#ff4444]';

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold border ${bgColor}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      {status}
    </span>
  );
};

const getRoleBadge = (role: string) => {
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold border bg-bg-surface-alt text-text-secondary border-border-strong uppercase">
      {role}
    </span>
  );
};

export const UserTable: React.FC<UserTableProps> = ({ users, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto bg-bg-surface border border-border-base rounded-3xl">
      <table className="w-full text-[13px] text-left">
        <thead className="text-[11px] text-text-muted uppercase tracking-wider bg-bg-surface-alt border-b border-border-base">
          <tr>
            <th className="px-6 py-4 font-semibold">User</th>
            <th className="px-6 py-4 font-semibold">Role</th>
            <th className="px-6 py-4 font-semibold">Status</th>
            <th className="px-6 py-4 font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-base">
          {users.map((user, i) => (
            <motion.tr
              key={user.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.25 }}
              className="hover:bg-bg-surface-hover transition-colors group"
            >
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-accent-base flex items-center justify-center shrink-0 text-text-inverted font-bold text-xs">
                    {user.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold text-text-primary">{user.name}</div>
                    <div className="text-text-muted text-xs">{user.email}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                {getRoleBadge(user.role)}
              </td>
              <td className="px-6 py-4">
                {getStatusBadge(user.status)}
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => onEdit(user)}
                    className="text-text-secondary hover:text-text-primary p-1.5 rounded-lg hover:bg-bg-surface-hover transition-colors"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => onDelete(user)}
                    className="text-text-secondary hover:text-[#ff4444] p-1.5 rounded-lg hover:bg-bg-surface-hover transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </motion.tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td colSpan={4} className="px-6 py-16 text-center text-text-muted text-sm">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
