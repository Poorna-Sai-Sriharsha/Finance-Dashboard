'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Moon, Sun, Bell, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useStore } from '@/store';
import { RoleSwitcher } from './role-switcher';
import { cn } from '@/lib/utils';



export function Navbar() {
  const toggleSidebar = useStore((s) => s.toggleSidebar);
  const darkMode = useStore((s) => s.darkMode);
  const toggleDarkMode = useStore((s) => s.toggleDarkMode);
  const notifications = useStore((s) => s.notifications || []);
  const markAllNotificationsRead = useStore((s) => s.markAllNotificationsRead);
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200/10 bg-white/70 px-4 backdrop-blur-xl dark:bg-slate-900/70 md:px-6">
      {/* Left side */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="flex h-9 w-9 items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors lg:hidden"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5 text-slate-600 dark:text-slate-300" />
        </button>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative flex h-9 w-9 items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="View notifications"
          >
            <Bell className="h-[18px] w-[18px] text-slate-600 dark:text-slate-300" />
            {unreadCount > 0 && (
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-80 overflow-hidden rounded-2xl border border-slate-200/50 bg-white shadow-2xl dark:border-slate-700/50 dark:bg-slate-800 dark:shadow-slate-900/50"
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-700">
                  <p className="text-sm font-semibold text-slate-800 dark:text-white">Notifications</p>
                  <span className="rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-bold text-white">{unreadCount}</span>
                </div>
                <div className="max-h-72 overflow-y-auto scrollbar-thin">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                      No notifications yet.
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={cn(
                          'flex gap-3 px-4 py-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/30 cursor-pointer',
                          !n.read && 'bg-emerald-50/30 dark:bg-emerald-500/5'
                        )}
                      >
                        <div className={cn(
                          'mt-1 h-2 w-2 flex-shrink-0 rounded-full',
                          n.read ? 'bg-transparent' : 'bg-emerald-500'
                        )} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{n.title}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{n.message}</p>
                          <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
                            {formatDistanceToNow(new Date(n.date), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="border-t border-slate-100 dark:border-slate-700 px-4 py-2.5">
                  <button 
                    onClick={() => markAllNotificationsRead()}
                    className="w-full text-center text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 disabled:opacity-50"
                    disabled={unreadCount === 0}
                  >
                    Mark all as read
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Dark mode toggle */}
        <button
          onClick={toggleDarkMode}
          className={cn(
            'flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-300',
            'hover:bg-slate-100 dark:hover:bg-slate-800',
            'active:scale-95'
          )}
          aria-label="Toggle dark mode"
        >
          {darkMode ? (
            <Sun className="h-[18px] w-[18px] text-amber-400 transition-transform hover:rotate-45" />
          ) : (
            <Moon className="h-[18px] w-[18px] text-slate-600 transition-transform hover:-rotate-12" />
          )}
        </button>

        {/* Divider */}
        <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />

        {/* Role Switcher */}
        <RoleSwitcher />
      </div>
    </header>
  );
}
