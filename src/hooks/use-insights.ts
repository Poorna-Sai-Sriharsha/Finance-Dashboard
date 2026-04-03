import { useMemo } from 'react';
import { useStore } from '@/store';
import { Transaction, TransactionCategory, CATEGORY_COLORS, InsightData } from '@/types';
import { getMonthYear } from '@/lib/utils';

export function useInsights() {
  const transactions = useStore((s) => s.transactions);

  return useMemo(() => {
    const now = new Date();
    const currentMonth = getMonthYear(now.toISOString());
    const prevDate = new Date(now);
    prevDate.setMonth(prevDate.getMonth() - 1);
    const previousMonth = getMonthYear(prevDate.toISOString());

    const completedExpenses = transactions.filter(
      (t) => t.type === 'expense' && t.status !== 'failed'
    );

    const totalExpenses = completedExpenses.reduce((sum, t) => sum + t.amount, 0);

    // Top spending category
    const catMap = new Map<TransactionCategory, number>();
    completedExpenses.forEach((t) => {
      catMap.set(t.category, (catMap.get(t.category) || 0) + t.amount);
    });
    const sortedCats = Array.from(catMap.entries()).sort((a, b) => b[1] - a[1]);
    const topCategory = sortedCats[0]
      ? {
          name: sortedCats[0][0],
          amount: Math.round(sortedCats[0][1] * 100) / 100,
          percentage: totalExpenses > 0 ? Math.round((sortedCats[0][1] / totalExpenses) * 100) : 0,
        }
      : { name: 'Food & Dining' as TransactionCategory, amount: 0, percentage: 0 };

    // Biggest single transaction
    const biggestTransaction = [...completedExpenses].sort((a, b) => b.amount - a.amount)[0] || null;

    // Average daily spend
    const currentMonthExpenses = completedExpenses.filter(
      (t) => getMonthYear(t.date) === currentMonth
    );
    const prevMonthExpenses = completedExpenses.filter(
      (t) => getMonthYear(t.date) === previousMonth
    );

    const daysInCurrentMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const daysSoFar = now.getDate();
    const currentDailyAvg =
      daysSoFar > 0
        ? currentMonthExpenses.reduce((sum, t) => sum + t.amount, 0) / daysSoFar
        : 0;

    const prevDaysInMonth = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    const prevDailyAvg =
      prevDaysInMonth > 0
        ? prevMonthExpenses.reduce((sum, t) => sum + t.amount, 0) / prevDaysInMonth
        : 0;

    // Pending transactions
    const pendingTxns = transactions.filter((t) => t.status === 'pending');
    const pendingTransactions = {
      count: pendingTxns.length,
      total: Math.round(pendingTxns.reduce((sum, t) => sum + t.amount, 0) * 100) / 100,
    };

    // Month-over-month by category comparison
    const currentCatData = new Map<TransactionCategory, number>();
    const prevCatData = new Map<TransactionCategory, number>();

    currentMonthExpenses.forEach((t) => {
      currentCatData.set(t.category, (currentCatData.get(t.category) || 0) + t.amount);
    });
    prevMonthExpenses.forEach((t) => {
      prevCatData.set(t.category, (prevCatData.get(t.category) || 0) + t.amount);
    });

    const allCats = new Set([...currentCatData.keys(), ...prevCatData.keys()]);
    const monthComparison = Array.from(allCats).map((cat) => ({
      category: cat,
      current: Math.round(currentCatData.get(cat) || 0),
      previous: Math.round(prevCatData.get(cat) || 0),
      color: CATEGORY_COLORS[cat],
    }));

    // Income vs Expense ratio (last 3 months)
    const incomeExpenseRatio = [];
    for (let i = 2; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const mk = getMonthYear(d.toISOString());
      const mn = d.toLocaleDateString('en-US', { month: 'short' });

      const monthTxns = transactions.filter(
        (t) => getMonthYear(t.date) === mk && t.status !== 'failed'
      );
      const inc = monthTxns.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
      const exp = monthTxns.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

      incomeExpenseRatio.push({
        month: mn,
        income: Math.round(inc),
        expenses: Math.round(exp),
      });
    }

    // Spending streak for Food & Dining
    const foodTxns = completedExpenses
      .filter((t) => t.category === 'Food & Dining')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    let streak = 0;
    if (foodTxns.length > 0) {
      const seenDates = new Set<string>();
      foodTxns.forEach((t) => {
        seenDates.add(new Date(t.date).toDateString());
      });
      const today = new Date();
      for (let i = 0; i < 30; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(checkDate.getDate() - i);
        if (seenDates.has(checkDate.toDateString())) {
          streak++;
        } else if (i > 0) {
          break;
        }
      }
    }

    return {
      topCategory,
      biggestTransaction,
      avgDailySpend: {
        current: Math.round(currentDailyAvg * 100) / 100,
        previous: Math.round(prevDailyAvg * 100) / 100,
      },
      pendingTransactions,
      monthComparison,
      incomeExpenseRatio,
      spendingStreak: streak,
      categoryBreakdown: sortedCats.map(([cat, amount]) => ({
        category: cat,
        amount: Math.round(amount * 100) / 100,
        percentage: totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0,
        color: CATEGORY_COLORS[cat],
      })),
    };
  }, [transactions]);
}
