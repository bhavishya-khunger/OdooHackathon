import { Plus, Calendar, FileText, AlertCircle, Laptop, Projector, TrendingUp, ArrowRight } from 'lucide-react';

export default function Dashboard() {
  const stats = [
    { label: 'Available', value: '128', trend: '+12%', color: 'from-emerald-500 to-teal-500' },
    { label: 'Allocated', value: '76', trend: '+5%', color: 'from-blue-500 to-indigo-500' },
    { label: 'In Maintenance', value: '4', trend: '-2%', color: 'from-amber-400 to-orange-500' },
    { label: 'Active Bookings', value: '9', trend: '+18%', color: 'from-purple-500 to-violet-500' },
    { label: 'Pending Transfers', value: '3', trend: '0%', color: 'from-sky-400 to-blue-500' },
    { label: 'Upcoming returns', value: '12', trend: '+4%', color: 'from-rose-400 to-red-500' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-[28px] font-bold text-[#172B4D] tracking-tight">Dashboard</h1>
          <p className="text-[15px] text-[#5E6C84] mt-1">Here's what's happening with your assets today.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-white border border-[#DFE1E6] hover:bg-gray-50 text-[#42526E] px-4 py-2.5 rounded-lg font-medium text-sm transition-all shadow-sm">
            <Calendar className="h-4 w-4" />
            Book resource
          </button>
          <button className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-4 py-2.5 rounded-lg font-medium text-sm transition-all shadow-sm hover:shadow-md">
            <Plus className="h-4 w-4" />
            Register asset
          </button>
        </div>
      </div>

      <div className="bg-red-50 border border-red-100 rounded-lg p-4 flex items-center gap-3 shadow-sm">
        <div className="bg-red-100 p-2 rounded-full">
          <AlertCircle className="h-5 w-5 text-red-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-red-800 font-semibold text-sm">Action Required</h3>
          <p className="text-red-700 text-sm mt-0.5">3 assets overdue for return - flagged for follow-up</p>
        </div>
        <button className="text-sm font-medium text-red-700 hover:text-red-800 flex items-center gap-1 bg-red-100 hover:bg-red-200 px-3 py-1.5 rounded-md transition-colors">
          View details <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      <section>
        <h2 className="text-[16px] font-semibold text-[#172B4D] mb-4 uppercase tracking-wider">Today's Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-5 rounded-xl border border-[#DFE1E6] shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
              <div className="relative z-10">
                <span className="text-[14px] font-semibold text-[#5E6C84]">{stat.label}</span>
                <div className="mt-2 flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-[#172B4D] tracking-tight">{stat.value}</span>
                  <span className={`text-xs font-semibold flex items-center gap-1 ${stat.trend.startsWith('+') ? 'text-emerald-600' : stat.trend.startsWith('-') ? 'text-red-600' : 'text-gray-500'}`}>
                    {stat.trend.startsWith('+') && <TrendingUp className="h-3 w-3" />}
                    {stat.trend}
                  </span>
                </div>
              </div>
              <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-gradient-to-br ${stat.color} opacity-10 group-hover:scale-150 transition-transform duration-500`} />
            </div>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[16px] font-semibold text-[#172B4D] uppercase tracking-wider">Recent Activity</h2>
            <button className="text-sm text-primary hover:underline font-medium">View all</button>
          </div>
          <div className="bg-white rounded-xl border border-[#DFE1E6] shadow-sm overflow-hidden">
            <div className="divide-y divide-gray-100">
              <div className="p-4 sm:p-5 flex items-start gap-4 hover:bg-gray-50/50 transition-colors">
                <div className="bg-blue-50 p-2.5 rounded-xl border border-blue-100">
                  <Laptop className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <p className="text-[14px] text-[#172B4D]">
                      <span className="font-semibold">Laptop AF-0114</span> allocated to <span className="font-semibold">Priya Shah</span>
                    </p>
                    <span className="text-xs text-[#5E6C84] whitespace-nowrap ml-4">10 mins ago</span>
                  </div>
                  <p className="text-[13px] text-[#5E6C84] mt-1">IT Dept • Room B2 • Booking confirmed 2:00 PM to 3:00 PM</p>
                </div>
              </div>
              <div className="p-4 sm:p-5 flex items-start gap-4 hover:bg-gray-50/50 transition-colors">
                <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-100">
                  <Projector className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <p className="text-[14px] text-[#172B4D]">
                      <span className="font-semibold">Projector AF-0062</span> maintenance resolved
                    </p>
                    <span className="text-xs text-[#5E6C84] whitespace-nowrap ml-4">1 hour ago</span>
                  </div>
                  <p className="text-[13px] text-[#5E6C84] mt-1">Ready for deployment • Serviced by Hardware Team</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div>
           <div className="flex items-center justify-between mb-4">
            <h2 className="text-[16px] font-semibold text-[#172B4D] uppercase tracking-wider">Quick Actions</h2>
          </div>
          <div className="bg-white rounded-xl border border-[#DFE1E6] shadow-sm p-2 space-y-1">
             <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 text-left transition-colors group">
                <div className="bg-gray-100 p-2 rounded-lg group-hover:bg-white group-hover:shadow-sm transition-all text-[#42526E]">
                  <FileText className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#172B4D]">Raise Request</p>
                  <p className="text-xs text-[#5E6C84]">Submit a new IT ticket</p>
                </div>
             </button>
             <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 text-left transition-colors group">
                <div className="bg-gray-100 p-2 rounded-lg group-hover:bg-white group-hover:shadow-sm transition-all text-[#42526E]">
                  <AlertCircle className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#172B4D]">Report Issue</p>
                  <p className="text-xs text-[#5E6C84]">Flag a broken asset</p>
                </div>
             </button>
          </div>
        </div>
      </section>
    </div>
  );
}
