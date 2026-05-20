/**
 * Formats a number as a currency string (USD by default)
 */
export function formatCurrency(
  amount: number,
  currency: string = "USD",
  locale: string = "en-US"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Formats a number as a compact currency string (e.g. $1.2K, $3.4M)
 */
export function formatCurrencyCompact(
  amount: number,
  currency: string = "USD",
  locale: string = "en-US"
): string {
  if (Math.abs(amount) >= 1_000_000) {
    return (
      new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
        notation: "compact",
      }).format(amount)
    );
  }
  if (Math.abs(amount) >= 1_000) {
    return (
      new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
        notation: "compact",
      }).format(amount)
    );
  }
  return formatCurrency(amount, currency, locale);
}

/**
 * Formats a percentage value with a + or - sign
 */
export function formatPercentChange(value: number, decimals: number = 1): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(decimals)}%`;
}

/**
 * Formats a percentage value without sign
 */
export function formatPercent(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Formats a Date object or ISO string as a short month + year label (e.g. "Jan 2024")
 */
export function formatMonthYear(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  }).format(d);
}

/**
 * Formats a Date object or ISO string as a short month label only (e.g. "Jan")
 */
export function formatMonthShort(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", { month: "short" }).format(d);
}

/**
 * Formats a Date object or ISO string as a full date string (e.g. "January 15, 2024")
 */
export function formatDateLong(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(d);
}

/**
 * Formats a Date object or ISO string as a short date string (e.g. "Jan 15, 2024")
 */
export function formatDateShort(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(d);
}

/**
 * Truncates a string to a maximum length, appending ellipsis if needed
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + "...";
}

/**
 * Capitalizes the first letter of a string
 */
export function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Formats a number with thousands separators (e.g. 1,234,567)
 */
export function formatNumber(value: number, locale: string = "en-US"): string {
  return new Intl.NumberFormat(locale).format(value);
}

/**
 * Returns a color class string based on whether a value represents an increase or decrease
 * For expenses: increase is bad (red), decrease is good (green)
 */
export function getChangeColorClass(
  percentChange: number,
  invertColors: boolean = false
): string {
  if (percentChange === 0) return "text-gray-400";
  const isPositive = percentChange > 0;
  const isGood = invertColors ? isPositive : !isPositive;
  return isGood ? "text-emerald-400" : "text-red-400";
}

/**
 * Converts a month index (0-11) and year to a YYYY-MM string
 */
export function toYearMonth(year: number, month: number): string {
  const m = String(month + 1).padStart(2, "0");
  return `${year}-${m}`;
}

/**
 * Parses a YYYY-MM string into { year, month } (month is 0-indexed)
 */
export function parseYearMonth(yearMonth: string): { year: number; month: number } {
  const [year, month] = yearMonth.split("-").map(Number);
  return { year, month: month - 1 };
}

/**
 * Returns the start and end Date objects for a given YYYY-MM string
 */
export function getMonthRange(yearMonth: string): { start: Date; end: Date } {
  const { year, month } = parseYearMonth(yearMonth);
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0, 23, 59, 59, 999);
  return { start, end };
}

/**
 * Returns the current month as a YYYY-MM string
 */
export function getCurrentYearMonth(): string {
  const now = new Date();
  return toYearMonth(now.getFullYear(), now.getMonth());
}

/**
 * Returns an array of the last N months as YYYY-MM strings, most recent last
 */
export function getLastNMonths(n: number): string[] {
  const result: string[] = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    result.push(toYearMonth(d.getFullYear(), d.getMonth()));
  }
  return result;
}