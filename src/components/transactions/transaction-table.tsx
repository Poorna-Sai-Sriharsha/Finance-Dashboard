'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Trash2,
  FileDown,
  Plus,
  X,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { useStore } from '@/store';
import { useFilteredTransactions } from '@/hooks/use-filtered-transactions';
import { Transaction, TRANSACTION_CATEGORIES, TransactionCategory, TransactionStatus, CATEGORY_COLORS } from '@/types';
import { formatCurrency, formatDate, exportToCSV, cn } from '@/lib/utils';

type SortField = 'date' | 'amount' | 'category';
type SortOrder = 'asc' | 'desc';

const ITEMS_PER_PAGE = 10;

export function TransactionTable() {
  const role = useStore((s) => s.role);
  const editTransaction = useStore((s) => s.editTransaction);
  const deleteTransaction = useStore((s) => s.deleteTransaction);
  const filters = useStore((s) => s.filters);
  const setSearchQuery = useStore((s) => s.setSearchQuery);
  const setType = useStore((s) => s.setType);
  const setStatus = useStore((s) => s.setStatus);
  const setCategories = useStore((s) => s.setCategories);
  const resetFilters = useStore((s) => s.resetFilters);

  const filtered = useFilteredTransactions();

  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [page, setPage] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [editingStatusId, setEditingStatusId] = useState<string | null>(null);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case 'date':
          cmp = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case 'amount':
          cmp = a.amount - b.amount;
          break;
        case 'category':
          cmp = a.category.localeCompare(b.category);
          break;
      }
      return sortOrder === 'asc' ? cmp : -cmp;
    });
  }, [filtered, sortField, sortOrder]);

  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE);
  const paginated = sorted.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder((p) => (p === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
    setPage(1);
  };

  const handleExport = () => {
    const data = filtered.map((t) => ({
      Date: formatDate(t.date),
      Merchant: t.merchant,
      Description: t.description,
      Category: t.category,
      Type: t.type,
      Amount: t.amount,
      Status: t.status,
    }));
    exportToCSV(data, `transactions-export-${new Date().toISOString().slice(0, 10)}`);
  };

  const handleDelete = (id: string) => {
    deleteTransaction(id);
    setDeleteConfirm(null);
  };

  const handleStatusChange = (id: string, newStatus: TransactionStatus) => {
    editTransaction(id, { status: newStatus });
    setEditingStatusId(null);
  };

  const toggleCategory = (cat: TransactionCategory) => {
    const current = filters.categories;
    if (current.includes(cat)) {
      setCategories(current.filter((c) => c !== cat));
    } else {
      setCategories([...current, cat]);
    }
    setPage(1);
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ChevronUp className="h-3 w-3 text-slate-300" />;
    return sortOrder === 'asc'
      ? <ChevronUp className="h-3 w-3 text-emerald-500" />
      : <ChevronDown className="h-3 w-3 text-emerald-500" />;
  };

  const statusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />;
      case 'pending': return <Clock className="h-3.5 w-3.5 text-amber-500" />;
      case 'failed': return <XCircle className="h-3.5 w-3.5 text-rose-500" />;
    }
  };

  const hasActiveFilters = filters.categories.length > 0 || filters.type !== 'all' || filters.status !== 'all' || filters.searchQuery.trim() !== '';

  return (
    <div className="space-y-4">
      {/* Search & Filters Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search merchants, descriptions..."
            value={filters.searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-emerald-500"
          />
          {filters.searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="h-4 w-4 text-slate-400 hover:text-slate-600" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              'flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all',
              showFilters || hasActiveFilters
                ? 'border-emerald-300 bg-emerald-50 text-emerald-600 dark:border-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
                : 'border-slate-200 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
            )}
          >
            <Filter className="h-4 w-4" />
            Filters
            {hasActiveFilters && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white">
                {(filters.categories.length > 0 ? 1 : 0) + (filters.type !== 'all' ? 1 : 0) + (filters.status !== 'all' ? 1 : 0)}
              </span>
            )}
          </button>

          {role === 'admin' && (
            <button
              onClick={handleExport}
              className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition-all dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <FileDown className="h-4 w-4" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="rounded-2xl border border-slate-200/50 bg-white p-4 dark:border-slate-700/50 dark:bg-slate-800/50">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {/* Type Filter */}
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Type</label>
                  <div className="mt-2 flex gap-1">
                    {['all', 'income', 'expense'].map((t) => (
                      <button
                        key={t}
                        onClick={() => { setType(t as typeof filters.type); setPage(1); }}
                        className={cn(
                          'flex-1 rounded-lg px-3 py-2 text-xs font-medium capitalize transition-all',
                          filters.type === t
                            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-400 dark:hover:bg-slate-600'
                        )}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Status</label>
                  <div className="mt-2 flex gap-1">
                    {['all', 'completed', 'pending', 'failed'].map((s) => (
                      <button
                        key={s}
                        onClick={() => { setStatus(s as typeof filters.status); setPage(1); }}
                        className={cn(
                          'flex-1 rounded-lg px-2 py-2 text-xs font-medium capitalize transition-all',
                          filters.status === s
                            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-400 dark:hover:bg-slate-600'
                        )}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date Range */}
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Date Range</label>
                  <div className="mt-2 flex gap-2">
                    <input
                      type="date"
                      value={filters.dateRange.from || ''}
                      onChange={(e) => { useStore.getState().setDateRange(e.target.value || null, filters.dateRange.to); setPage(1); }}
                      className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    />
                    <input
                      type="date"
                      value={filters.dateRange.to || ''}
                      onChange={(e) => { useStore.getState().setDateRange(filters.dateRange.from, e.target.value || null); setPage(1); }}
                      className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    />
                  </div>
                </div>
              </div>

              {/* Category chips */}
              <div className="mt-4">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Categories</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {TRANSACTION_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => toggleCategory(cat)}
                      className={cn(
                        'rounded-full px-3 py-1.5 text-xs font-medium transition-all',
                        filters.categories.includes(cat)
                          ? 'text-white shadow-md'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-400 dark:hover:bg-slate-600'
                      )}
                      style={
                        filters.categories.includes(cat)
                          ? { backgroundColor: CATEGORY_COLORS[cat] }
                          : undefined
                      }
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {hasActiveFilters && (
                <button
                  onClick={() => { resetFilters(); setPage(1); }}
                  className="mt-4 text-xs font-medium text-rose-500 hover:text-rose-600 transition-colors"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <div className="rounded-2xl border border-slate-200/50 bg-white shadow-sm overflow-hidden dark:border-slate-700/50 dark:bg-slate-800/50">
        {paginated.length === 0 ? (
          <EmptyState onClear={() => { resetFilters(); setPage(1); }} />
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-700/50">
                    <th className="px-6 py-4 text-left">
                      <button onClick={() => handleSort('date')} className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                        Date <SortIcon field="date" />
                      </button>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Merchant
                    </th>
                    <th className="px-6 py-4 text-left">
                      <button onClick={() => handleSort('category')} className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                        Category <SortIcon field="category" />
                      </button>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Type</th>
                    <th className="px-6 py-4 text-right">
                      <button onClick={() => handleSort('amount')} className="ml-auto flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                        Amount <SortIcon field="amount" />
                      </button>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Status</th>
                    {role === 'admin' && (
                      <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((txn, i) => (
                    <motion.tr
                      key={txn.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b border-slate-50 transition-colors hover:bg-slate-50/50 dark:border-slate-800 dark:hover:bg-slate-700/20"
                    >
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{formatDate(txn.date)}</td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-slate-800 dark:text-white">{txn.merchant}</p>
                          <p className="text-xs text-slate-400 truncate max-w-[200px]">{txn.description}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className="inline-flex rounded-full px-2.5 py-1 text-xs font-medium"
                          style={{
                            backgroundColor: `${CATEGORY_COLORS[txn.category]}15`,
                            color: CATEGORY_COLORS[txn.category],
                          }}
                        >
                          {txn.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold',
                          txn.type === 'income'
                            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
                            : 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400'
                        )}>
                          {txn.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={cn(
                          'text-sm font-semibold',
                          txn.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'
                        )}>
                          {txn.type === 'income' ? '+' : '-'}{formatCurrency(txn.amount)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium capitalize text-slate-500">
                          {statusIcon(txn.status)} {txn.status}
                        </span>
                      </td>
                      {role === 'admin' && (
                        <td className="px-6 py-4 text-right">
                          <div className="relative flex items-center justify-end gap-1">
                            {/* Edit button with status dropdown */}
                            <div className="relative">
                              <button
                                className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-200"
                                onClick={() => setEditingStatusId(editingStatusId === txn.id ? null : txn.id)}
                                aria-label="Edit transaction status"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </button>
                              {/* Status dropdown */}
                              <AnimatePresence>
                                {editingStatusId === txn.id && (
                                  <motion.div
                                    initial={{ opacity: 0, y: -4, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -4, scale: 0.95 }}
                                    transition={{ duration: 0.12 }}
                                    className="absolute right-0 top-full z-50 mt-1 w-40 overflow-hidden rounded-xl border border-slate-200/50 bg-white shadow-xl dark:border-slate-600 dark:bg-slate-700"
                                  >
                                    <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-600">
                                      Change Status
                                    </p>
                                    {(['completed', 'pending', 'failed'] as TransactionStatus[]).map((s) => (
                                      <button
                                        key={s}
                                        onClick={() => handleStatusChange(txn.id, s)}
                                        className={cn(
                                          'flex w-full items-center gap-2 px-3 py-2.5 text-xs font-medium capitalize transition-colors',
                                          'hover:bg-slate-50 dark:hover:bg-slate-600',
                                          txn.status === s && 'bg-slate-50 dark:bg-slate-600'
                                        )}
                                      >
                                        {statusIcon(s)}
                                        <span className="text-slate-700 dark:text-slate-200">{s}</span>
                                        {txn.status === s && (
                                          <span className="ml-auto text-[10px] text-emerald-500 font-bold">Current</span>
                                        )}
                                      </button>
                                    ))}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                            <button
                              className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
                              onClick={() => setDeleteConfirm(txn.id)}
                              aria-label="Delete transaction"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      )}
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List */}
            <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-700/50">
              {paginated.map((txn) => (
                <div key={txn.id} className="flex items-center gap-3 p-4">
                  <div
                    className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl"
                    style={{ backgroundColor: `${CATEGORY_COLORS[txn.category]}15` }}
                  >
                    <span className="text-xs font-bold" style={{ color: CATEGORY_COLORS[txn.category] }}>
                      {txn.category.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 dark:text-white truncate">{txn.merchant}</p>
                    <p className="text-xs text-slate-400">{formatDate(txn.date)} · {txn.category}</p>
                  </div>
                  <div className="text-right">
                    <p className={cn(
                      'text-sm font-semibold',
                      txn.type === 'income' ? 'text-emerald-600' : 'text-slate-900 dark:text-white'
                    )}>
                      {txn.type === 'income' ? '+' : '-'}{formatCurrency(txn.amount)}
                    </p>
                    <span className="inline-flex items-center gap-1 text-[10px]">
                      {statusIcon(txn.status)} {txn.status}
                    </span>
                  </div>
                  {role === 'admin' && (
                    <button
                      className="rounded-lg p-2 text-slate-400 hover:text-rose-500"
                      onClick={() => setDeleteConfirm(txn.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Showing {(page - 1) * ITEMS_PER_PAGE + 1}-{Math.min(page * ITEMS_PER_PAGE, sorted.length)} of {sorted.length}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition-all hover:bg-slate-50 disabled:opacity-30 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-xl text-sm font-medium transition-all',
                    page === pageNum
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                      : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                  )}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition-all hover:bg-slate-50 disabled:opacity-30 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-800"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 dark:bg-rose-500/10 mx-auto">
                <AlertCircle className="h-6 w-6 text-rose-500" />
              </div>
              <h3 className="mt-4 text-center text-lg font-semibold text-slate-900 dark:text-white">
                Delete Transaction
              </h3>
              <p className="mt-2 text-center text-sm text-slate-500">
                Are you sure? This action cannot be undone.
              </p>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 rounded-xl bg-rose-500 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-rose-600 shadow-lg shadow-rose-500/20"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-700/50">
        <Search className="h-7 w-7 text-slate-400" />
      </div>
      <h3 className="mt-4 text-base font-semibold text-slate-700 dark:text-slate-200">
        No transactions found
      </h3>
      <p className="mt-1 text-sm text-slate-400 text-center max-w-xs">
        Try adjusting your filters or search query to find what you are looking for.
      </p>
      <button
        onClick={onClear}
        className="mt-4 rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-emerald-600 shadow-lg shadow-emerald-500/20"
      >
        Clear Filters
      </button>
    </div>
  );
}
