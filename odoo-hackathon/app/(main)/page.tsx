import { Search, Plus, Grid3X3, Box } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="max-w-6xl mx-auto h-full flex flex-col pt-4">
      {/* Header Area */}
      <div className="flex justify-between items-center mb-24">
        <h1 className="text-3xl font-medium text-foreground tracking-tight">Assets</h1>
        
        <div className="flex items-center gap-4">
          {/* Segmented Control */}
          <div className="flex items-center bg-background border border-border rounded-full p-0.5 shadow-sm text-sm font-medium">
            <button className="px-4 py-1.5 rounded-full bg-surface-hover text-foreground">
              By you
            </button>
            <button className="px-4 py-1.5 rounded-full text-muted hover:text-foreground hover:bg-surface-hover/50 transition-colors">
              Recents
            </button>
            <button className="px-4 py-1.5 rounded-full text-muted hover:text-foreground hover:bg-surface-hover/50 transition-colors">
              By others
            </button>
          </div>

          <div className="flex items-center gap-2 text-muted">
             <button className="p-1.5 hover:bg-surface-hover hover:text-foreground rounded transition-colors">
                <Grid3X3 className="h-5 w-5" />
             </button>
             <button className="p-1.5 hover:bg-surface-hover hover:text-foreground rounded transition-colors">
                <Plus className="h-5 w-5" />
             </button>
          </div>

          {/* Search Bar */}
          <div className="relative w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-muted" />
            </div>
            <input
              type="text"
              placeholder="Search for an asset"
              className="block w-full pl-9 pr-3 py-1.5 border border-border rounded-full bg-surface text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Empty State */}
      <div className="flex-1 flex flex-col items-center justify-center -mt-32">
        <div className="relative mb-6">
           <Box className="w-24 h-24 text-muted/40 stroke-[1.5]" />
        </div>
        
        <p className="text-muted text-sm mb-6">
          No assets yet. As you register and view assets, they'll appear here.
        </p>

        <button className="flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-full text-sm font-medium text-foreground hover:bg-surface-hover transition-colors shadow-sm">
          <Box className="h-4 w-4 text-muted" />
          Allow system access
        </button>
        <p className="text-muted text-sm mt-2">
          to view assets stored in the database.
        </p>
      </div>
    </div>
  );
}