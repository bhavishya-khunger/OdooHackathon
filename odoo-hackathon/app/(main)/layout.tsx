import React from 'react';
import Sidebar from '@/components/Sidebar';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0F0F0F] flex font-sans">
      <Sidebar />
      <div className="pl-64 flex-1 flex flex-col min-h-screen">
        <main className="flex-1 w-full bg-[#0F0F0F]">
          {children}
        </main>
      </div>
    </div>
  );
}
