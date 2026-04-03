'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { MonthlyData } from '@/types';
import { formatCurrency, cn } from '@/lib/utils';

interface BalanceTrendChartProps {
  data: MonthlyData[];
}

type ChartView = 'balance' | 'income' | 'expenses';

const viewConfig: Record<ChartView, { label: string; color: string; gradient: string[] }> = {
  balance: { label: 'Balance', color: '#6366f1', gradient: ['#818cf8', '#4f46e5'] },
  income: { label: 'Income', color: '#22c55e', gradient: ['#4ade80', '#16a34a'] },
  expenses: { label: 'Expenses', color: '#ef4444', gradient: ['#f87171', '#dc2626'] },
};

export function BalanceTrendChart({ data }: BalanceTrendChartProps) {
  const [view, setView] = useState<ChartView>('balance');
  const config = viewConfig[view];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="rounded-2xl border border-slate-200/50 bg-white p-6 shadow-sm dark:border-slate-700/50 dark:bg-slate-800/50"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            Balance Trend
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Last 6 months overview
          </p>
        </div>
        <div className="flex gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-700/50">
          {(Object.keys(viewConfig) as ChartView[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={cn(
                'relative rounded-lg px-3 py-1.5 text-xs font-medium transition-all',
                v === view
                  ? 'text-white'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              )}
            >
              {v === view && (
                <motion.div
                  layoutId="chart-tab"
                  className="absolute inset-0 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10">{viewConfig[v].label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={`gradient-${view}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={config.gradient[0]} stopOpacity={0.3} />
                <stop offset="100%" stopColor={config.gradient[1]} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="var(--grid-color, rgba(148,163,184,0.1))"
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#94a3b8' }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#94a3b8' }}
              tickFormatter={(v: number) => `₹${(v / 1000).toFixed(0)}k`}
              width={50}
            />
            <Tooltip
              cursor={{ stroke: '#94a3b8', strokeWidth: 1, strokeDasharray: '3 3' }}
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                return (
                  <div className="rounded-xl border border-slate-200/50 bg-white px-4 py-3 shadow-xl dark:border-slate-600 dark:bg-slate-700">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-300">{label}</p>
                    <p className="mt-1 text-lg font-bold" style={{ color: config.color }}>
                      {formatCurrency(payload[0].value as number)}
                    </p>
                  </div>
                );
              }}
            />
            <Area
              type="monotone"
              dataKey={view}
              stroke={config.color}
              strokeWidth={2.5}
              fill={`url(#gradient-${view})`}
              animationDuration={1200}
              animationBegin={300}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
