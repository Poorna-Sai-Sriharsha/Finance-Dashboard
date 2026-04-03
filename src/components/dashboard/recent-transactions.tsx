'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Transaction, CATEGORY_COLORS } from '@/types';
import { formatCurrency, formatDateShort, cn } from '@/lib/utils';

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="rounded-2xl border border-slate-200/50 bg-white p-6 shadow-sm dark:border-slate-700/50 dark:bg-slate-800/50"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            Recent Transactions
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Latest activity
          </p>
        </div>
        <Link
          href="/transactions"
          className="group flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-emerald-600 transition-colors hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-500/10"
        >
          View All
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      <div className="mt-4 space-y-1">
        {transactions.map((txn, i) => (
          <motion.div
            key={txn.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + i * 0.08 }}
            className="flex items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/30"
          >
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{
                backgroundColor: `${CATEGORY_COLORS[txn.category]}15`,
              }}
            >
              {txn.type === 'income' ? (
                <ArrowDownRight
                  className="h-4 w-4"
                  style={{ color: CATEGORY_COLORS[txn.category] }}
                />
              ) : (
                <ArrowUpRight
                  className="h-4 w-4"
                  style={{ color: CATEGORY_COLORS[txn.category] }}
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">
                {txn.merchant}
              </p>
              <p className="text-xs text-slate-400 truncate">{txn.description}</p>
            </div>
            <div className="text-right">
              <p
                className={cn(
                  'text-sm font-semibold',
                  txn.type === 'income'
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-slate-900 dark:text-white'
                )}
              >
                {txn.type === 'income' ? '+' : '-'}
                {formatCurrency(txn.amount)}
              </p>
              <p className="text-[11px] text-slate-400">{formatDateShort(txn.date)}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
