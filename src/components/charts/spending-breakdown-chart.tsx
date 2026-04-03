'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Sector,
} from 'recharts';
import { CategoryBreakdown } from '@/types';
import { formatCurrency, cn } from '@/lib/utils';

interface SpendingBreakdownChartProps {
  data: CategoryBreakdown[];
  onCategoryClick?: (category: string) => void;
}

export function SpendingBreakdownChart({ data, onCategoryClick }: SpendingBreakdownChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const renderActiveShape = (props: Record<string, unknown>) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props as {
      cx: number; cy: number; innerRadius: number; outerRadius: number;
      startAngle: number; endAngle: number; fill: string;
    };

    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={(outerRadius as number) + 6}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))' }}
        />
      </g>
    );
  };

  const total = data.reduce((sum, d) => sum + d.amount, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className="rounded-2xl border border-slate-200/50 bg-white p-6 shadow-sm dark:border-slate-700/50 dark:bg-slate-800/50"
    >
      <h3 className="text-base font-semibold text-slate-900 dark:text-white">
        Spending Breakdown
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400">By category</p>

      <div className="mt-4 flex flex-col items-center gap-4 xl:flex-row">
        <div className="relative h-[200px] w-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                dataKey="amount"
                nameKey="category"
                paddingAngle={2}
                animationDuration={1000}
                animationBegin={400}
                // @ts-ignore - Recharts Pie activeIndex is not typed properly in this version
                activeIndex={activeIndex !== null ? activeIndex : undefined}
                activeShape={renderActiveShape as unknown as ((props: unknown) => React.ReactElement)}
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                onClick={(_, index) => onCategoryClick?.(data[index].category)}
                style={{ cursor: 'pointer' }}
              >
                {data.map((entry) => (
                  <Cell key={entry.category} fill={entry.color} strokeWidth={0} />
                ))}
              </Pie>
              <Tooltip
                position={{ x: 220, y: 10 }}
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const d = payload[0].payload as CategoryBreakdown;
                  return (
                    <div className="rounded-xl border border-slate-200/50 bg-white px-4 py-3 shadow-xl dark:border-slate-600 dark:bg-slate-700">
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-300">{d.category}</p>
                      <p className="mt-1 text-base font-bold text-slate-900 dark:text-white">
                        {formatCurrency(d.amount)}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-400">{d.percentage}% of total</p>
                    </div>
                  );
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <p className="text-xs text-slate-400">Total</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">
              {formatCurrency(total)}
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-2 w-full">
          {data.slice(0, 6).map((entry, i) => (
            <motion.button
              key={entry.category}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.05 }}
              onClick={() => onCategoryClick?.(entry.category)}
              onMouseEnter={() => setActiveIndex(i)}
              onMouseLeave={() => setActiveIndex(null)}
              className={cn(
                'flex w-full items-center gap-3 rounded-xl px-3 py-2 transition-all',
                'hover:bg-slate-50 dark:hover:bg-slate-700/30',
                activeIndex === i && 'bg-slate-50 dark:bg-slate-700/30'
              )}
            >
              <div
                className="h-3 w-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: entry.color }}
              />
              <span className="flex-1 text-left text-sm text-slate-600 dark:text-slate-300 truncate">
                {entry.category}
              </span>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                {entry.percentage}%
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
