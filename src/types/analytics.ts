export interface CategoryTotal {
  category: string;
  total: number;
  color: string;
}

export interface MonthlyTotal {
  month: string;
  total: number;
}

export interface TopExpense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
}

export interface MonthOverMonthCategory {
  category: string;
  currentMonth: number;
  lastMonth: number;
  percentChange: number | null;
  color: string;
}

export interface AnalyticsSummary {
  categoryTotals: CategoryTotal[];
  monthlyTotals: MonthlyTotal[];
  topExpenses: TopExpense[];
  monthOverMonth: MonthOverMonthCategory[];
  totalSpentThisMonth: number;
  totalSpentLastMonth: number;
  monthLabel: string;
}

export interface AnalyticsQueryParams {
  month?: string;
  year?: string;
}

export type TrendDirection = "up" | "down" | "neutral";

export interface TrendIndicator {
  direction: TrendDirection;
  percentage: number;
}