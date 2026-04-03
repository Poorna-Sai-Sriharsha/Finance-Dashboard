'use client';

import { motion } from 'framer-motion';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  PiggyBank,
  DollarSign,
  CreditCard,
} from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';

interface SummaryCardProps {
  title: string;
  value: number;
  change: number;
  type: 'balance' | 'income' | 'expense' | 'savings';
  index: number;
}

const icons = {
  balance: Wallet,
  income: DollarSign,
  expense: CreditCard,
  savings: PiggyBank,
};

const gradients = {
  balance: 'from-blue-500 to-indigo-600',
  income: 'from-emerald-500 to-teal-600',
  expense: 'from-rose-500 to-pink-600',
  savings: 'from-amber-500 to-orange-600',
};

const bgGradients = {
  balance: 'from-blue-500/10 to-indigo-500/10',
  income: 'from-emerald-500/10 to-teal-500/10',
  expense: 'from-rose-500/10 to-pink-500/10',
  savings: 'from-amber-500/10 to-orange-500/10',
};

export function SummaryCard({ title, value, change, type, index }: SummaryCardProps) {
  const Icon = icons[type];
  const isPositive = change >= 0;
  const isSavings = type === 'savings';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: 'easeOut' }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-slate-200/50 bg-white p-5 shadow-sm transition-shadow hover:shadow-xl',
        'dark:border-slate-700/50 dark:bg-slate-800/50 dark:hover:shadow-slate-900/30'
      )}
    >
      {/* Background gradient accent */}
      <div
        className={cn(
          'absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br opacity-20 blur-2xl transition-opacity group-hover:opacity-40',
          bgGradients[type]
        )}
      />

      <div className="relative">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <div
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg',
              gradients[type]
            )}
          >
            <Icon className="h-5 w-5 text-white" />
          </div>
        </div>

        <div className="mt-3">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
            {isSavings ? `${value}%` : formatCurrency(value)}
          </h3>
        </div>

        <div className="mt-2 flex items-center gap-1.5">
          <div
            className={cn(
              'flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold',
              isPositive
                ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
                : 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400'
            )}
          >
            {isPositive ? (
              <ArrowUpRight className="h-3 w-3" />
            ) : (
              <ArrowDownRight className="h-3 w-3" />
            )}
            {Math.abs(change)}%
          </div>
          <span className="text-xs text-slate-400">vs last month</span>
        </div>
      </div>

      {/* Savings ring for savings card */}
      {isSavings && (
        <div className="absolute bottom-3 right-4">
          <svg className="h-12 w-12 -rotate-90" viewBox="0 0 36 36">
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className="text-slate-100 dark:text-slate-700"
            />
            <motion.path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              strokeWidth="2.5"
              strokeDasharray={`${Math.max(0, Math.min(100, value))}, 100`}
              strokeLinecap="round"
              className="text-amber-500"
              stroke="currentColor"
              initial={{ strokeDasharray: '0, 100' }}
              animate={{ strokeDasharray: `${Math.max(0, Math.min(100, value))}, 100` }}
              transition={{ delay: 0.5, duration: 1.5, ease: 'easeOut' }}
            />
          </svg>
        </div>
      )}
    </motion.div>
  );
}
