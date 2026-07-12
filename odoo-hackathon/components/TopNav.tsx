import { Search, Bell, HelpCircle, User } from 'lucide-react';
import Link from 'next/link';

export default function TopNav() {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex-1 flex items-center gap-4">
        <div className="relative w-full max-w-md hidden md:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search assets, users, or tickets..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white focus:border-transparent transition-all sm:text-sm"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors">
          <HelpCircle className="h-5 w-5" />
        </button>
        <button className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>
        <div className="h-8 w-px bg-gray-300 mx-2 hidden sm:block"></div>
        <Link href="/login" className="flex items-center gap-2 hover:bg-gray-50 p-1.5 rounded-lg transition-colors cursor-pointer group">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
            <span className="text-sm font-semibold">JD</span>
          </div>
        </Link>
      </div>
    </header>
  );
}
