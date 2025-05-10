// src/app/layout.tsx (updated)
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { EnhancedFooter } from '@/components/layout/enhanced-footer';
import { ThemeProvider } from '@/providers/theme-provider';
import { AppProvider } from '@/contexts/app-context';
import { ToastProvider } from '@/providers/toast-provider';
import { ConvexClientProvider } from '@/providers/convex-provider';
import { EnhancedLayoutWrapper } from '@/components/layout/enhanced-layout-wrapper';
import { EnhancedHeader } from '@/components/layout/enhanced-header';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'VoteMeMaybe - Decentralized Voting Platform',
  description: 'A secure blockchain-based voting platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ConvexClientProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AppProvider>
              <EnhancedLayoutWrapper>
                <EnhancedHeader />
                <main className="min-h-[calc(100vh-64px-250px)]">
                  {children}
                </main>
                <EnhancedFooter />
              </EnhancedLayoutWrapper>
              <ToastProvider />
            </AppProvider>
          </ThemeProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}