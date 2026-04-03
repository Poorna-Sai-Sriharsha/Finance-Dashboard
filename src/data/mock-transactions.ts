import { Transaction, TransactionCategory, TransactionStatus, TransactionType } from '@/types';

const merchants: Record<TransactionCategory, string[]> = {
  'Food & Dining': ['Swiggy', 'Zomato', 'BigBasket', 'Starbucks', 'Dominos', 'Barbeque Nation', 'Haldirams', 'DMart'],
  'Transport': ['Uber India', 'Ola', 'Indian Oil', 'Metro Card', 'Rapido', 'BMTC Bus'],
  'Shopping': ['Amazon India', 'Flipkart', 'Myntra', 'Croma', 'IKEA India', 'Reliance Digital'],
  'Entertainment': ['Netflix India', 'Spotify', 'BookMyShow', 'Hotstar', 'Amazon Prime', 'SonyLIV'],
  'Healthcare': ['Apollo Pharmacy', 'MedPlus', 'Practo Consult', '1mg', 'Max Hospital'],
  'Utilities': ['BESCOM Electric', 'BWSSB Water', 'Jio Fiber', 'Airtel', 'Piped Gas'],
  'Salary': ['TCS', 'Infosys', 'Wipro Technologies'],
  'Freelance': ['Upwork Client', 'Fiverr Project', 'Direct Client Payment', 'Consulting Fee'],
  'Investments': ['Zerodha Dividend', 'Groww Returns', 'FD Interest - SBI', 'PPF Interest'],
  'Rent': ['Brigade Apartments', 'Prestige Residences', 'Property Management Co'],
};

const descriptions: Record<TransactionCategory, string[]> = {
  'Food & Dining': ['Morning coffee & breakfast', 'Lunch with colleagues', 'Weekly grocery run', 'Friday dinner delivery', 'Quick lunch break', 'Date night dinner', 'Weekend brunch', 'Monthly ration supplies'],
  'Transport': ['Morning commute', 'Ride to airport', 'Monthly metro pass', 'Weekly fuel fill-up', 'Parking charges', 'Ride to meeting'],
  'Shopping': ['Electronics accessories', 'Monthly essentials', 'New running shoes', 'Smart home device', 'Home office upgrade', 'Festival shopping', 'Gift for birthday'],
  'Entertainment': ['Monthly subscription', 'Premium plan renewal', 'Movie night tickets', 'Game purchase', 'Streaming upgrade', 'Annual plan'],
  'Healthcare': ['Prescription refill', 'Annual checkup copay', 'Blood work lab tests', 'OTC medications', 'Dental checkup'],
  'Utilities': ['Monthly electric bill', 'Water charges', 'Internet service', 'Phone plan', 'Mobile recharge', 'Gas cylinder'],
  'Salary': ['Monthly salary deposit', 'Bi-weekly paycheck', 'Quarterly bonus'],
  'Freelance': ['Website redesign project', 'Logo design work', 'Consulting session', 'Content writing gig'],
  'Investments': ['Quarterly dividend', 'Mutual fund returns', 'FD interest credit', 'PPF annual interest'],
  'Rent': ['Monthly rent payment', 'Rent + maintenance', 'Lease payment'],
};

function randomBetween(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateId(): string {
  return 'txn_' + Math.random().toString(36).substring(2, 11);
}

// Generate a date between Jan 1, 2025 and April 1, 2026
function generateDateInRange(): string {
  const start = new Date(2025, 0, 1).getTime(); // Jan 1, 2025
  const end = new Date(2026, 3, 1).getTime(); // April 1, 2026
  const randomTime = start + Math.random() * (end - start);
  const date = new Date(randomTime);
  date.setHours(Math.floor(Math.random() * 24));
  date.setMinutes(Math.floor(Math.random() * 60));
  return date.toISOString();
}

function generateTransaction(): Transaction {
  const isIncome = Math.random() < 0.3;
  const type: TransactionType = isIncome ? 'income' : 'expense';

  const categoryPool = isIncome
    ? (['Salary', 'Freelance', 'Investments'] as TransactionCategory[])
    : (['Food & Dining', 'Transport', 'Shopping', 'Entertainment', 'Healthcare', 'Utilities', 'Rent'] as TransactionCategory[]);

  const category = randomChoice(categoryPool);

  // Amounts in INR (Indian Rupees)
  const amountRanges: Record<TransactionCategory, [number, number]> = {
    'Food & Dining': [100, 5000],
    'Transport': [50, 3000],
    'Shopping': [500, 15000],
    'Entertainment': [199, 2999],
    'Healthcare': [200, 10000],
    'Utilities': [300, 5000],
    'Salary': [50000, 120000],
    'Freelance': [5000, 50000],
    'Investments': [1000, 25000],
    'Rent': [12000, 35000],
  };

  const [min, max] = amountRanges[category];
  const amount = randomBetween(min, max);

  const statusWeights = Math.random();
  let status: TransactionStatus = 'completed';
  if (statusWeights > 0.92) status = 'failed';
  else if (statusWeights > 0.82) status = 'pending';

  return {
    id: generateId(),
    date: generateDateInRange(),
    amount,
    category,
    type,
    description: randomChoice(descriptions[category]),
    merchant: randomChoice(merchants[category]),
    status,
  };
}

function generateMockTransactions(): Transaction[] {
  const transactions: Transaction[] = [];

  // Generate 65+ transactions spread across the date range
  for (let i = 0; i < 68; i++) {
    transactions.push(generateTransaction());
  }

  // Sort by date descending
  transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return transactions;
}

export const mockTransactions: Transaction[] = generateMockTransactions();
