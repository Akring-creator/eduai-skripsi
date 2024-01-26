import './globals.css';
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { ToastProvider } from '@/components/providers/toaster-providers';
import { Metadata } from 'next';
import { ConfettiProvider } from '@/components/providers/confetti-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import 'react-loading-skeleton/dist/skeleton.css';
import 'simplebar-react/dist/simplebar.min.css';
import QueryProvider from '@/components/providers/query-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'EdTek',
  description: 'Education with Technology',
  icons: './favicon.ico',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = new QueryClient();

  // if (process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'false') {
  return (
    <ClerkProvider>
      <html lang="en">
        <QueryProvider>
          <body className={inter.className}>
            <ConfettiProvider />
            <ToastProvider />
            {children}
          </body>
        </QueryProvider>
      </html>
    </ClerkProvider>
  );
  // } else {
  //   return <MaintenancePage />;
  // }
}
