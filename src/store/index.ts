import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Transaction, Filters, UserRole, TransactionCategory, TransactionType, TransactionStatus, AppNotification } from '@/types';
import { mockTransactions } from '@/data/mock-transactions';

interface TransactionSlice {
  transactions: Transaction[];
  addTransaction: (transaction: Transaction) => void;
  editTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
}

interface FilterSlice {
  filters: Filters;
  setDateRange: (from: string | null, to: string | null) => void;
  setCategories: (categories: TransactionCategory[]) => void;
  setType: (type: TransactionType | 'all') => void;
  setStatus: (status: TransactionStatus | 'all') => void;
  setSearchQuery: (query: string) => void;
  resetFilters: () => void;
}

interface RoleSlice {
  role: UserRole;
  setRole: (role: UserRole) => void;
}

interface UISlice {
  sidebarOpen: boolean;
  darkMode: boolean;
  isLoading: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleDarkMode: () => void;
  setDarkMode: (dark: boolean) => void;
  setIsLoading: (loading: boolean) => void;
}

interface NotificationSlice {
  notifications: AppNotification[];
  addNotification: (notification: AppNotification) => void;
  markAllNotificationsRead: () => void;
}

export type StoreState = TransactionSlice & FilterSlice & RoleSlice & UISlice & NotificationSlice;

const defaultFilters: Filters = {
  dateRange: { from: null, to: null },
  categories: [],
  type: 'all',
  status: 'all',
  searchQuery: '',
};

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      // Transaction slice
      transactions: mockTransactions,
      addTransaction: (transaction) =>
        set((state) => {
          const newNotification: AppNotification = {
            id: crypto.randomUUID(),
            title: 'New Transaction Added',
            message: `A new ${transaction.type} of ${transaction.amount} was added.`,
            date: new Date().toISOString(),
            read: false,
          };
          
          return {
            transactions: [transaction, ...state.transactions],
            notifications: [newNotification, ...state.notifications],
          };
        }),
      editTransaction: (id, updates) =>
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        })),
      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        })),

      // Filter slice
      filters: defaultFilters,
      setDateRange: (from, to) =>
        set((state) => ({
          filters: { ...state.filters, dateRange: { from, to } },
        })),
      setCategories: (categories) =>
        set((state) => ({
          filters: { ...state.filters, categories },
        })),
      setType: (type) =>
        set((state) => ({
          filters: { ...state.filters, type },
        })),
      setStatus: (status) =>
        set((state) => ({
          filters: { ...state.filters, status },
        })),
      setSearchQuery: (query) =>
        set((state) => ({
          filters: { ...state.filters, searchQuery: query },
        })),
      resetFilters: () => set({ filters: defaultFilters }),

      // Role slice
      role: 'admin' as UserRole,
      setRole: (role) => set({ role }),

      // UI slice
      sidebarOpen: true,
      darkMode: true,
      isLoading: true,
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      setDarkMode: (dark) => set({ darkMode: dark }),
      setIsLoading: (loading) => set({ isLoading: loading }),

      // Notification slice
      notifications: [
        { id: '1', title: 'Salary Credited', message: 'Your monthly salary has been deposited.', date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), read: false },
        { id: '2', title: 'Rent Due Reminder', message: 'Your rent payment is due in 3 days.', date: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), read: false },
        { id: '3', title: 'Budget Alert', message: 'You have exceeded 80% of your Food & Dining budget.', date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), read: true },
        { id: '4', title: 'Transaction Failed', message: 'Payment to Shell Gas was declined.', date: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), read: true },
      ],
      addNotification: (notification) =>
        set((state) => ({
          notifications: [notification, ...state.notifications],
        })),
      markAllNotificationsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        })),
    }),
    {
      name: 'finance-dashboard-v2',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        transactions: state.transactions,
        role: state.role,
        darkMode: state.darkMode,
        notifications: state.notifications,
      }),
    }
  )
);
