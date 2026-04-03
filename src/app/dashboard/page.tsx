'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDashboardStats } from '@/hooks/use-dashboard-stats';
import { SummaryCard } from '@/components/dashboard/summary-card';
import { BalanceTrendChart } from '@/components/charts/balance-trend-chart';
import { SpendingBreakdownChart } from '@/components/charts/spending-breakdown-chart';
import { RecentTransactions } from '@/components/dashboard/recent-transactions';
import { PageSkeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const stats = useDashboardStats();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <PageSkeleton />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 p-4 md:p-6"
    >
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Welcome back! Here&apos;s your financial overview.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Total Balance"
          value={stats.totalBalance}
          change={stats.balanceChange}
          type="balance"
          index={0}
        />
        <SummaryCard
          title="Total Income"
          value={stats.currentIncome}
          change={stats.incomeChange}
          type="income"
          index={1}
        />
        <SummaryCard
          title="Total Expenses"
          value={stats.currentExpenses}
          change={stats.expenseChange}
          type="expense"
          index={2}
        />
        <SummaryCard
          title="Savings Rate"
          value={stats.savingsRate}
          change={stats.savingsChange}
          type="savings"
          index={3}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <BalanceTrendChart data={stats.monthlyData} />
        </div>
        <div className="lg:col-span-3">
          <SpendingBreakdownChart data={stats.categoryBreakdown} />
        </div>
      </div>

      {/* Recent Transactions */}
      <RecentTransactions transactions={stats.recentTransactions} />
    </motion.div>
  );
}
