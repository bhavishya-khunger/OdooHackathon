import Sidebar from '@/components/Sidebar';
import TopNav from '@/components/TopNav';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F4F5F7] flex">
      <Sidebar />
      <div className="pl-64 flex-1 flex flex-col min-h-screen">
        <TopNav />
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
