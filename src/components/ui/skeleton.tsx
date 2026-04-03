'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

export function Skeleton({ className, style }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700/50',
        className
      )}
      style={style}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200/10 bg-white p-6 dark:bg-slate-800/50">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-10 rounded-xl" />
      </div>
      <Skeleton className="mt-4 h-8 w-32" />
      <Skeleton className="mt-3 h-3 w-20" />
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200/10 bg-white p-6 dark:bg-slate-800/50">
      <Skeleton className="h-5 w-40" />
      <Skeleton className="mt-2 h-3 w-56" />
      <div className="mt-6 flex items-end gap-2">
        {[40, 65, 45, 80, 55, 70].map((h, i) => (
          <Skeleton key={i} className="flex-1" style={{ height: `${h}%`, minHeight: `${h * 2}px` } as React.CSSProperties} />
        ))}
      </div>
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200/10 bg-white p-6 dark:bg-slate-800/50">
      <Skeleton className="h-5 w-40 mb-6" />
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 py-4 border-b border-slate-100 dark:border-slate-700/50 last:border-0">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-4 w-20" />
        </div>
      ))}
    </div>
  );
}

export function PageSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 p-6"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <ChartSkeleton />
        </div>
        <div className="lg:col-span-3">
          <ChartSkeleton />
        </div>
      </div>
    </motion.div>
  );
}
