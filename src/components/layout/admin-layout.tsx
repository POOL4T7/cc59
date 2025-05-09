// Example of how to use them together in a layout component:
'use client';
import { useState } from 'react';
import { Header } from './header';
// import { Sidebar } from './sidebar';
import { cn } from '@/lib/utils';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <Header toggleSidebar={toggleSidebar} />
      {/* <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} /> */}
      <div
        className={cn(
          'transition-all duration-300 ease-in-out'
          // sidebarOpen ? 'lg:ml-64' : 'lg:ml-0'
        )}
      >
        <main className='p-6'>{children}</main>
      </div>
    </div>
  );
}
