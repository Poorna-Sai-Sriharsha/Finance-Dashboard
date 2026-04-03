export type TransactionType = 'income' | 'expense';
export type TransactionStatus = 'completed' | 'pending' | 'failed';
export type UserRole = 'viewer' | 'admin';

export type TransactionCategory =
  | 'Food & Dining'
  | 'Transport'
  | 'Shopping'
  | 'Entertainment'
  | 'Healthcare'
  | 'Utilities'
  | 'Salary'
  | 'Freelance'
  | 'Investments'
  | 'Rent';

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  category: TransactionCategory;
  type: TransactionType;
  description: string;
  merchant: string;
  status: TransactionStatus;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
}

export interface DateRange {
  from: string | null;
  to: string | null;
}

export interface Filters {
  dateRange: DateRange;
  categories: TransactionCategory[];
  type: TransactionType | 'all';
  status: TransactionStatus | 'all';
  searchQuery: string;
}

export interface MonthlyData {
  month: string;
  income: number;
  expenses: number;
  balance: number;
}

export interface CategoryBreakdown {
  category: TransactionCategory;
  amount: number;
  percentage: number;
  color: string;
}

export interface InsightData {
  topCategory: {
    name: TransactionCategory;
    amount: number;
    percentage: number;
  };
  biggestTransaction: Transaction;
  avgDailySpend: {
    current: number;
    previous: number;
  };
  pendingTransactions: {
    count: number;
    total: number;
  };
}

export const TRANSACTION_CATEGORIES: TransactionCategory[] = [
  'Food & Dining',
  'Transport',
  'Shopping',
  'Entertainment',
  'Healthcare',
  'Utilities',
  'Salary',
  'Freelance',
  'Investments',
  'Rent',
];

export const EXPENSE_CATEGORIES: TransactionCategory[] = [
  'Food & Dining',
  'Transport',
  'Shopping',
  'Entertainment',
  'Healthcare',
  'Utilities',
  'Rent',
];

export const INCOME_CATEGORIES: TransactionCategory[] = [
  'Salary',
  'Freelance',
  'Investments',
];

export const CATEGORY_COLORS: Record<TransactionCategory, string> = {
  'Food & Dining': '#f97316',
  'Transport': '#3b82f6',
  'Shopping': '#a855f7',
  'Entertainment': '#ec4899',
  'Healthcare': '#14b8a6',
  'Utilities': '#6366f1',
  'Salary': '#22c55e',
  'Freelance': '#06b6d4',
  'Investments': '#eab308',
  'Rent': '#ef4444',
};
