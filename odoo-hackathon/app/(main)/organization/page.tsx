import { Plus, Search, MoreHorizontal, AlertCircle, Building2 } from 'lucide-react';

export default function OrganizationSetup() {
  const departments = [
    { id: 1, name: 'Engineering', head: 'Aditi Rao', initials: 'AR', color: 'bg-blue-100 text-blue-700', parent: '--', status: 'Active' },
    { id: 2, name: 'Facilities', head: 'Rohan Mehta', initials: 'RM', color: 'bg-emerald-100 text-emerald-700', parent: '--', status: 'Active' },
    { id: 3, name: 'Field ops (east)', head: 'Sana Iqbal', initials: 'SI', color: 'bg-purple-100 text-purple-700', parent: 'Field Ops', status: 'Inactive' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-[28px] font-bold text-[#172B4D] tracking-tight">Organization setup</h1>
          <p className="text-[15px] text-[#5E6C84] mt-1">Manage departments, categories, and employees.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#DFE1E6] shadow-sm overflow-hidden">
        <div className="border-b border-[#DFE1E6] px-6">
          <div className="flex gap-6">
            <button className="py-4 text-[14px] font-semibold text-primary border-b-2 border-primary">
              Departments
            </button>
            <button className="py-4 text-[14px] font-medium text-[#5E6C84] hover:text-[#172B4D] border-b-2 border-transparent transition-colors">
              Categories
            </button>
            <button className="py-4 text-[14px] font-medium text-[#5E6C84] hover:text-[#172B4D] border-b-2 border-transparent transition-colors">
              Employee
            </button>
          </div>
        </div>
        
        <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/30">
           <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search departments..." 
                className="w-full pl-9 pr-4 py-2 text-sm border border-[#DFE1E6] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white"
              />
            </div>
            <button className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg font-medium text-sm transition-all shadow-sm">
              <Plus className="h-4 w-4" />
              Add Department
            </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-[14px] text-left">
            <thead className="text-[12px] text-[#5E6C84] uppercase tracking-wider bg-gray-50/80 border-y border-[#DFE1E6]">
              <tr>
                <th className="px-6 py-3 font-semibold">Department</th>
                <th className="px-6 py-3 font-semibold">Head</th>
                <th className="px-6 py-3 font-semibold">Parent Dept</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DFE1E6]">
              {departments.map((dept) => (
                <tr key={dept.id} className="hover:bg-gray-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-gray-100 p-2 rounded-lg text-gray-500">
                        <Building2 className="h-4 w-4" />
                      </div>
                      <span className="font-semibold text-[#172B4D]">{dept.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                     <div className="flex items-center gap-3">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${dept.color}`}>
                          {dept.initials}
                        </div>
                        <span className="text-[#42526E] font-medium">{dept.head}</span>
                     </div>
                  </td>
                  <td className="px-6 py-4 text-[#5E6C84]">{dept.parent}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-[12px] font-bold uppercase tracking-wider ${
                      dept.status === 'Active' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {dept.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-400 hover:text-[#172B4D] p-1.5 rounded-md hover:bg-gray-200 transition-colors opacity-0 group-hover:opacity-100">
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-sm text-[#5E6C84] flex items-center gap-2 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <p>Editing a department here also drives the picklist in Screen 4 & 5.</p>
      </div>
    </div>
  );
}
