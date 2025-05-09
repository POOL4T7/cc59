import type { Metadata } from 'next';
import DashboardLayout from '@/components/layout/admin-layout';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Modern admin dashboard built with Next.js and Shadcn UI',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <DashboardLayout>{children}</DashboardLayout>
    </>
  );
}
