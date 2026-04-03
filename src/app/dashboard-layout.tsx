'use client';

import { Sidebar } from '@/components/layout/sidebar';
import { Navbar } from '@/components/layout/navbar';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { HydrationGuard } from '@/components/providers/hydration-guard';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <HydrationGuard>
      <ThemeProvider>
        <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
          <Sidebar />
          <div className="flex flex-1 flex-col overflow-hidden">
            <Navbar />
            <main className="flex-1 overflow-y-auto scrollbar-thin">
              {children}
            </main>
          </div>
        </div>
      </ThemeProvider>
    </HydrationGuard>
  );
}
