'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  // LayoutDashboard,
  // Users,
  // Settings,
  Package,
  Tags,
  // BarChart,
} from 'lucide-react';

const sidebarLinks = [
  // {
  //   title: 'Dashboard',
  //   icon: LayoutDashboard,
  //   href: '/dashboard',
  // },
  {
    title: 'Menu',
    icon: Package,
    href: '/menu',
  },
  {
    title: 'Categories',
    icon: Tags,
    href: '/categories',
  },
  {
    title: 'Sub Categories',
    icon: Tags,
    href: '/sub-categories',
  },
  {
    title: 'Items',
    icon: Package,
    href: '/products',
  },
  {
    title: 'Offers',
    icon: Package,
    href: '/offers',
  },
  // {
  //   title: 'Customers',
  //   icon: Users,
  //   href: '/customers',
  // },
  // {
  //   title: 'Analytics',
  //   icon: BarChart,
  //   href: '/analytics',
  // },
  // {
  //   title: 'Settings',
  //   icon: Settings,
  //   href: '/settings',
  // },
];

export function Sidebar({
  isOpen,
  toggleSidebar,
}: {
  isOpen: boolean;
  toggleSidebar: () => void;
}) {
  const pathname = usePathname();

  const handleNavigation = () => {
    // Close sidebar when a link is clicked (especially useful for mobile)
    if (isOpen) {
      toggleSidebar();
    }
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className='fixed inset-0 z-40 bg-black/50 lg:hidden'
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-screen w-64 border-r bg-white shadow-xl transition-all duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className='flex h-16 items-center border-b px-6'>
          <h1 className='text-xl font-bold text-indigo-600'>Admin Panel</h1>
        </div>
        <div className='space-y-4 py-4'>
          <div className='px-3 py-2'>
            <div className='space-y-1'>
              <h2 className='mb-2 px-4 text-sm font-semibold tracking-tight text-gray-500'>
                MENU
              </h2>
              <nav className='space-y-1'>
                {sidebarLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={handleNavigation}
                    className={cn(
                      'flex items-center rounded-lg px-3 py-3 text-sm font-medium transition-colors hover:bg-indigo-50 hover:text-indigo-600',
                      pathname === link.href
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'text-gray-700'
                    )}
                  >
                    <link.icon className='mr-3 h-5 w-5' />
                    {link.title}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
