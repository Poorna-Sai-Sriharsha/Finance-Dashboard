'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Calendar, DollarSign, Tag, FileText, Store } from 'lucide-react';
import { useStore } from '@/store';
import { Transaction, TRANSACTION_CATEGORIES, TransactionCategory, TransactionType, TransactionStatus } from '@/types';
import { cn } from '@/lib/utils';
import { z } from 'zod';

const transactionSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  amount: z.number().positive('Amount must be positive'),
  category: z.string().min(1, 'Category is required'),
  type: z.enum(['income', 'expense']),
  description: z.string().min(1, 'Description is required'),
  merchant: z.string().min(1, 'Merchant is required'),
});

interface AddTransactionModalProps {
  open: boolean;
  onClose: () => void;
}

export function AddTransactionModal({ open, onClose }: AddTransactionModalProps) {
  const addTransaction = useStore((s) => s.addTransaction);

  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    amount: '',
    category: '' as string,
    type: 'expense' as TransactionType,
    description: '',
    merchant: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = transactionSchema.safeParse({
      ...form,
      amount: parseFloat(form.amount) || 0,
    });

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      // @ts-ignore - Zod types are messy without strict compilation
      parsed.error.errors.forEach((err: any) => {
        if (err.path[0]) fieldErrors[String(err.path[0])] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    const newTransaction: Transaction = {
      id: 'txn_' + Math.random().toString(36).substring(2, 11),
      date: new Date(form.date).toISOString(),
      amount: parseFloat(form.amount),
      category: form.category as TransactionCategory,
      type: form.type,
      description: form.description,
      merchant: form.merchant,
      status: 'completed' as TransactionStatus,
    };

    addTransaction(newTransaction);
    onClose();
    setForm({
      date: new Date().toISOString().slice(0, 10),
      amount: '',
      category: '',
      type: 'expense',
      description: '',
      merchant: '',
    });
    setErrors({});
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="w-full max-w-lg rounded-2xl bg-white shadow-2xl dark:bg-slate-800 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400">
                  <Plus className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Add Transaction</h2>
              </div>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Type Toggle */}
              <div className="flex gap-2">
                {(['expense', 'income'] as TransactionType[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setForm({ ...form, type: t })}
                    className={cn(
                      'flex-1 rounded-xl py-3 text-sm font-semibold capitalize transition-all',
                      form.type === t
                        ? t === 'income'
                          ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                          : 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
                        : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* Amount */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                  <DollarSign className="h-3.5 w-3.5" /> Amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  className={cn(
                    'w-full rounded-xl border bg-white px-4 py-3 text-lg font-bold outline-none transition-all dark:bg-slate-900 dark:text-white',
                    errors.amount
                      ? 'border-rose-300 focus:ring-rose-400/20'
                      : 'border-slate-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 dark:border-slate-700'
                  )}
                />
                {errors.amount && <p className="mt-1 text-xs text-rose-500">{errors.amount}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Date */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                    <Calendar className="h-3.5 w-3.5" /> Date
                  </label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                    <Tag className="h-3.5 w-3.5" /> Category
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className={cn(
                      'w-full rounded-xl border bg-white px-4 py-2.5 text-sm outline-none transition-all dark:bg-slate-900 dark:text-white',
                      errors.category
                        ? 'border-rose-300'
                        : 'border-slate-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 dark:border-slate-700'
                    )}
                  >
                    <option value="">Select…</option>
                    {TRANSACTION_CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  {errors.category && <p className="mt-1 text-xs text-rose-500">{errors.category}</p>}
                </div>
              </div>

              {/* Merchant */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                  <Store className="h-3.5 w-3.5" /> Merchant
                </label>
                <input
                  type="text"
                  placeholder="e.g., Starbucks"
                  value={form.merchant}
                  onChange={(e) => setForm({ ...form, merchant: e.target.value })}
                  className={cn(
                    'w-full rounded-xl border bg-white px-4 py-2.5 text-sm outline-none transition-all dark:bg-slate-900 dark:text-white',
                    errors.merchant
                      ? 'border-rose-300'
                      : 'border-slate-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 dark:border-slate-700'
                  )}
                />
                {errors.merchant && <p className="mt-1 text-xs text-rose-500">{errors.merchant}</p>}
              </div>

              {/* Description */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                  <FileText className="h-3.5 w-3.5" /> Description
                </label>
                <input
                  type="text"
                  placeholder="Brief description…"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className={cn(
                    'w-full rounded-xl border bg-white px-4 py-2.5 text-sm outline-none transition-all dark:bg-slate-900 dark:text-white',
                    errors.description
                      ? 'border-rose-300'
                      : 'border-slate-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 dark:border-slate-700'
                  )}
                />
                {errors.description && <p className="mt-1 text-xs text-rose-500">{errors.description}</p>}
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition-all hover:shadow-xl active:scale-[0.98]"
                >
                  Add Transaction
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
