import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { DashboardLayout } from './dashboard-layout';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'FinanceIQ — Smart Finance Dashboard',
  description:
    'Track, analyze, and optimize your financial life with intelligent insights, transaction management, and beautiful visualizations.',
  keywords: ['finance', 'dashboard', 'budget', 'expenses', 'income', 'analytics'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <DashboardLayout>{children}</DashboardLayout>
      </body>
    </html>
  );
}
