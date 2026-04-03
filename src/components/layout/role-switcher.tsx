'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Eye, ChevronDown, Check } from 'lucide-react';
import { useStore } from '@/store';
import { UserRole } from '@/types';
import { cn } from '@/lib/utils';

const roles: { value: UserRole; label: string; icon: typeof Shield }[] = [
  { value: 'admin', label: 'Admin', icon: Shield },
  { value: 'viewer', label: 'Viewer', icon: Eye },
];

export function RoleSwitcher() {
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const role = useStore((s) => s.role);
  const setRole = useStore((s) => s.setRole);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 2500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const currentRole = roles.find((r) => r.value === role)!;

  return (
    <>
      <div ref={ref} className="relative">
        <button
          onClick={() => setOpen(!open)}
          className={cn(
            'flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200',
            'hover:bg-slate-100 dark:hover:bg-slate-800',
            'active:scale-[0.98]'
          )}
        >
          <div
            className={cn(
              'flex h-6 w-6 items-center justify-center rounded-lg',
              role === 'admin'
                ? 'bg-gradient-to-br from-emerald-400 to-cyan-400'
                : 'bg-slate-300 dark:bg-slate-600'
            )}
          >
            <currentRole.icon className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="hidden sm:inline text-slate-700 dark:text-slate-200">
            {currentRole.label}
          </span>
          <span
            className={cn(
              'hidden sm:inline rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider',
              role === 'admin'
                ? 'bg-emerald-500/10 text-emerald-500'
                : 'bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400'
            )}
          >
            {role}
          </span>
          <ChevronDown className={cn('h-3.5 w-3.5 text-slate-400 transition-transform', open && 'rotate-180')} />
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 w-48 overflow-hidden rounded-2xl border border-slate-200/20 bg-white shadow-2xl dark:bg-slate-800 dark:shadow-slate-900/50"
            >
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Switch Role
                </p>
              </div>
              {roles.map((r) => (
                <button
                  key={r.value}
                  onClick={() => {
                    if (r.value !== role) {
                      setRole(r.value);
                      setToast(`Switched to ${r.label} mode`);
                    }
                    setOpen(false);
                  }}
                  className={cn(
                    'flex w-full items-center gap-3 px-4 py-3 text-left transition-colors',
                    'hover:bg-slate-50 dark:hover:bg-slate-700/50',
                    r.value === role && 'bg-emerald-50/50 dark:bg-emerald-500/5'
                  )}
                >
                  <div
                    className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-xl',
                      r.value === 'admin'
                        ? 'bg-gradient-to-br from-emerald-400 to-cyan-400'
                        : 'bg-slate-200 dark:bg-slate-600'
                    )}
                  >
                    <r.icon className="h-4 w-4 text-white" />
                  </div>
                  <p className="flex-1 text-sm font-medium text-slate-800 dark:text-slate-100">{r.label}</p>
                  {r.value === role && (
                    <Check className="h-4 w-4 text-emerald-500" />
                  )}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Toast notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className="fixed bottom-6 left-1/2 z-[100] flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white shadow-2xl dark:bg-emerald-600"
          >
            <Shield className="h-4 w-4" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
