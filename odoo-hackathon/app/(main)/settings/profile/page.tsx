'use client';

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { UserTable, UserProfile } from '@/components/settings/UserTable';
import { UserFormModal } from '@/components/settings/UserFormModal';
import { DeleteUserModal } from '@/components/settings/DeleteUserModal';

const initialUsers: UserProfile[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'Manager', status: 'Active' },
  { id: '3', name: 'Bob Wilson', email: 'bob@example.com', role: 'User', status: 'Inactive' },
];

export default function ProfileSettingsPage() {
  const [users, setUsers] = useState<UserProfile[]>(initialUsers);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

  const handleAddUser = (user: Omit<UserProfile, 'id'>) => {
    const newUser: UserProfile = {
      ...user,
      id: Math.random().toString(36).substring(2, 9),
    };
    setUsers([...users, newUser]);
    setIsFormOpen(false);
  };

  const handleUpdateUser = (updatedData: Omit<UserProfile, 'id'>) => {
    if (!selectedUser) return;
    setUsers(users.map(u => u.id === selectedUser.id ? { ...u, ...updatedData } : u));
    setIsFormOpen(false);
    setSelectedUser(null);
  };

  const handleDeleteUser = () => {
    if (!selectedUser) return;
    setUsers(users.filter(u => u.id !== selectedUser.id));
    setIsDeleteOpen(false);
    setSelectedUser(null);
  };

  const openEdit = (user: UserProfile) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  };

  const openDelete = (user: UserProfile) => {
    setSelectedUser(user);
    setIsDeleteOpen(true);
  };

  const openAdd = () => {
    setSelectedUser(null);
    setIsFormOpen(true);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto min-h-screen font-sans">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-text-primary tracking-tight">User Management</h1>
          <p className="text-text-secondary mt-1">Manage users, roles, and access across your organization.</p>
        </div>
        
        <button 
          onClick={openAdd}
          className="bg-text-primary text-bg-inverted hover:bg-text-secondary px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Add User
        </button>
      </div>

      <UserTable 
        users={users} 
        onEdit={openEdit}
        onDelete={openDelete}
      />

      <UserFormModal 
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedUser(null);
        }}
        onSubmit={selectedUser ? handleUpdateUser : handleAddUser}
        initialData={selectedUser}
      />

      <DeleteUserModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setSelectedUser(null);
        }}
        onConfirm={handleDeleteUser}
        user={selectedUser}
      />
    </div>
  );
}
