"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, AlertCircle, Building2, Users, Tag, Edit2, Trash2, X } from 'lucide-react';
import { containerVariants, itemVariants, smoothTransition } from '@/components/ui/motionVariants';
import PageHeader from '@/components/ui/PageHeader';

interface Department {
  id: string;
  departmentName: string;
  head: string;
  parentDept: string | null;
  status: 'Active' | 'Inactive';
}

interface Category {
  id: string;
  name: string;
  description: string;
  status: 'Active' | 'Inactive';
}

interface Employee {
  id: string;
  name: string;
  role: string;
  department: string | null;
  status: 'Active' | 'Inactive';
}

const initialDepartments: Department[] = [
  { id: "dept_1", departmentName: "Engineering", head: "Aditi Rao", parentDept: null, status: "Active" },
  { id: "dept_2", departmentName: "Facilities", head: "Rohan Mehta", parentDept: null, status: "Active" },
  { id: "dept_3", departmentName: "Field Ops (East)", head: "Sana Iqbal", parentDept: "Field Ops", status: "Inactive" }
];

const initialCategories: Category[] = [
  { id: "cat_1", name: "Laptops", description: "Company laptops and chargers", status: "Active" },
  { id: "cat_2", name: "Conference Rooms", description: "Meeting rooms and spaces", status: "Active" },
  { id: "cat_3", name: "AV Equipment", description: "Projectors and microphones", status: "Inactive" }
];

const initialEmployees: Employee[] = [
  { id: "emp_1", name: "Aditi Rao", role: "Head of Engineering", department: "Engineering", status: "Active" },
  { id: "emp_2", name: "Rohan Mehta", role: "Facilities Manager", department: "Facilities", status: "Active" },
  { id: "emp_3", name: "Sana Iqbal", role: "Field Technician", department: "Field Ops (East)", status: "Inactive" }
];

const tabs = [
  { id: 'departments', label: 'Departments', icon: Building2 },
  { id: 'categories', label: 'Categories', icon: Tag },
  { id: 'employees', label: 'Employees', icon: Users },
];

export default function OrganizationSetup() {
  const [activeTab, setActiveTab] = useState('departments');
  const [search, setSearch] = useState('');
  
  const [departmentsList, setDepartmentsList] = useState<Department[]>(initialDepartments);
  const [categoriesList, setCategoriesList] = useState<Category[]>(initialCategories);
  const [employeesList, setEmployeesList] = useState<Employee[]>(initialEmployees);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Generic form data state
  const [formData, setFormData] = useState<any>({});

  // Delete Confirmation States
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);

  const getFilteredData = () => {
    if (activeTab === 'departments') {
      return departmentsList.filter(d => d.departmentName.toLowerCase().includes(search.toLowerCase()));
    } else if (activeTab === 'categories') {
      return categoriesList.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
    } else {
      return employeesList.filter(e => e.name.toLowerCase().includes(search.toLowerCase()));
    }
  };

  const filteredData = getFilteredData();
  const uniqueDepts = Array.from(new Set(departmentsList.map(d => d.departmentName)));

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) || 'UN';
  };

  const openAddModal = () => {
    setModalMode('add');
    if (activeTab === 'departments') {
      setFormData({ departmentName: '', head: '', parentDept: 'None', status: 'Active' });
    } else if (activeTab === 'categories') {
      setFormData({ name: '', description: '', status: 'Active' });
    } else {
      setFormData({ name: '', role: '', department: 'None', status: 'Active' });
    }
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setModalMode('edit');
    setEditingId(item.id);
    if (activeTab === 'departments') {
      setFormData({ 
        departmentName: item.departmentName, 
        head: item.head, 
        parentDept: item.parentDept || 'None', 
        status: item.status 
      });
    } else if (activeTab === 'categories') {
      setFormData({ 
        name: item.name, 
        description: item.description, 
        status: item.status 
      });
    } else {
      setFormData({ 
        name: item.name, 
        role: item.role, 
        department: item.department || 'None', 
        status: item.status 
      });
    }
    setIsModalOpen(true);
  };

  const closeFormModal = () => setIsModalOpen(false);

  const handleSave = () => {
    if (activeTab === 'departments') {
      if (!formData.departmentName?.trim() || !formData.head?.trim()) return;
      if (modalMode === 'add') {
        setDepartmentsList([...departmentsList, {
          id: `dept_${Date.now()}`,
          departmentName: formData.departmentName,
          head: formData.head,
          parentDept: formData.parentDept === 'None' ? null : formData.parentDept,
          status: formData.status
        }]);
      } else {
        setDepartmentsList(departmentsList.map(d => d.id === editingId ? {
          ...d,
          departmentName: formData.departmentName,
          head: formData.head,
          parentDept: formData.parentDept === 'None' ? null : formData.parentDept,
          status: formData.status
        } : d));
      }
    } else if (activeTab === 'categories') {
      if (!formData.name?.trim()) return;
      if (modalMode === 'add') {
        setCategoriesList([...categoriesList, {
          id: `cat_${Date.now()}`,
          name: formData.name,
          description: formData.description,
          status: formData.status
        }]);
      } else {
        setCategoriesList(categoriesList.map(c => c.id === editingId ? {
          ...c,
          name: formData.name,
          description: formData.description,
          status: formData.status
        } : c));
      }
    } else {
      if (!formData.name?.trim() || !formData.role?.trim()) return;
      if (modalMode === 'add') {
        setEmployeesList([...employeesList, {
          id: `emp_${Date.now()}`,
          name: formData.name,
          role: formData.role,
          department: formData.department === 'None' ? null : formData.department,
          status: formData.status
        }]);
      } else {
        setEmployeesList(employeesList.map(e => e.id === editingId ? {
          ...e,
          name: formData.name,
          role: formData.role,
          department: formData.department === 'None' ? null : formData.department,
          status: formData.status
        } : e));
      }
    }
    closeFormModal();
  };

  const openDeleteModal = (item: any) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = () => {
    if (itemToDelete) {
      if (activeTab === 'departments') {
        setDepartmentsList(departmentsList.filter(d => d.id !== itemToDelete.id));
      } else if (activeTab === 'categories') {
        setCategoriesList(categoriesList.filter(c => c.id !== itemToDelete.id));
      } else {
        setEmployeesList(employeesList.filter(e => e.id !== itemToDelete.id));
      }
    }
    setIsDeleteModalOpen(false);
    setItemToDelete(null);
  };

  const getStatusBadge = (status: string) => (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold border ${status === 'Active'
      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30'
      : 'bg-slate-100 dark:bg-slate-900/40 text-slate-500 border-slate-200 dark:border-slate-700/40'
      }`}>
      <span className={`w-1.5 h-1.5 rounded-full ${status === 'Active' ? 'bg-emerald-500 dark:shadow-[0_0_6px_rgba(52,211,153,0.8)]' : 'bg-slate-400'}`} />
      {status}
    </span>
  );

  return (
    <div className="relative min-h-full">
      {/* Ambient glows */}
      <div className="fixed top-0 right-[10%] w-[400px] h-[400px] bg-cyan-400/5 dark:bg-cyan-900/10 rounded-full blur-[120px] pointer-events-none -z-10 transition-colors duration-700" />
      <div className="fixed bottom-0 left-[20%] w-[500px] h-[500px] bg-indigo-400/5 dark:bg-emerald-900/10 rounded-full blur-[120px] pointer-events-none -z-10 transition-colors duration-700" />

      <motion.div
        className="max-w-[1400px] mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <PageHeader title="Organization Setup" subtitle="Manage departments, categories, and employees.">
          <motion.button
            onClick={openAddModal}
            whileHover={{ y: -2, transition: smoothTransition }}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-2xl text-sm font-bold text-white dark:text-[#010810] shadow-[0_0_16px_rgba(6,182,212,0.3)] dark:shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center gap-2 hover:shadow-[0_0_24px_rgba(16,185,129,0.4)] transition-all duration-300 capitalize"
          >
            <Plus className="h-4 w-4" />
            Add {activeTab.slice(0, -1)}
          </motion.button>
        </PageHeader>

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
                    onClick={() => { setActiveTab(tab.id); setSearch(''); }}
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
                placeholder={`Search ${activeTab}...`}
                className="w-full pl-9 pr-4 py-2 text-sm bg-white dark:bg-[#051324]/80 border border-slate-200 dark:border-cyan-900/40 rounded-full text-slate-700 dark:text-cyan-100/80 placeholder:text-slate-400 dark:placeholder:text-cyan-100/30 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 transition-all"
              />
            </div>
            <span className="text-xs text-slate-500 dark:text-cyan-400/60 font-mono px-3 py-1.5 bg-slate-100 dark:bg-cyan-950/40 border border-slate-200 dark:border-cyan-900/50 rounded-xl tracking-widest">
              {filteredData.length} results
            </span>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-[10px] text-slate-400 dark:text-cyan-400/60 font-mono uppercase tracking-[0.15em] bg-slate-50/80 dark:bg-[#030D1A]/40 border-b border-slate-100 dark:border-cyan-900/20">
                <tr>
                  {activeTab === 'departments' && (
                    <>
                      <th className="px-6 py-4 font-semibold">Department</th>
                      <th className="px-6 py-4 font-semibold">Head</th>
                      <th className="px-6 py-4 font-semibold">Parent Dept</th>
                    </>
                  )}
                  {activeTab === 'categories' && (
                    <>
                      <th className="px-6 py-4 font-semibold">Category</th>
                      <th className="px-6 py-4 font-semibold">Description</th>
                    </>
                  )}
                  {activeTab === 'employees' && (
                    <>
                      <th className="px-6 py-4 font-semibold">Employee</th>
                      <th className="px-6 py-4 font-semibold">Role</th>
                      <th className="px-6 py-4 font-semibold">Department</th>
                    </>
                  )}
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-cyan-900/20">
                {filteredData.map((item: any, i: number) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.25 }}
                    className="hover:bg-slate-50 dark:hover:bg-cyan-900/10 transition-colors group"
                  >
                    {activeTab === 'departments' && (
                      <>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-cyan-950/40 border border-slate-200 dark:border-cyan-900/40 flex items-center justify-center">
                              <Building2 className="h-4 w-4 text-slate-400 dark:text-cyan-400/60" />
                            </div>
                            <span className="font-semibold text-slate-800 dark:text-slate-200 capitalize">{item.departmentName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold border bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-500/30">
                              {getInitials(item.head)}
                            </div>
                            <span className="text-slate-600 dark:text-cyan-100/70 font-medium capitalize">{item.head}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-400 dark:text-cyan-100/40 font-mono text-xs capitalize">
                          {item.parentDept || '—'}
                        </td>
                      </>
                    )}
                    
                    {activeTab === 'categories' && (
                      <>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-cyan-950/40 border border-slate-200 dark:border-cyan-900/40 flex items-center justify-center">
                              <Tag className="h-4 w-4 text-slate-400 dark:text-cyan-400/60" />
                            </div>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">{item.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-500 dark:text-cyan-100/60 text-sm">
                          {item.description}
                        </td>
                      </>
                    )}

                    {activeTab === 'employees' && (
                      <>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold border bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30">
                              {getInitials(item.name)}
                            </div>
                            <span className="font-semibold text-slate-800 dark:text-slate-200 capitalize">{item.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-600 dark:text-cyan-100/70 font-medium capitalize">
                          {item.role}
                        </td>
                        <td className="px-6 py-4 text-slate-400 dark:text-cyan-100/40 font-mono text-xs capitalize">
                          {item.department || '—'}
                        </td>
                      </>
                    )}

                    <td className="px-6 py-4">
                      {getStatusBadge(item.status)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => openEditModal(item)}
                          className="text-slate-400 hover:text-cyan-600 dark:text-cyan-100/40 dark:hover:text-cyan-300 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-cyan-900/30 transition-colors"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => openDeleteModal(item)}
                          className="text-slate-400 hover:text-red-600 dark:text-cyan-100/40 dark:hover:text-red-400 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
                {filteredData.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center text-slate-400 dark:text-cyan-100/30 text-sm font-mono">
                      No records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>

      {/* CRUD MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm"
              onClick={closeFormModal}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-[#0A1E3F] border border-slate-200 dark:border-cyan-900/50 rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-cyan-900/30">
                <h2 className="text-xl font-serif font-medium text-slate-900 dark:text-white capitalize">
                  {modalMode === 'add' ? `Add New ${activeTab.slice(0, -1)}` : `Edit ${activeTab.slice(0, -1)}`}
                </h2>
                <button onClick={closeFormModal} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-6 space-y-5">
                
                {activeTab === 'departments' && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-cyan-100/80 mb-2">Department Name *</label>
                      <input 
                        type="text" 
                        value={formData.departmentName || ''}
                        onChange={(e) => setFormData({...formData, departmentName: e.target.value})}
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#030b14] border border-slate-200 dark:border-cyan-900/40 rounded-xl text-slate-800 dark:text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-cyan-100/80 mb-2">Department Head *</label>
                      <input 
                        type="text" 
                        value={formData.head || ''}
                        onChange={(e) => setFormData({...formData, head: e.target.value})}
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#030b14] border border-slate-200 dark:border-cyan-900/40 rounded-xl text-slate-800 dark:text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-cyan-100/80 mb-2">Parent Department</label>
                      <select 
                        value={formData.parentDept || 'None'}
                        onChange={(e) => setFormData({...formData, parentDept: e.target.value})}
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#030b14] border border-slate-200 dark:border-cyan-900/40 rounded-xl text-slate-800 dark:text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 appearance-none"
                      >
                        <option value="None">None</option>
                        {uniqueDepts.map(d => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                  </>
                )}

                {activeTab === 'categories' && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-cyan-100/80 mb-2">Category Name *</label>
                      <input 
                        type="text" 
                        value={formData.name || ''}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#030b14] border border-slate-200 dark:border-cyan-900/40 rounded-xl text-slate-800 dark:text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-cyan-100/80 mb-2">Description</label>
                      <textarea 
                        value={formData.description || ''}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#030b14] border border-slate-200 dark:border-cyan-900/40 rounded-xl text-slate-800 dark:text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                      />
                    </div>
                  </>
                )}

                {activeTab === 'employees' && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-cyan-100/80 mb-2">Employee Name *</label>
                      <input 
                        type="text" 
                        value={formData.name || ''}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#030b14] border border-slate-200 dark:border-cyan-900/40 rounded-xl text-slate-800 dark:text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-cyan-100/80 mb-2">Role *</label>
                      <input 
                        type="text" 
                        value={formData.role || ''}
                        onChange={(e) => setFormData({...formData, role: e.target.value})}
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#030b14] border border-slate-200 dark:border-cyan-900/40 rounded-xl text-slate-800 dark:text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-cyan-100/80 mb-2">Department</label>
                      <select 
                        value={formData.department || 'None'}
                        onChange={(e) => setFormData({...formData, department: e.target.value})}
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#030b14] border border-slate-200 dark:border-cyan-900/40 rounded-xl text-slate-800 dark:text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 appearance-none"
                      >
                        <option value="None">None</option>
                        {uniqueDepts.map(d => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-cyan-100/80 mb-2">Status</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="status" 
                        checked={formData.status === 'Active'}
                        onChange={() => setFormData({...formData, status: 'Active'})}
                        className="text-cyan-500 focus:ring-cyan-500"
                      />
                      <span className="text-sm text-slate-700 dark:text-cyan-100/80">Active</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="status" 
                        checked={formData.status === 'Inactive'}
                        onChange={() => setFormData({...formData, status: 'Inactive'})}
                        className="text-cyan-500 focus:ring-cyan-500"
                      />
                      <span className="text-sm text-slate-700 dark:text-cyan-100/80">Inactive</span>
                    </label>
                  </div>
                </div>

              </div>
              <div className="p-6 border-t border-slate-100 dark:border-cyan-900/30 flex justify-end gap-3 bg-slate-50/50 dark:bg-cyan-950/10">
                <button 
                  onClick={closeFormModal}
                  className="px-5 py-2.5 text-sm font-semibold text-slate-600 dark:text-cyan-100/70 hover:bg-slate-100 dark:hover:bg-cyan-900/40 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  className="px-5 py-2.5 text-sm font-bold text-white bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-500 dark:hover:bg-cyan-400 rounded-xl shadow-sm transition-colors"
                >
                  {modalMode === 'add' ? 'Save' : 'Save Changes'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {isDeleteModalOpen && itemToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm"
              onClick={() => setIsDeleteModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-white dark:bg-[#0A1E3F] border border-slate-200 dark:border-red-900/30 rounded-3xl shadow-2xl overflow-hidden p-6 text-center"
            >
              <div className="mx-auto w-12 h-12 bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-center rounded-full mb-4">
                <Trash2 className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-serif font-medium text-slate-900 dark:text-white mb-2">
                Delete {activeTab.slice(0, -1)}?
              </h2>
              <p className="text-slate-500 dark:text-cyan-100/60 mb-6 text-sm leading-relaxed">
                Are you sure you want to delete <span className="font-bold text-slate-800 dark:text-white capitalize">
                  {activeTab === 'departments' ? itemToDelete.departmentName : itemToDelete.name}
                </span>? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-center">
                <button 
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-5 py-2.5 flex-1 text-sm font-semibold text-slate-600 dark:text-cyan-100/70 hover:bg-slate-100 dark:hover:bg-cyan-900/40 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDelete}
                  className="px-5 py-2.5 flex-1 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-sm transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
