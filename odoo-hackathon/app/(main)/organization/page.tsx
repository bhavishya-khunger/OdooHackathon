"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Building2, Users, Tag, Edit2, Trash2, X } from 'lucide-react';

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
  customFields?: string;
  status: 'Active' | 'Inactive';
}

interface Employee {
  id: string;
  name: string;
  email: string;
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
  { id: "cat_1", name: "Electronics", description: "Company laptops and chargers", customFields: "Warranty Period, OS", status: "Active" },
  { id: "cat_2", name: "Furniture", description: "Meeting rooms and spaces", customFields: "Material, Dimensions", status: "Active" },
  { id: "cat_3", name: "Vehicles", description: "Company vehicles", customFields: "Mileage, License Plate", status: "Inactive" }
];

const initialEmployees: Employee[] = [
  { id: "emp_1", name: "Aditi Rao", email: "aditi@company.com", role: "Department Head", department: "Engineering", status: "Active" },
  { id: "emp_2", name: "Rohan Mehta", email: "rohan@company.com", role: "Asset Manager", department: "Facilities", status: "Active" },
  { id: "emp_3", name: "Sana Iqbal", email: "sana@company.com", role: "Employee", department: "Field Ops (East)", status: "Inactive" }
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

  const [formData, setFormData] = useState<any>({});

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
      setFormData({ name: '', description: '', customFields: '', status: 'Active' });
    } else {
      setFormData({ name: '', email: '', role: 'Employee', department: 'None', status: 'Active' });
    }
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setModalMode('edit');
    setEditingId(item.id);
    if (activeTab === 'departments') {
      setFormData({ departmentName: item.departmentName, head: item.head, parentDept: item.parentDept || 'None', status: item.status });
    } else if (activeTab === 'categories') {
      setFormData({ name: item.name, description: item.description, customFields: item.customFields || '', status: item.status });
    } else {
      setFormData({ name: item.name, email: item.email || '', role: item.role, department: item.department || 'None', status: item.status });
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
        setDepartmentsList(departmentsList.map(d => d.id === editingId ? { ...d, departmentName: formData.departmentName, head: formData.head, parentDept: formData.parentDept === 'None' ? null : formData.parentDept, status: formData.status } : d));
      }
    } else if (activeTab === 'categories') {
      if (!formData.name?.trim()) return;
      if (modalMode === 'add') {
        setCategoriesList([...categoriesList, { id: `cat_${Date.now()}`, name: formData.name, description: formData.description, customFields: formData.customFields, status: formData.status }]);
      } else {
        setCategoriesList(categoriesList.map(c => c.id === editingId ? { ...c, name: formData.name, description: formData.description, customFields: formData.customFields, status: formData.status } : c));
      }
    } else {
      if (!formData.name?.trim() || !formData.email?.trim() || !formData.role?.trim()) return;
      if (modalMode === 'add') {
        setEmployeesList([...employeesList, { id: `emp_${Date.now()}`, name: formData.name, email: formData.email, role: formData.role, department: formData.department === 'None' ? null : formData.department, status: formData.status }]);
      } else {
        setEmployeesList(employeesList.map(e => e.id === editingId ? { ...e, name: formData.name, email: formData.email, role: formData.role, department: formData.department === 'None' ? null : formData.department, status: formData.status } : e));
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
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border ${status === 'Active'
      ? 'bg-bg-surface text-text-primary border-border-strong'
      : 'bg-bg-surface text-text-muted border-border-base'
      }`}>
      <span className={`w-1.5 h-1.5 rounded-full ${status === 'Active' ? 'bg-text-primary' : 'bg-border-focus'}`} />
      {status}
    </span>
  );

  return (
    <div className="min-h-full bg-bg-base text-text-primary p-10 flex flex-col font-sans transition-colors duration-300 animate-in fade-in duration-500">

      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-[28px] font-semibold tracking-tight">Organization Setup</h1>
          <p className="text-[14px] text-text-secondary mt-1">Manage departments, categories, and employees.</p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-5 py-2.5 bg-bg-inverted hover:opacity-90 border border-transparent rounded-full text-[13px] font-medium text-text-inverted transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add {activeTab.slice(0, -1)}
        </button>
      </div>

      <div className="bg-bg-surface border border-border-base rounded-3xl overflow-hidden transition-colors duration-300">

        {/* Tabs & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border-b border-border-base">

          {/* Custom Pill Tabs */}
          <div className="flex items-center bg-bg-surface-alt border border-border-base rounded-full p-1 text-[13px] font-medium text-text-secondary">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setSearch(''); }}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-full transition-colors ${isActive ? 'bg-bg-surface-hover text-text-primary' : 'hover:text-text-primary'
                    }`}
                >
                  <Icon className="h-[14px] w-[14px]" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search ${activeTab}...`}
              className="pl-10 pr-4 py-2 w-64 md:w-72 bg-bg-surface-alt border border-border-base rounded-full text-[13px] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-border-focus transition-colors"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-[13px] text-left">
            <thead className="text-[11px] text-text-muted uppercase tracking-wider border-b border-border-base bg-bg-surface-alt">
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
                    <th className="px-6 py-4 font-semibold">Custom Fields</th>
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
            <tbody className="divide-y divide-border-base">
              {filteredData.map((item: any, i: number) => (
                <tr
                  key={item.id}
                  className="hover:bg-bg-surface-hover transition-colors group"
                >
                  {activeTab === 'departments' && (
                    <>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-bg-surface-hover flex items-center justify-center shrink-0">
                            <Building2 className="h-4 w-4 text-text-secondary" />
                          </div>
                          <span className="font-semibold text-text-primary capitalize">{item.departmentName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-bold bg-border-strong text-text-primary shrink-0">
                            {getInitials(item.head)}
                          </div>
                          <span className="text-text-secondary font-medium capitalize">{item.head}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-text-muted capitalize">
                        {item.parentDept || '—'}
                      </td>
                    </>
                  )}

                  {activeTab === 'categories' && (
                    <>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-bg-surface-hover flex items-center justify-center shrink-0">
                            <Tag className="h-4 w-4 text-text-secondary" />
                          </div>
                          <span className="font-semibold text-text-primary">{item.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-text-secondary">
                        {item.description}
                      </td>
                      <td className="px-6 py-4 text-text-secondary text-[12px]">
                        {item.customFields || '—'}
                      </td>
                    </>
                  )}

                  {activeTab === 'employees' && (
                    <>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-bold bg-border-strong text-text-primary shrink-0">
                            {getInitials(item.name)}
                          </div>
                          <div>
                            <span className="font-semibold text-text-primary capitalize block">{item.name}</span>
                            <span className="text-[12px] text-text-muted">{item.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-text-secondary font-medium capitalize">
                        {item.role}
                      </td>
                      <td className="px-6 py-4 text-text-muted capitalize">
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
                        className="text-text-secondary hover:text-text-primary p-1.5 rounded-lg hover:bg-bg-surface-hover transition-colors"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(item)}
                        className="text-text-secondary hover:text-danger-base p-1.5 rounded-lg hover:bg-bg-surface-hover transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-text-muted text-sm">
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CRUD MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={closeFormModal}
          />
          <div
            className="relative w-full max-w-lg bg-bg-surface border border-border-base rounded-2xl shadow-2xl overflow-hidden text-text-primary animate-in zoom-in-95 duration-200"
          >
            <div className="flex items-center justify-between p-6 border-b border-border-base">
              <h2 className="text-lg font-semibold tracking-tight capitalize">
                {modalMode === 'add' ? `Add New ${activeTab.slice(0, -1)}` : `Edit ${activeTab.slice(0, -1)}`}
              </h2>
              <button onClick={closeFormModal} className="text-text-secondary hover:text-text-primary transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              {activeTab === 'departments' && (
                <>
                  <div>
                    <label className="block text-[13px] font-medium text-text-secondary mb-2">Department Name *</label>
                    <input
                      type="text"
                      value={formData.departmentName || ''}
                      onChange={(e) => setFormData({ ...formData, departmentName: e.target.value })}
                      className="w-full px-4 py-2.5 bg-bg-base border border-border-strong rounded-xl text-[13px] focus:outline-none focus:border-border-focus transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-text-secondary mb-2">Department Head *</label>
                    <input
                      type="text"
                      value={formData.head || ''}
                      onChange={(e) => setFormData({ ...formData, head: e.target.value })}
                      className="w-full px-4 py-2.5 bg-bg-base border border-border-strong rounded-xl text-[13px] focus:outline-none focus:border-border-focus transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-text-secondary mb-2">Parent Department</label>
                    <select
                      value={formData.parentDept || 'None'}
                      onChange={(e) => setFormData({ ...formData, parentDept: e.target.value })}
                      className="w-full px-4 py-2.5 bg-bg-base border border-border-strong rounded-xl text-[13px] focus:outline-none focus:border-border-focus transition-colors appearance-none cursor-pointer"
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
                    <label className="block text-[13px] font-medium text-text-secondary mb-2">Category Name *</label>
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 bg-bg-base border border-border-strong rounded-xl text-[13px] focus:outline-none focus:border-border-focus transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-text-secondary mb-2">Description</label>
                    <textarea
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-2.5 bg-bg-base border border-border-strong rounded-xl text-[13px] focus:outline-none focus:border-border-focus transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-text-secondary mb-2">Custom Fields (Optional)</label>
                    <input
                      type="text"
                      value={formData.customFields || ''}
                      onChange={(e) => setFormData({ ...formData, customFields: e.target.value })}
                      className="w-full px-4 py-2.5 bg-bg-base border border-border-strong rounded-xl text-[13px] focus:outline-none focus:border-border-focus transition-colors"
                      placeholder="e.g. Warranty Period, Model"
                    />
                  </div>
                </>
              )}

              {activeTab === 'employees' && (
                <>
                  <div>
                    <label className="block text-[13px] font-medium text-text-secondary mb-2">Employee Name *</label>
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 bg-bg-base border border-border-strong rounded-xl text-[13px] focus:outline-none focus:border-border-focus transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-text-secondary mb-2">Email *</label>
                    <input
                      type="email"
                      value={formData.email || ''}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 bg-bg-base border border-border-strong rounded-xl text-[13px] focus:outline-none focus:border-border-focus transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-text-secondary mb-2">Role *</label>
                    <select
                      value={formData.role || 'Employee'}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full px-4 py-2.5 bg-bg-base border border-border-strong rounded-xl text-[13px] focus:outline-none focus:border-border-focus transition-colors appearance-none cursor-pointer"
                    >
                      <option value="Employee">Employee</option>
                      <option value="Department Head">Department Head</option>
                      <option value="Asset Manager">Asset Manager</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-text-secondary mb-2">Department</label>
                    <select
                      value={formData.department || 'None'}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full px-4 py-2.5 bg-bg-base border border-border-strong rounded-xl text-[13px] focus:outline-none focus:border-border-focus transition-colors appearance-none cursor-pointer"
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
                <label className="block text-[13px] font-medium text-text-secondary mb-2">Status</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={formData.status === 'Active'}
                      onChange={() => setFormData({ ...formData, status: 'Active' })}
                      className="accent-text-primary"
                    />
                    <span className="text-[13px] text-text-primary">Active</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={formData.status === 'Inactive'}
                      onChange={() => setFormData({ ...formData, status: 'Inactive' })}
                      className="accent-text-primary"
                    />
                    <span className="text-[13px] text-text-primary">Inactive</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-border-base flex justify-end gap-3 bg-bg-surface-alt">
              <button
                onClick={closeFormModal}
                className="px-5 py-2 text-[13px] font-medium text-text-secondary hover:text-text-primary transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2 text-[13px] font-medium text-text-inverted bg-bg-inverted hover:opacity-90 rounded-full transition-colors"
              >
                {modalMode === 'add' ? 'Save' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* DELETE CONFIRMATION MODAL */}
      {isDeleteModalOpen && itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setIsDeleteModalOpen(false)}
          />
          <div
            className="relative w-full max-w-sm bg-bg-surface border border-border-base rounded-2xl shadow-2xl overflow-hidden p-6 text-center animate-in zoom-in-95 duration-200"
          >
            <div className="mx-auto w-12 h-12 bg-red-100 dark:bg-[#2a1215] text-danger-base flex items-center justify-center rounded-full mb-4">
              <Trash2 className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-semibold text-text-primary mb-2">
              Delete {activeTab.slice(0, -1)}?
            </h2>
            <p className="text-text-secondary mb-6 text-[13px]">
              Are you sure you want to delete <span className="font-bold text-text-primary capitalize">
                {activeTab === 'departments' ? itemToDelete.departmentName : itemToDelete.name}
              </span>? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-5 py-2 flex-1 text-[13px] font-medium text-text-secondary hover:text-text-primary bg-bg-surface-hover hover:bg-border-strong rounded-full transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-5 py-2 flex-1 text-[13px] font-medium text-white bg-danger-base hover:bg-danger-hover rounded-full transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
