'use client';

import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Crown,
  Calendar,
  AlertTriangle,
  Flame,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { useInsights } from '@/hooks/use-insights';
import { formatCurrency, calculatePercentageChange, cn } from '@/lib/utils';
import { CATEGORY_COLORS, TransactionCategory } from '@/types';

export function InsightsGrid() {
  const insights = useInsights();

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
    }),
  };

  const dailyChange = calculatePercentageChange(
    insights.avgDailySpend.current,
    insights.avgDailySpend.previous
  );

  return (
    <div className="space-y-6">
      {/* Top Row — Key Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Top Spending Category */}
        <motion.div
          custom={0}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className="relative overflow-hidden rounded-2xl border border-slate-200/50 bg-white p-6 shadow-sm dark:border-slate-700/50 dark:bg-slate-800/50"
        >
          <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-gradient-to-br from-orange-400/20 to-rose-400/20 blur-xl" />
          <div className="relative">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 dark:bg-orange-500/10">
                <Crown className="h-4 w-4 text-orange-500" />
              </div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Top Spending Category
              </p>
            </div>
            <h3 className="mt-3 text-xl font-bold text-slate-900 dark:text-white">
              {insights.topCategory.name}
            </h3>
            <p className="mt-1 text-2xl font-extrabold" style={{ color: CATEGORY_COLORS[insights.topCategory.name] }}>
              {formatCurrency(insights.topCategory.amount)}
            </p>
            {/* Progress bar */}
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>{insights.topCategory.percentage}% of total spending</span>
              </div>
              <div className="mt-1 h-2 rounded-full bg-slate-100 dark:bg-slate-700">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${insights.topCategory.percentage}%` }}
                  transition={{ delay: 0.5, duration: 1, ease: 'easeOut' }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: CATEGORY_COLORS[insights.topCategory.name] }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Biggest Transaction */}
        <motion.div
          custom={1}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className="relative overflow-hidden rounded-2xl border border-slate-200/50 bg-white p-6 shadow-sm dark:border-slate-700/50 dark:bg-slate-800/50"
        >
          <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-gradient-to-br from-purple-400/20 to-indigo-400/20 blur-xl" />
          <div className="relative">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 dark:bg-purple-500/10">
                <DollarSign className="h-4 w-4 text-purple-500" />
              </div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Biggest Transaction
              </p>
            </div>
            {insights.biggestTransaction ? (
              <>
                <h3 className="mt-3 text-xl font-bold text-slate-900 dark:text-white">
                  {insights.biggestTransaction.merchant}
                </h3>
                <p className="mt-1 text-2xl font-extrabold text-purple-600 dark:text-purple-400">
                  {formatCurrency(insights.biggestTransaction.amount)}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  {insights.biggestTransaction.category} ·{' '}
                  {new Date(insights.biggestTransaction.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </>
            ) : (
              <p className="mt-3 text-sm text-slate-400">No transactions yet</p>
            )}
          </div>
        </motion.div>

        {/* Average Daily Spend */}
        <motion.div
          custom={2}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className="relative overflow-hidden rounded-2xl border border-slate-200/50 bg-white p-6 shadow-sm dark:border-slate-700/50 dark:bg-slate-800/50"
        >
          <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-gradient-to-br from-cyan-400/20 to-blue-400/20 blur-xl" />
          <div className="relative">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-50 dark:bg-cyan-500/10">
                <Calendar className="h-4 w-4 text-cyan-500" />
              </div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Average Daily Spend
              </p>
            </div>
            <h3 className="mt-3 text-2xl font-extrabold text-slate-900 dark:text-white">
              {formatCurrency(insights.avgDailySpend.current)}
            </h3>
            <div className="mt-2 flex items-center gap-1.5">
              <div
                className={cn(
                  'flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold',
                  dailyChange <= 0
                    ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
                    : 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400'
                )}
              >
                {dailyChange <= 0 ? (
                  <ArrowDownRight className="h-3 w-3" />
                ) : (
                  <ArrowUpRight className="h-3 w-3" />
                )}
                {Math.abs(dailyChange)}%
              </div>
              <span className="text-xs text-slate-400">vs last month ({formatCurrency(insights.avgDailySpend.previous)})</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Month-over-Month Comparison */}
        <motion.div
          custom={3}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className="rounded-2xl border border-slate-200/50 bg-white p-6 shadow-sm dark:border-slate-700/50 dark:bg-slate-800/50"
        >
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            Month-over-Month Comparison
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Current vs previous month by category
          </p>
          <div className="mt-4 h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={insights.monthComparison} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148,163,184,0.1)" />
                <XAxis
                  dataKey="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#94a3b8' }}
                  angle={-20}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  tickFormatter={(v: number) => `₹${v}`}
                  width={50}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(148, 163, 184, 0.1)' }}
                  content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null;
                    return (
                      <div className="rounded-xl border border-slate-200/50 bg-white px-4 py-3 shadow-xl dark:border-slate-600 dark:bg-slate-700">
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-300 mb-1">{label}</p>
                        {payload.map((p) => (
                          <p key={p.dataKey as string} className="text-sm text-slate-700 dark:text-slate-200">
                            <span className="font-semibold" style={{ color: p.color }}>
                              {p.dataKey === 'current' ? 'This month' : 'Last month'}:
                            </span>{' '}
                            {formatCurrency(p.value as number)}
                          </p>
                        ))}
                      </div>
                    );
                  }}
                />
                <Bar dataKey="previous" fill="#94a3b8" radius={[4, 4, 0, 0]} barSize={16} opacity={0.4} name="Last Month" />
                <Bar dataKey="current" fill="#22c55e" radius={[4, 4, 0, 0]} barSize={16} name="This Month" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Income vs Expense Ratio */}
        <motion.div
          custom={4}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className="rounded-2xl border border-slate-200/50 bg-white p-6 shadow-sm dark:border-slate-700/50 dark:bg-slate-800/50"
        >
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            Income vs Expenses
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Last 3 months comparison
          </p>
          <div className="mt-4 h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={insights.incomeExpenseRatio} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148,163,184,0.1)" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  tickFormatter={(v: number) => `₹${(v / 1000).toFixed(0)}k`}
                  width={50}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(148, 163, 184, 0.1)' }}
                  content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null;
                    return (
                      <div className="rounded-xl border border-slate-200/50 bg-white px-4 py-3 shadow-xl dark:border-slate-600 dark:bg-slate-700">
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-300 mb-1">{label}</p>
                        {payload.map((p) => (
                          <p key={p.dataKey as string} className="text-sm text-slate-700 dark:text-slate-200">
                            <span className="font-semibold" style={{ color: p.color }}>
                              {p.dataKey === 'income' ? 'Income' : 'Expenses'}:
                            </span>{' '}
                            {formatCurrency(p.value as number)}
                          </p>
                        ))}
                      </div>
                    );
                  }}
                />
                <Bar dataKey="income" fill="#22c55e" radius={[4, 4, 0, 0]} barSize={24} />
                <Bar dataKey="expenses" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Pending Transactions */}
        <motion.div
          custom={5}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className="relative overflow-hidden rounded-2xl border border-amber-200/50 bg-gradient-to-br from-amber-50 to-orange-50 p-6 shadow-sm dark:border-amber-800/30 dark:from-amber-900/20 dark:to-orange-900/20"
        >
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-500/20">
              <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
            <p className="text-sm font-medium text-amber-700 dark:text-amber-300">
              Pending Transactions
            </p>
          </div>
          <div className="mt-3 flex items-baseline gap-3">
            <h3 className="text-3xl font-extrabold text-amber-700 dark:text-amber-300">
              {insights.pendingTransactions.count}
            </h3>
            <span className="text-sm text-amber-600/70 dark:text-amber-400/70">
              transactions
            </span>
          </div>
          <p className="mt-1 text-lg font-bold text-amber-800 dark:text-amber-200">
            {formatCurrency(insights.pendingTransactions.total)}
          </p>
          <p className="mt-1 text-xs text-amber-600/60 dark:text-amber-400/60">
            Total value awaiting processing
          </p>
        </motion.div>

        {/* Spending Streak */}
        <motion.div
          custom={6}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className="relative overflow-hidden rounded-2xl border border-slate-200/50 bg-white p-6 shadow-sm dark:border-slate-700/50 dark:bg-slate-800/50"
        >
          <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-gradient-to-br from-red-400/20 to-orange-400/20 blur-xl" />
          <div className="relative">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 dark:bg-red-500/10">
                <Flame className="h-4 w-4 text-red-500" />
              </div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Spending Streak
              </p>
            </div>
            <h3 className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-white">
              {insights.spendingStreak} {insights.spendingStreak === 1 ? 'day' : 'days'}
            </h3>
            <p className="mt-1 text-sm text-slate-400">
              Consecutive days with Food & Dining purchases
            </p>
            <div className="mt-2 flex gap-0.5">
              {Array.from({ length: 7 }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    'h-2 flex-1 rounded-full',
                    i < insights.spendingStreak
                      ? 'bg-gradient-to-r from-red-400 to-orange-400'
                      : 'bg-slate-100 dark:bg-slate-700'
                  )}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Category Distribution mini */}
        <motion.div
          custom={7}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className="rounded-2xl border border-slate-200/50 bg-white p-6 shadow-sm dark:border-slate-700/50 dark:bg-slate-800/50"
        >
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-500/10">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            </div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Category Distribution
            </p>
          </div>
          <div className="mt-4 space-y-2.5">
            {insights.categoryBreakdown.slice(0, 4).map((cat, i) => (
              <div key={cat.category} className="flex items-center gap-3">
                <div
                  className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="flex-1 text-sm text-slate-600 dark:text-slate-300 truncate">
                  {cat.category}
                </span>
                <span className="text-sm font-semibold text-slate-800 dark:text-white">
                  {cat.percentage}%
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
