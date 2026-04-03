'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useStore } from '@/store';
import { TransactionTable } from '@/components/transactions/transaction-table';
import { AddTransactionModal } from '@/components/transactions/add-transaction-modal';
import { TableSkeleton } from '@/components/ui/skeleton';

export default function TransactionsPage() {
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const role = useStore((s) => s.role);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
        <TableSkeleton />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 p-4 md:p-6"
    >
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Transactions
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Manage and track all your financial transactions.
          </p>
        </div>
        {role === 'admin' && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition-shadow hover:shadow-xl"
          >
            <Plus className="h-4 w-4" />
            Add Transaction
          </motion.button>
        )}
      </div>

      {/* Transaction Table */}
      <TransactionTable />

      {/* Add Transaction Modal */}
      <AddTransactionModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </motion.div>
  );
}
