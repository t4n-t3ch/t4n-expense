import { prisma } from "@/lib/prisma";

export interface CategoryTotal {
  category: string;
  total: number;
  color: string;
}

export interface MonthlyTotal {
  month: string;
  total: number;
  year: number;
  monthIndex: number;
}

export interface TopExpense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: Date;
}

export interface MonthOverMonthCategory {
  category: string;
  currentMonth: number;
  lastMonth: number;
  change: number;
  changePercent: number | null;
}

export interface AnalyticsSummary {
  categoryTotals: CategoryTotal[];
  monthlyTotals: MonthlyTotal[];
  topExpenses: TopExpense[];
  monthOverMonth: MonthOverMonthCategory[];
  totalThisMonth: number;
  totalLastMonth: number;
}

const CATEGORY_COLORS: Record<string, string> = {
  Food: "#f97316",
  Transport: "#3b82f6",
  Entertainment: "#a855f7",
  Shopping: "#ec4899",
  Health: "#22c55e",
  Housing: "#eab308",
  Utilities: "#14b8a6",
  Education: "#6366f1",
  Travel: "#f43f5e",
  Other: "#94a3b8",
};

const DEFAULT_COLORS = [
  "#f97316",
  "#3b82f6",
  "#a855f7",
  "#ec4899",
  "#22c55e",
  "#eab308",
  "#14b8a6",
  "#6366f1",
  "#f43f5e",
  "#94a3b8",
];

export function getCategoryColor(category: string, index: number = 0): string {
  return CATEGORY_COLORS[category] ?? DEFAULT_COLORS[index % DEFAULT_COLORS.length];
}

export function getMonthDateRange(year: number, month: number): { start: Date; end: Date } {
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0, 23, 59, 59, 999);
  return { start, end };
}

export function formatMonthLabel(year: number, monthIndex: number): string {
  const date = new Date(year, monthIndex, 1);
  return date.toLocaleString("default", { month: "short", year: "2-digit" });
}

export async function getCategoryTotals(
  year: number,
  month: number
): Promise<CategoryTotal[]> {
  const { start, end } = getMonthDateRange(year, month);

  const expenses = await prisma.expense.groupBy({
    by: ["category"],
    where: {
      date: {
        gte: start,
        lte: end,
      },
    },
    _sum: {
      amount: true,
    },
    orderBy: {
      _sum: {
        amount: "desc",
      },
    },
  });

  return expenses.map((item, index) => ({
    category: item.category,
    total: item._sum.amount ?? 0,
    color: getCategoryColor(item.category, index),
  }));
}

export async function getMonthlyTotals(
  monthsBack: number = 6
): Promise<MonthlyTotal[]> {
  const now = new Date();
  const results: MonthlyTotal[] = [];

  for (let i = monthsBack - 1; i >= 0; i--) {
    const targetDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = targetDate.getFullYear();
    const monthIndex = targetDate.getMonth();
    const { start, end } = getMonthDateRange(year, monthIndex);

    const aggregate = await prisma.expense.aggregate({
      where: {
        date: {
          gte: start,
          lte: end,
        },
      },
      _sum: {
        amount: true,
      },
    });

    results.push({
      month: formatMonthLabel(year, monthIndex),
      total: aggregate._sum.amount ?? 0,
      year,
      monthIndex,
    });
  }

  return results;
}

export async function getTopExpenses(
  year: number,
  month: number,
  limit: number = 5
): Promise<TopExpense[]> {
  const { start, end } = getMonthDateRange(year, month);

  const expenses = await prisma.expense.findMany({
    where: {
      date: {
        gte: start,
        lte: end,
      },
    },
    orderBy: {
      amount: "desc",
    },
    take: limit,
    select: {
      id: true,
      description: true,
      amount: true,
      category: true,
      date: true,
    },
  });

  return expenses.map((e) => ({
    id: e.id,
    description: e.description,
    amount: e.amount,
    category: e.category,
    date: e.date,
  }));
}

export async function getMonthOverMonthComparison(
  year: number,
  month: number
): Promise<MonthOverMonthCategory[]> {
  const currentTotals = await getCategoryTotals(year, month);

  const lastMonthDate = new Date(year, month - 1, 1);
  const lastMonthTotals = await getCategoryTotals(
    lastMonthDate.getFullYear(),
    lastMonthDate.getMonth()
  );

  const lastMonthMap = new Map<string, number>(
    lastMonthTotals.map((item) => [item.category, item.total])
  );

  const allCategories = new Set<string>([
    ...currentTotals.map((c) => c.category),
    ...lastMonthTotals.map((c) => c.category),
  ]);

  const currentMap = new Map<string, number>(
    currentTotals.map((item) => [item.category, item.total])
  );

  const comparison: MonthOverMonthCategory[] = [];

  for (const category of allCategories) {
    const current = currentMap.get(category) ?? 0;
    const last = lastMonthMap.get(category) ?? 0;
    const change = current - last;
    const changePercent = last !== 0 ? (change / last) * 100 : null;

    comparison.push({
      category,
      currentMonth: current,
      lastMonth: last,
      change,
      changePercent,
    });
  }

  comparison.sort((a, b) => b.currentMonth - a.currentMonth);

  return comparison;
}

export async function getAnalyticsSummary(
  year: number,
  month: number
): Promise<AnalyticsSummary> {
  const [categoryTotals, monthlyTotals, topExpenses, monthOverMonth] =
    await Promise.all([
      getCategoryTotals(year, month),
      getMonthlyTotals(6),
      getTopExpenses(year, month, 5),
      getMonthOverMonthComparison(year, month),
    ]);

  const totalThisMonth = categoryTotals.reduce((sum, c) => sum + c.total, 0);

  const lastMonthDate = new Date(year, month - 1, 1);
  const lastMonthTotals = await getCategoryTotals(
    lastMonthDate.getFullYear(),
    lastMonthDate.getMonth()
  );
  const totalLastMonth = lastMonthTotals.reduce((sum, c) => sum + c.total, 0);

  return {
    categoryTotals,
    monthlyTotals,
    topExpenses,
    monthOverMonth,
    totalThisMonth,
    totalLastMonth,
  };
}