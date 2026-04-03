import { useMemo } from 'react';
import { useStore } from '@/store';
import { Transaction } from '@/types';

export function useFilteredTransactions(): Transaction[] {
  const transactions = useStore((s) => s.transactions);
  const filters = useStore((s) => s.filters);

  return useMemo(() => {
    let filtered = [...transactions];

    // Date range filter
    if (filters.dateRange.from) {
      const from = new Date(filters.dateRange.from);
      filtered = filtered.filter((t) => new Date(t.date) >= from);
    }
    if (filters.dateRange.to) {
      const to = new Date(filters.dateRange.to);
      to.setHours(23, 59, 59, 999);
      filtered = filtered.filter((t) => new Date(t.date) <= to);
    }

    // Category filter
    if (filters.categories.length > 0) {
      filtered = filtered.filter((t) => filters.categories.includes(t.category));
    }

    // Type filter
    if (filters.type !== 'all') {
      filtered = filtered.filter((t) => t.type === filters.type);
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter((t) => t.status === filters.status);
    }

    // Search filter
    if (filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.merchant.toLowerCase().includes(query) ||
          t.description.toLowerCase().includes(query) ||
          t.category.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [transactions, filters]);
}
