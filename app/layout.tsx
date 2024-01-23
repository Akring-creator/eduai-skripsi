import './globals.css';
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { ToastProvider } from '@/components/providers/toaster-providers';
import { Metadata } from 'next';
import { ConfettiProvider } from '@/components/providers/confetti-provider';
import 'simplebar-react/dist/simplebar.min.css';

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
  // if (process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'false') {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <ConfettiProvider />
          <ToastProvider />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
  // } else {
  //   return <MaintenancePage />;
  // }
}
