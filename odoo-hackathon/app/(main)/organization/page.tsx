import { Plus, Search, MoreHorizontal, AlertCircle, Building2, ArrowUpRight } from 'lucide-react';

export default function OrganizationSetup() {
  const departments = [
    { id: 1, name: 'Engineering', head: 'Aditi Rao', initials: 'AR', color: 'bg-primary-tint text-primary-hover', parent: '--', status: 'Active' },
    { id: 2, name: 'Facilities', head: 'Rohan Mehta', initials: 'RM', color: 'bg-[var(--status-available-tint)] text-[var(--status-available-ic)]', parent: '--', status: 'Active' },
    { id: 3, name: 'Field ops (east)', head: 'Sana Iqbal', initials: 'SI', color: 'bg-[var(--status-bookings-tint)] text-[var(--status-bookings-ic)]', parent: 'Field Ops', status: 'Inactive' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Organization setup</h1>
          <p className="text-[15px] text-muted mt-1">Manage departments, categories, and employees.</p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white px-4 py-2.5 rounded-md font-medium text-sm transition-all shadow-sm">
          <Plus className="h-4 w-4" />
          Add Department
        </button>
      </div>

      <div className="bg-surface rounded-md border border-border shadow-sm overflow-hidden">
        <div className="border-b border-border px-6">
          <div className="flex gap-6">
            <button className="py-4 text-[14px] font-semibold text-primary border-b-2 border-primary">
              Departments
            </button>
            <button className="py-4 text-[14px] font-medium text-muted hover:text-foreground border-b-2 border-transparent transition-colors">
              Categories
            </button>
            <button className="py-4 text-[14px] font-medium text-muted hover:text-foreground border-b-2 border-transparent transition-colors">
              Employee
            </button>
          </div>
        </div>
        
        <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-background/50">
           <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
              <input 
                type="text" 
                placeholder="Search departments..." 
                className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-surface text-foreground"
              />
            </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-[14px] text-left">
            <thead className="text-[12px] text-muted uppercase tracking-wider bg-background/80 border-y border-border">
              <tr>
                <th className="px-6 py-3 font-semibold">Department</th>
                <th className="px-6 py-3 font-semibold">Head</th>
                <th className="px-6 py-3 font-semibold">Parent Dept</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {departments.map((dept) => (
                <tr key={dept.id} className="hover:bg-surface-hover transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-background p-2 rounded-md border border-border text-muted">
                        <Building2 className="h-4 w-4" />
                      </div>
                      <span className="font-semibold text-foreground">{dept.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                     <div className="flex items-center gap-3">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${dept.color}`}>
                          {dept.initials}
                        </div>
                        <span className="text-foreground font-medium">{dept.head}</span>
                     </div>
                  </td>
                  <td className="px-6 py-4 text-muted">{dept.parent}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-[12px] font-bold uppercase tracking-wider ${
                      dept.status === 'Active' 
                        ? 'bg-[var(--status-available-tint)] text-[var(--status-available-ic)]' 
                        : 'bg-background text-muted border border-border'
                    }`}>
                      {dept.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-muted hover:text-foreground p-1.5 rounded-md hover:bg-surface-hover transition-colors opacity-0 group-hover:opacity-100">
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-sm text-[var(--status-allocated-ic)] flex items-center gap-2 bg-[var(--status-allocated-tint)] p-4 rounded-md border border-primary/20">
        <AlertCircle className="h-4 w-4 text-[var(--status-allocated-ic)] shrink-0" />
        <p>Editing a department here also drives the picklist in Screen 4 & 5.</p>
      </div>
    </div>
  );
}
