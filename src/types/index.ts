export type Frequency = "WEEKLY" | "MONTHLY" | "YEARLY";

export interface Category {
  id: string;
  name: string;
  color?: string;
  icon?: string;
  createdAt?: string;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  date: string;
  categoryId: string;
  category?: Category;
  notes?: string;
  createdAt?: string;
}

export interface RecurringExpense {
  id: string;
  title: string;
  amount: number;
  categoryId: string;
  category?: Category;
  frequency: Frequency;
  nextDueDate: string;
  isActive: boolean;
  createdAt?: string;
}

export interface CreateExpenseInput {
  title: string;
  amount: number;
  date: string;
  categoryId: string;
  notes?: string;
}

export interface CreateRecurringExpenseInput {
  title: string;
  amount: number;
  categoryId: string;
  frequency: Frequency;
  nextDueDate: string;
}

export interface UpdateRecurringExpenseInput {
  title?: string;
  amount?: number;
  categoryId?: string;
  frequency?: Frequency;
  nextDueDate?: string;
  isActive?: boolean;
}

export interface ProcessRecurringResult {
  processed: number;
  expenses: Expense[];
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface DashboardStats {
  totalExpenses: number;
  totalAmount: number;
  averageAmount: number;
  topCategory?: Category;
  recentExpenses: Expense[];
}