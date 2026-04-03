'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { InsightsGrid } from '@/components/insights/insights-grid';
import { PageSkeleton } from '@/components/ui/skeleton';

export default function InsightsPage() {
  const [loading, setLoading] = useState(true);

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
          Insights
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Understand your spending patterns and financial habits.
        </p>
      </div>

      {/* Insights Grid */}
      <InsightsGrid />
    </motion.div>
  );
}
