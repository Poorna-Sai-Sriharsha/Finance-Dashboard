'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  ArrowLeftRight,
  Lightbulb,
  ChevronLeft,
  Wallet,
} from 'lucide-react';
import { useStore } from '@/store';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { href: '/insights', label: 'Insights', icon: Lightbulb },
];

export function Sidebar() {
  const pathname = usePathname();
  const sidebarOpen = useStore((s) => s.sidebarOpen);
  const toggleSidebar = useStore((s) => s.toggleSidebar);
  const setSidebarOpen = useStore((s) => s.setSidebarOpen);

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={cn(
          'fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-slate-200/10 bg-white/80 backdrop-blur-xl dark:bg-slate-900/80',
          'transition-all duration-300 ease-in-out',
          'lg:sticky lg:z-30',
          sidebarOpen ? 'w-64' : 'w-0 lg:w-20',
          !sidebarOpen && 'overflow-hidden lg:overflow-visible'
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-slate-200/10">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400 shadow-lg shadow-emerald-500/20">
              <Wallet className="h-5 w-5 text-white" />
            </div>
            {sidebarOpen && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-lg font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent"
              >
                FinanceIQ
              </motion.span>
            )}
          </Link>
          <button
            onClick={toggleSidebar}
            className="hidden lg:flex h-7 w-7 items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ChevronLeft
              className={cn(
                'h-4 w-4 text-slate-500 transition-transform duration-300',
                !sidebarOpen && 'rotate-180'
              )}
            />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  if (window.innerWidth < 1024) setSidebarOpen(false);
                }}
                className={cn(
                  'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 text-emerald-500 dark:text-emerald-400'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/50'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 rounded-r-full bg-gradient-to-b from-emerald-400 to-cyan-400"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon className={cn('h-5 w-5 flex-shrink-0', isActive && 'text-emerald-500 dark:text-emerald-400')} />
                {sidebarOpen && <span>{item.label}</span>}
                {!sidebarOpen && (
                  <div className="absolute left-full ml-2 hidden lg:group-hover:flex items-center">
                    <div className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white shadow-xl dark:bg-slate-700">
                      {item.label}
                    </div>
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        {sidebarOpen && (
          <div className="border-t border-slate-200/10 p-4">
            <div className="rounded-xl bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 p-3">
              <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                FinanceIQ Pro
              </p>
              <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                Smart financial tracking & insights
              </p>
            </div>
          </div>
        )}
      </motion.aside>
    </>
  );
}
