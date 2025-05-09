import type React from 'react';
import './globals.css';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from 'sonner'; // Corrected import path for Toaster

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'CC59 - Employee Management System',
  description:
    'A comprehensive solution to streamline HR processes, boost productivity, and enhance employee engagement.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' suppressHydrationWarning={true}>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider
            attribute='class'
            defaultTheme='light'
            enableSystem
            disableTransitionOnChange
          >
            <Toaster /> {/* Add Toaster component here */}
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
