"use client";

import { useState, useEffect } from 'react';
import { Plus, Search, AlertCircle, Building2, Users, Tag, Edit2, Trash2, X, XCircle } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/components/providers/AuthProvider';

interface Department {
  id: number;
  name: string;
  head_id: number | null;
  parent_department_id: number | null;
  status: string;
}

interface Employee {
  id: number;
  name: string;
  email: string;
  role: string;
  department_id: number | null;
  department_name: string | null;
  status: string;
}

interface CategoryFieldDefinition {
  name: string;
  type: string;
  required: boolean;
  label?: string;
}

interface Category {
  id: number;
  name: string;
  fields: CategoryFieldDefinition[];
}

const tabs = [
  { id: 'departments', label: 'Departments', icon: Building2 },
  { id: 'categories', label: 'Categories', icon: Tag },
  { id: 'employees', label: 'Employees', icon: Users },
];

export default function OrganizationSetup() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('departments');
  const [search, setSearch] = useState('');

  const [departmentsList, setDepartmentsList] = useState<Department[]>([]);
  const [employeesList, setEmployeesList] = useState<Employee[]>([]);
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal States for Departments
  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
  const [deptModalMode, setDeptModalMode] = useState<'add' | 'edit'>('add');
  const [editingDeptId, setEditingDeptId] = useState<number | null>(null);
  const [deptFormData, setDeptFormData] = useState<{
    name: string;
    head_id: number | string;
    parent_department_id: number | string;
  }>({ name: '', head_id: 'None', parent_department_id: 'None' });
  const [isDeleteDeptOpen, setIsDeleteDeptOpen] = useState(false);
  const [deptToDelete, setDeptToDelete] = useState<Department | null>(null);

  // Modal States for Categories
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [catModalMode, setCatModalMode] = useState<'add' | 'edit'>('add');
  const [editingCatId, setEditingCatId] = useState<number | null>(null);
  const [catFormData, setCatFormData] = useState<{
    name: string;
    fields: CategoryFieldDefinition[];
  }>({ name: '', fields: [] });
  const [isDeleteCatOpen, setIsDeleteCatOpen] = useState(false);
  const [catToDelete, setCatToDelete] = useState<Category | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [depts, emps, cats] = await Promise.all([
        apiFetch<Department[]>('/departments', { method: 'GET' }),
        apiFetch<Employee[]>('/employees', { method: 'GET' }),
        apiFetch<Category[]>('/categories', { method: 'GET' })
      ]);
      setDepartmentsList(depts);
      setEmployeesList(emps);
      setCategoriesList(cats);
    } catch (error) {
      console.error("Error fetching org data", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredDepts = departmentsList.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );
  
  const filteredEmps = employeesList.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase()) || e.email.toLowerCase().includes(search.toLowerCase())
  );

  const filteredCats = categoriesList.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) || 'UN';
  };

  const getEmployeeName = (id: number | null) => {
    if (!id) return '—';
    const emp = employeesList.find(e => e.id === id);
    return emp ? emp.name : 'Unknown';
  };

  const getDeptName = (id: number | null) => {
    if (!id) return '—';
    const dept = departmentsList.find(d => d.id === id);
    return dept ? dept.name : 'Unknown';
  };

  // --- Department Handlers ---
  const openAddDept = () => {
    setDeptModalMode('add');
    setDeptFormData({ name: '', head_id: 'None', parent_department_id: 'None' });
    setIsDeptModalOpen(true);
  };

  const openEditDept = (dept: Department) => {
    setDeptModalMode('edit');
    setEditingDeptId(dept.id);
    setDeptFormData({
      name: dept.name,
      head_id: dept.head_id || 'None',
      parent_department_id: dept.parent_department_id || 'None',
    });
    setIsDeptModalOpen(true);
  };

  const saveDept = async () => {
    if (!deptFormData.name.trim()) return;
    const payload = {
      name: deptFormData.name,
      head_id: deptFormData.head_id === 'None' ? null : Number(deptFormData.head_id),
      parent_department_id: deptFormData.parent_department_id === 'None' ? null : Number(deptFormData.parent_department_id)
    };
    try {
      if (deptModalMode === 'add') {
        await apiFetch('/departments', { method: 'POST', body: JSON.stringify(payload) });
      } else if (editingDeptId) {
        await apiFetch(`/departments/${editingDeptId}`, { method: 'PATCH', body: JSON.stringify(payload) });
      }
      setIsDeptModalOpen(false);
      fetchData();
    } catch (error: any) {
      alert(`Failed to save department: ${error.message || 'Unknown error'}`);
    }
  };

  const deleteDept = async () => {
    if (deptToDelete) {
      try {
        await apiFetch(`/departments/${deptToDelete.id}/deactivate`, { method: 'PATCH' });
        fetchData();
      } catch (error) {
        alert("Failed to deactivate department. You must be an admin.");
      }
    }
    setIsDeleteDeptOpen(false);
    setDeptToDelete(null);
  };

  // --- Category Handlers ---
  const openAddCat = () => {
    setCatModalMode('add');
    setCatFormData({ name: '', fields: [] });
    setIsCatModalOpen(true);
  };

  const openEditCat = (cat: Category) => {
    setCatModalMode('edit');
    setEditingCatId(cat.id);
    setCatFormData({
      name: cat.name,
      fields: [...cat.fields],
    });
    setIsCatModalOpen(true);
  };

  const saveCat = async () => {
    if (!catFormData.name.trim()) return;
    const payload = {
      name: catFormData.name,
      fields: catFormData.fields
    };
    try {
      if (catModalMode === 'add') {
        await apiFetch('/categories', { method: 'POST', body: JSON.stringify(payload) });
      } else if (editingCatId) {
        await apiFetch(`/categories/${editingCatId}`, { method: 'PATCH', body: JSON.stringify(payload) });
      }
      setIsCatModalOpen(false);
      fetchData();
    } catch (error: any) {
      alert(`Failed to save category: ${error.message || 'Unknown error'}`);
    }
  };

  const deleteCat = async () => {
    if (catToDelete) {
      try {
        await apiFetch(`/categories/${catToDelete.id}`, { method: 'DELETE' });
        fetchData();
      } catch (error) {
        alert("Failed to delete category.");
      }
    }
    setIsDeleteCatOpen(false);
    setCatToDelete(null);
  };

  // --- Employee Handlers ---
  const handlePromote = async (empId: number, role: 'dept_head' | 'asset_manager') => {
    try {
        await apiFetch(`/employees/${empId}/promote`, { method: 'POST', body: JSON.stringify({ role }) });
        fetchData();
    } catch(err) {
        alert("Failed to promote user. You must be an admin.");
    }
  };
  
  const handleDemote = async (empId: number) => {
    try {
        await apiFetch(`/employees/${empId}/demote`, { method: 'POST' });
        fetchData();
    } catch(err) {
        alert("Failed to demote user. You must be an admin.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <PageHeader title="Organization Setup" subtitle="Manage departments, categories, and employees.">
        {activeTab === 'departments' && user?.role === 'admin' && (
          <button
            onClick={openAddDept}
            className="px-6 py-3 bg-btn-bg hover:bg-btn-hover text-btn-text rounded-2xl text-sm font-bold shadow-sm flex items-center gap-2 transition-all duration-300"
          >
            <Plus className="h-4 w-4" />
            Add Department
          </button>
        )}
        {activeTab === 'categories' && (user?.role === 'admin' || user?.role === 'asset_manager') && (
          <button
            onClick={openAddCat}
            className="px-6 py-3 bg-btn-bg hover:bg-btn-hover text-btn-text rounded-2xl text-sm font-bold shadow-sm flex items-center gap-2 transition-all duration-300"
          >
            <Plus className="h-4 w-4" />
            Add Category
          </button>
        )}
      </PageHeader>

      {/* Main card */}
      <div className="bg-surface border border-border rounded-xl shadow-sm overflow-hidden relative transition-colors duration-300">
        
        {/* Tabs */}
        <div className="border-b border-border px-6">
          <div className="flex gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setSearch(''); }}
                  className={`flex items-center gap-2 py-4 px-5 text-sm font-semibold border-b-2 transition-all -mb-px ${activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted hover:text-foreground hover:border-border'
                    }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Search */}
        <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-background/50 border-b border-border">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search ${activeTab}...`}
              className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-surface text-foreground"
            />
          </div>
        </div>

        {/* Table Area */}
        <div className="overflow-x-auto">
          {isLoading ? (
             <div className="p-10 text-center text-muted">Loading data...</div>
          ) : activeTab === 'departments' ? (
            <table className="w-full text-sm text-left">
              <thead className="text-[10px] text-muted uppercase tracking-[0.15em] bg-background/80 border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-semibold">Department</th>
                  <th className="px-6 py-4 font-semibold">Head</th>
                  <th className="px-6 py-4 font-semibold">Parent Dept</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  {user?.role === 'admin' && <th className="px-6 py-4 font-semibold text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredDepts.map((dept) => (
                  <tr key={dept.id} className="hover:bg-surface-hover transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-background border border-border flex items-center justify-center">
                          <Building2 className="h-4 w-4 text-muted" />
                        </div>
                        <span className="font-semibold text-foreground capitalize">{dept.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold bg-primary-tint text-primary">
                          {getInitials(getEmployeeName(dept.head_id))}
                        </div>
                        <span className="text-muted font-medium capitalize">{getEmployeeName(dept.head_id)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted text-xs capitalize">
                      {getDeptName(dept.parent_department_id)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold border ${dept.status === 'active'
                        ? 'bg-[var(--status-available-tint)] text-[var(--status-available-ic)] border-emerald-500/30'
                        : 'bg-background text-muted border-border'
                        }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${dept.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                        {dept.status}
                      </span>
                    </td>
                    {user?.role === 'admin' && (
                        <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => openEditDept(dept)} className="text-muted hover:text-foreground p-1.5 rounded-lg hover:bg-surface-hover transition-colors">
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button onClick={() => { setDeptToDelete(dept); setIsDeleteDeptOpen(true); }} className="text-muted hover:text-rose-500 p-1.5 rounded-lg hover:bg-rose-500/10 transition-colors">
                              <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                        </td>
                    )}
                  </tr>
                ))}
                {filteredDepts.length === 0 && (
                  <tr>
                    <td colSpan={user?.role === 'admin' ? 5 : 4} className="px-6 py-16 text-center text-muted text-sm font-mono">
                      No departments found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : activeTab === 'categories' ? (
            <table className="w-full text-sm text-left">
              <thead className="text-[10px] text-muted uppercase tracking-[0.15em] bg-background/80 border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-semibold">Category Name</th>
                  <th className="px-6 py-4 font-semibold">Custom Fields</th>
                  <th className="px-6 py-4 font-semibold">Total Assets</th>
                  {(user?.role === 'admin' || user?.role === 'asset_manager') && <th className="px-6 py-4 font-semibold text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredCats.map((cat) => (
                  <tr key={cat.id} className="hover:bg-surface-hover transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-background border border-border flex items-center justify-center">
                          <Tag className="h-4 w-4 text-muted" />
                        </div>
                        <span className="font-semibold text-foreground capitalize">{cat.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted">
                      {cat.fields.length} field(s) configured
                    </td>
                    <td className="px-6 py-4 text-muted">
                      {/* Asset count could be fetched from backend eventually, using '-' for now */}
                      —
                    </td>
                    {(user?.role === 'admin' || user?.role === 'asset_manager') && (
                        <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => openEditCat(cat)} className="text-muted hover:text-foreground p-1.5 rounded-lg hover:bg-surface-hover transition-colors">
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button onClick={() => { setCatToDelete(cat); setIsDeleteCatOpen(true); }} className="text-muted hover:text-rose-500 p-1.5 rounded-lg hover:bg-rose-500/10 transition-colors">
                              <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                        </td>
                    )}
                  </tr>
                ))}
                {filteredCats.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-16 text-center text-muted text-sm font-mono">
                      No categories found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : activeTab === 'employees' ? (
            <table className="w-full text-sm text-left">
              <thead className="text-[10px] text-muted uppercase tracking-[0.15em] bg-background/80 border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-semibold">Employee</th>
                  <th className="px-6 py-4 font-semibold">Role</th>
                  <th className="px-6 py-4 font-semibold">Department</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  {user?.role === 'admin' && <th className="px-6 py-4 font-semibold text-right">Admin Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredEmps.map((emp) => (
                  <tr key={emp.id} className="hover:bg-surface-hover transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold bg-primary-tint text-primary border border-primary/20">
                          {getInitials(emp.name)}
                        </div>
                        <div>
                          <div className="font-semibold text-foreground capitalize">{emp.name}</div>
                          <div className="text-xs text-muted">{emp.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs bg-surface-hover px-2 py-1 rounded-md text-foreground border border-border">
                          {emp.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted text-xs capitalize">
                      {emp.department_name || '—'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold border ${emp.status === 'active'
                        ? 'bg-[var(--status-available-tint)] text-[var(--status-available-ic)] border-emerald-500/30'
                        : 'bg-background text-muted border-border'
                        }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${emp.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                        {emp.status}
                      </span>
                    </td>
                    {user?.role === 'admin' && (
                        <td className="px-6 py-4 text-right">
                            {emp.role !== 'admin' && (
                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {emp.role !== 'asset_manager' && (
                                        <button onClick={() => handlePromote(emp.id, 'asset_manager')} className="text-xs font-semibold text-primary hover:bg-primary/10 px-2 py-1 rounded-md transition-colors">
                                            Promote to Asset Mgr
                                        </button>
                                    )}
                                    {emp.role !== 'dept_head' && (
                                        <button onClick={() => handlePromote(emp.id, 'dept_head')} className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/10 px-2 py-1 rounded-md transition-colors">
                                            Promote to Dept Head
                                        </button>
                                    )}
                                    {emp.role !== 'employee' && (
                                        <button onClick={() => handleDemote(emp.id)} className="text-xs font-semibold text-rose-500 hover:bg-rose-500/10 px-2 py-1 rounded-md transition-colors">
                                            Demote
                                        </button>
                                    )}
                                </div>
                            )}
                        </td>
                    )}
                  </tr>
                ))}
                {filteredEmps.length === 0 && (
                  <tr>
                    <td colSpan={user?.role === 'admin' ? 5 : 4} className="px-6 py-16 text-center text-muted text-sm font-mono">
                      No employees found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : null}
        </div>
      </div>

      {/* Info banner */}
      <div className="flex items-center gap-4 bg-primary/5 border border-primary/20 p-5 rounded-2xl text-sm text-muted transition-colors duration-300">
        <div className="w-9 h-9 rounded-xl bg-background border border-border flex items-center justify-center shrink-0">
          <AlertCircle className="h-4 w-4 text-primary" />
        </div>
        <p>
          Managing departments and categories here directly controls the picklists available when registering assets in the Asset workflow.
        </p>
      </div>

      {/* DEPARTMENT FORM MODAL */}
      {isDeptModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setIsDeptModalOpen(false)} />
          <div className="relative w-full max-w-lg bg-surface border border-border rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-medium text-foreground">{deptModalMode === 'add' ? 'Add New Department' : 'Edit Department'}</h2>
              <button onClick={() => setIsDeptModalOpen(false)} className="text-muted hover:text-foreground transition-colors"><X className="h-5 w-5" /></button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Department Name *</label>
                <input type="text" value={deptFormData.name} onChange={(e) => setDeptFormData({ ...deptFormData, name: e.target.value })} placeholder="e.g. Marketing" className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Department Head</label>
                <select value={deptFormData.head_id} onChange={(e) => setDeptFormData({ ...deptFormData, head_id: e.target.value })} className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none">
                  <option value="None">None</option>
                  {employeesList.map(emp => (<option key={emp.id} value={emp.id}>{emp.name}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Parent Department</label>
                <select value={deptFormData.parent_department_id} onChange={(e) => setDeptFormData({ ...deptFormData, parent_department_id: e.target.value })} className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none">
                  <option value="None">None</option>
                  {departmentsList.map(d => (<option key={d.id} value={d.id}>{d.name}</option>))}
                </select>
              </div>
            </div>
            <div className="p-6 border-t border-border flex justify-end gap-3 bg-surface-hover/30">
              <button onClick={() => setIsDeptModalOpen(false)} className="px-5 py-2.5 text-sm font-semibold text-muted hover:bg-surface-hover rounded-xl transition-colors">Cancel</button>
              <button onClick={saveDept} disabled={!deptFormData.name.trim()} className="px-5 py-2.5 text-sm font-bold text-btn-text bg-btn-bg hover:bg-btn-hover rounded-xl shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {deptModalMode === 'add' ? 'Save' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CATEGORY FORM MODAL */}
      {isCatModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setIsCatModalOpen(false)} />
          <div className="relative w-full max-w-2xl bg-surface border border-border rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-border shrink-0">
              <h2 className="text-xl font-medium text-foreground">{catModalMode === 'add' ? 'Add New Category' : 'Edit Category'}</h2>
              <button onClick={() => setIsCatModalOpen(false)} className="text-muted hover:text-foreground transition-colors"><X className="h-5 w-5" /></button>
            </div>
            <div className="p-6 space-y-6 overflow-y-auto">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Category Name *</label>
                <input type="text" value={catFormData.name} onChange={(e) => setCatFormData({ ...catFormData, name: e.target.value })} placeholder="e.g. Electronics, Furniture" className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-semibold text-foreground">Custom Fields</label>
                    <button 
                        onClick={() => setCatFormData({
                            ...catFormData, 
                            fields: [...catFormData.fields, { name: '', type: 'string', required: false, label: '' }]
                        })}
                        className="text-xs font-semibold text-primary hover:bg-primary/10 px-3 py-1.5 rounded-md transition-colors flex items-center gap-1"
                    >
                        <Plus className="h-3.5 w-3.5" /> Add Field
                    </button>
                </div>
                
                {catFormData.fields.length === 0 ? (
                    <div className="p-6 text-center border border-dashed border-border rounded-xl bg-background/50">
                        <p className="text-sm text-muted">No custom fields defined. Assets in this category will only have standard fields.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {catFormData.fields.map((field, idx) => (
                            <div key={idx} className="flex gap-3 items-start bg-background p-3 rounded-xl border border-border">
                                <div className="flex-1 space-y-3">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <input 
                                                type="text" 
                                                placeholder="Field ID (e.g. warranty_months)" 
                                                value={field.name}
                                                onChange={(e) => {
                                                    const newFields = [...catFormData.fields];
                                                    newFields[idx].name = e.target.value;
                                                    setCatFormData({...catFormData, fields: newFields});
                                                }}
                                                className="w-full px-3 py-2 text-sm bg-surface border border-border rounded-lg text-foreground focus:outline-none focus:border-primary" 
                                            />
                                        </div>
                                        <div>
                                            <input 
                                                type="text" 
                                                placeholder="Display Label (e.g. Warranty Period)" 
                                                value={field.label || ''}
                                                onChange={(e) => {
                                                    const newFields = [...catFormData.fields];
                                                    newFields[idx].label = e.target.value;
                                                    setCatFormData({...catFormData, fields: newFields});
                                                }}
                                                className="w-full px-3 py-2 text-sm bg-surface border border-border rounded-lg text-foreground focus:outline-none focus:border-primary" 
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-4 items-center">
                                        <select 
                                            value={field.type}
                                            onChange={(e) => {
                                                const newFields = [...catFormData.fields];
                                                newFields[idx].type = e.target.value;
                                                setCatFormData({...catFormData, fields: newFields});
                                            }}
                                            className="px-3 py-2 text-sm bg-surface border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
                                        >
                                            <option value="string">Text (String)</option>
                                            <option value="number">Number</option>
                                            <option value="date">Date</option>
                                            <option value="boolean">Checkbox (Boolean)</option>
                                        </select>
                                        <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                                            <input 
                                                type="checkbox" 
                                                checked={field.required}
                                                onChange={(e) => {
                                                    const newFields = [...catFormData.fields];
                                                    newFields[idx].required = e.target.checked;
                                                    setCatFormData({...catFormData, fields: newFields});
                                                }}
                                                className="rounded border-border"
                                            />
                                            Required Field
                                        </label>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => {
                                        const newFields = catFormData.fields.filter((_, i) => i !== idx);
                                        setCatFormData({...catFormData, fields: newFields});
                                    }}
                                    className="text-muted hover:text-rose-500 p-2 rounded-lg hover:bg-rose-500/10 transition-colors shrink-0"
                                >
                                    <XCircle className="h-5 w-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
              </div>
            </div>
            <div className="p-6 border-t border-border flex justify-end gap-3 bg-surface-hover/30 shrink-0">
              <button onClick={() => setIsCatModalOpen(false)} className="px-5 py-2.5 text-sm font-semibold text-muted hover:bg-surface-hover rounded-xl transition-colors">Cancel</button>
              <button onClick={saveCat} disabled={!catFormData.name.trim() || catFormData.fields.some(f => !f.name.trim())} className="px-5 py-2.5 text-sm font-bold text-btn-text bg-btn-bg hover:bg-btn-hover rounded-xl shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {catModalMode === 'add' ? 'Save Category' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODALS */}
      {isDeleteDeptOpen && deptToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setIsDeleteDeptOpen(false)} />
          <div className="relative w-full max-w-md bg-surface border border-border rounded-2xl shadow-xl overflow-hidden p-6 text-center animate-in zoom-in-95 duration-200">
            <div className="mx-auto w-12 h-12 bg-rose-500/10 text-rose-500 flex items-center justify-center rounded-full mb-4">
              <Trash2 className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-medium text-foreground mb-2">Deactivate Department?</h2>
            <p className="text-muted mb-6 text-sm leading-relaxed">
              Are you sure you want to deactivate <span className="font-bold text-foreground capitalize">{deptToDelete.name}</span>?
            </p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setIsDeleteDeptOpen(false)} className="px-5 py-2.5 flex-1 text-sm font-semibold text-muted hover:bg-surface-hover rounded-xl transition-colors">Cancel</button>
              <button onClick={deleteDept} className="px-5 py-2.5 flex-1 text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-sm transition-colors">Deactivate</button>
            </div>
          </div>
        </div>
      )}

      {isDeleteCatOpen && catToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setIsDeleteCatOpen(false)} />
          <div className="relative w-full max-w-md bg-surface border border-border rounded-2xl shadow-xl overflow-hidden p-6 text-center animate-in zoom-in-95 duration-200">
            <div className="mx-auto w-12 h-12 bg-rose-500/10 text-rose-500 flex items-center justify-center rounded-full mb-4">
              <Trash2 className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-medium text-foreground mb-2">Delete Category?</h2>
            <p className="text-muted mb-6 text-sm leading-relaxed">
              Are you sure you want to delete <span className="font-bold text-foreground capitalize">{catToDelete.name}</span>? Assets assigned to this category might be affected.
            </p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setIsDeleteCatOpen(false)} className="px-5 py-2.5 flex-1 text-sm font-semibold text-muted hover:bg-surface-hover rounded-xl transition-colors">Cancel</button>
              <button onClick={deleteCat} className="px-5 py-2.5 flex-1 text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-sm transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}