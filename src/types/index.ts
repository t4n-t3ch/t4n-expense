export interface Category {
  id: string;
  name: string;
  color?: string | null;
  icon?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Expense {
  id: string;
  amount: number;
  description: string;
  date: Date | string;
  categoryId: string;
  category?: Category;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Budget {
  id: string;
  categoryId: string;
  amount: number;
  month: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface BudgetWithCategory extends Budget {
  category: Category;
}

export interface BudgetProgress {
  budget: BudgetWithCategory | null;
  category: Category;
  spent: number;
  limit: number;
  remaining: number;
  percentage: number;
  isOverBudget: boolean;
  hasbudget: boolean;
}

export interface CreateBudgetInput {
  categoryId: string;
  amount: number;
  month: string;
}

export interface UpdateBudgetInput {
  amount?: number;
  month?: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface MonthlyExpenseSummary {
  categoryId: string;
  categoryName: string;
  totalSpent: number;
  transactionCount: number;
}

export type ProgressBarColor = "green" | "yellow" | "red";

export function getProgressColor(percentage: number): ProgressBarColor {
  if (percentage >= 100) return "red";
  if (percentage >= 75) return "yellow";
  return "green";
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function getMonthString(date: Date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export function parseMonthString(monthStr: string): Date {
  const [year, month] = monthStr.split("-").map(Number);
  return new Date(year, month - 1, 1);
}