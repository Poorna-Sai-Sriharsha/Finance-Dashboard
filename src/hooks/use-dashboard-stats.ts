import { useMemo } from 'react';
import { useStore } from '@/store';
import { MonthlyData, CategoryBreakdown, TransactionCategory, CATEGORY_COLORS } from '@/types';
import { calculatePercentageChange, getMonthYear } from '@/lib/utils';

export function useDashboardStats() {
  const transactions = useStore((s) => s.transactions);

  return useMemo(() => {
    const now = new Date();
    const currentMonth = getMonthYear(now.toISOString());
    const prevDate = new Date(now);
    prevDate.setMonth(prevDate.getMonth() - 1);
    const previousMonth = getMonthYear(prevDate.toISOString());

    // Current month transactions
    const currentMonthTxns = transactions.filter(
      (t) => getMonthYear(t.date) === currentMonth && t.status === 'completed'
    );
    const previousMonthTxns = transactions.filter(
      (t) => getMonthYear(t.date) === previousMonth && t.status === 'completed'
    );

    // Totals
    const currentIncome = currentMonthTxns
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const currentExpenses = currentMonthTxns
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const previousIncome = previousMonthTxns
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const previousExpenses = previousMonthTxns
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalIncome = transactions
      .filter((t) => t.type === 'income' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions
      .filter((t) => t.type === 'expense' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalBalance = totalIncome - totalExpenses;

    const savingsRate = currentIncome > 0
      ? Math.round(((currentIncome - currentExpenses) / currentIncome) * 100)
      : 0;

    const previousSavingsRate = previousIncome > 0
      ? Math.round(((previousIncome - previousExpenses) / previousIncome) * 100)
      : 0;

    // Monthly data for charts (last 6 months)
    const monthlyData: MonthlyData[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const monthKey = getMonthYear(d.toISOString());
      const monthName = d.toLocaleDateString('en-US', { month: 'short' });

      const monthTxns = transactions.filter(
        (t) => getMonthYear(t.date) === monthKey && t.status === 'completed'
      );
      const income = monthTxns
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      const expenses = monthTxns
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      monthlyData.push({
        month: monthName,
        income: Math.round(income),
        expenses: Math.round(expenses),
        balance: Math.round(income - expenses),
      });
    }

    // Spending breakdown by category
    const categoryMap = new Map<TransactionCategory, number>();
    transactions
      .filter((t) => t.type === 'expense' && t.status === 'completed')
      .forEach((t) => {
        categoryMap.set(t.category, (categoryMap.get(t.category) || 0) + t.amount);
      });

    const categoryBreakdown: CategoryBreakdown[] = Array.from(categoryMap.entries())
      .map(([category, amount]) => ({
        category,
        amount: Math.round(amount * 100) / 100,
        percentage: Math.round((amount / totalExpenses) * 100),
        color: CATEGORY_COLORS[category],
      }))
      .sort((a, b) => b.amount - a.amount);

    // Recent transactions
    const recentTransactions = [...transactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);

    return {
      totalBalance,
      currentIncome,
      currentExpenses,
      savingsRate,
      incomeChange: calculatePercentageChange(currentIncome, previousIncome),
      expenseChange: calculatePercentageChange(currentExpenses, previousExpenses),
      balanceChange: calculatePercentageChange(
        currentIncome - currentExpenses,
        previousIncome - previousExpenses
      ),
      savingsChange: savingsRate - previousSavingsRate,
      monthlyData,
      categoryBreakdown,
      recentTransactions,
    };
  }, [transactions]);
}
