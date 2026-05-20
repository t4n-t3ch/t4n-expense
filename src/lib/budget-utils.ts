import { BudgetProgress } from "@/types/index";

/**
 * Returns the first day of the given month as a Date object (UTC midnight).
 */
export function getMonthStart(date: Date = new Date()): Date {
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), 1));
}

/**
 * Returns the last moment of the given month as a Date object (UTC).
 */
export function getMonthEnd(date: Date = new Date()): Date {
  return new Date(Date.UTC(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999));
}

/**
 * Formats a Date to a "YYYY-MM" string for use in month selectors.
 */
export function formatMonthKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

/**
 * Parses a "YYYY-MM" string into a Date representing the first of that month (UTC).
 */
export function parseMonthKey(monthKey: string): Date {
  const [year, month] = monthKey.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, 1));
}

/**
 * Returns a human-readable label for a month, e.g. "January 2025".
 */
export function formatMonthLabel(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/**
 * Returns the current month key string "YYYY-MM".
 */
export function getCurrentMonthKey(): string {
  return formatMonthKey(new Date());
}

/**
 * Calculates the percentage of spending relative to the budget limit.
 * Returns 0 if limit is 0 to avoid division by zero.
 */
export function calculatePercentage(spent: number, limit: number): number {
  if (limit <= 0) return 0;
  return Math.round((spent / limit) * 100);
}

/**
 * Returns the remaining budget amount (limit - spent).
 * Can be negative if over budget.
 */
export function calculateRemaining(spent: number, limit: number): number {
  return limit - spent;
}

/**
 * Determines the color status of a budget based on percentage used.
 * - "green"  → under 75%
 * - "yellow" → 75% to 99%
 * - "red"    → 100% or over
 */
export type BudgetStatus = "green" | "yellow" | "red";

export function getBudgetStatus(spent: number, limit: number): BudgetStatus {
  if (limit <= 0) return "green";
  const pct = (spent / limit) * 100;
  if (pct >= 100) return "red";
  if (pct >= 75) return "yellow";
  return "green";
}

/**
 * Returns Tailwind CSS color classes for a given budget status.
 */
export function getBudgetStatusClasses(status: BudgetStatus): {
  bar: string;
  text: string;
  badge: string;
} {
  switch (status) {
    case "red":
      return {
        bar: "bg-red-500",
        text: "text-red-400",
        badge: "bg-red-500/20 text-red-400 border border-red-500/30",
      };
    case "yellow":
      return {
        bar: "bg-yellow-500",
        text: "text-yellow-400",
        badge: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
      };
    case "green":
    default:
      return {
        bar: "bg-green-500",
        text: "text-green-400",
        badge: "bg-green-500/20 text-green-400 border border-green-500/30",
      };
  }
}

/**
 * Formats a number as a USD currency string.
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Generates a list of month options (last 12 months + next 3 months)
 * for use in a month selector dropdown.
 */
export function generateMonthOptions(): Array<{ value: string; label: string }> {
  const options: Array<{ value: string; label: string }> = [];
  const now = new Date();

  // Go back 12 months
  for (let i = 12; i >= 0; i--) {
    const d = new Date(Date.UTC(now.getFullYear(), now.getMonth() - i, 1));
    options.push({
      value: formatMonthKey(d),
      label: formatMonthLabel(d),
    });
  }

  // Add next 3 months
  for (let i = 1; i <= 3; i++) {
    const d = new Date(Date.UTC(now.getFullYear(), now.getMonth() + i, 1));
    options.push({
      value: formatMonthKey(d),
      label: formatMonthLabel(d),
    });
  }

  return options;
}

/**
 * Sorts an array of BudgetProgress items by status severity (red first, then yellow, then green),
 * then alphabetically by category name within each group.
 */
export function sortBudgetsByStatus(budgets: BudgetProgress[]): BudgetProgress[] {
  const statusOrder: Record<BudgetStatus, number> = {
    red: 0,
    yellow: 1,
    green: 2,
  };

  return [...budgets].sort((a, b) => {
    const aStatus = getBudgetStatus(a.spent, a.limit);
    const bStatus = getBudgetStatus(b.spent, b.limit);
    const statusDiff = statusOrder[aStatus] - statusOrder[bStatus];
    if (statusDiff !== 0) return statusDiff;
    return a.categoryName.localeCompare(b.categoryName);
  });
}

/**
 * Computes summary statistics from a list of BudgetProgress items.
 */
export interface BudgetSummary {
  totalBudgeted: number;
  totalSpent: number;
  totalRemaining: number;
  overBudgetCount: number;
  onTrackCount: number;
  warningCount: number;
  overallPercentage: number;
}

export function computeBudgetSummary(budgets: BudgetProgress[]): BudgetSummary {
  const totalBudgeted = budgets.reduce((sum, b) => sum + b.limit, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const totalRemaining = totalBudgeted - totalSpent;
  const overallPercentage = calculatePercentage(totalSpent, totalBudgeted);

  let overBudgetCount = 0;
  let warningCount = 0;
  let onTrackCount = 0;

  for (const b of budgets) {
    const status = getBudgetStatus(b.spent, b.limit);
    if (status === "red") overBudgetCount++;
    else if (status === "yellow") warningCount++;
    else onTrackCount++;
  }

  return {
    totalBudgeted,
    totalSpent,
    totalRemaining,
    overBudgetCount,
    onTrackCount,
    warningCount,
    overallPercentage,
  };
}