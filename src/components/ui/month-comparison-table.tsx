import React from 'react';

import { CategoryTotal } from "@/types/analytics";

interface MonthComparisonRow {
  category: string;
  color: string;
  currentMonth: number;
  lastMonth: number;
  change: number;
  changePercent: number | null;
}

interface MonthComparisonTableProps {
  currentMonthData: CategoryTotal[];
  lastMonthData: CategoryTotal[];
  currentMonthLabel?: string;
  lastMonthLabel?: string;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function buildComparisonRows(
  current: CategoryTotal[],
  last: CategoryTotal[]
): MonthComparisonRow[] {
  const allCategories = new Set<string>();
  const currentMap = new Map<string, CategoryTotal>();
  const lastMap = new Map<string, CategoryTotal>();

  current.forEach((item) => {
    allCategories.add(item.category);
    currentMap.set(item.category, item);
  });

  last.forEach((item) => {
    allCategories.add(item.category);
    lastMap.set(item.category, item);
  });

  const rows: MonthComparisonRow[] = [];

  allCategories.forEach((category) => {
    const currentItem = currentMap.get(category);
    const lastItem = lastMap.get(category);

    const currentTotal = currentItem?.total ?? 0;
    const lastTotal = lastItem?.total ?? 0;
    const change = currentTotal - lastTotal;

    let changePercent: number | null = null;
    if (lastTotal > 0) {
      changePercent = (change / lastTotal) * 100;
    } else if (currentTotal > 0) {
      changePercent = 100;
    }

    const color = currentItem?.color ?? lastItem?.color ?? "#6b7280";

    rows.push({
      category,
      color,
      currentMonth: currentTotal,
      lastMonth: lastTotal,
      change,
      changePercent,
    });
  });

  rows.sort((a, b) => b.currentMonth - a.currentMonth);

  return rows;
}

function ChangeIndicator({
  change,
  changePercent,
}: {
  change: number;
  changePercent: number | null;
}) {
  if (changePercent === null) {
    return <span className="text-gray-500 text-sm">—</span>;
  }

  const isIncrease = change > 0;
  const isNoChange = change === 0;

  if (isNoChange) {
    return (
      <span className="inline-flex items-center gap-1 text-gray-400 text-sm font-medium">
        <svg
          className="w-3 h-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
        </svg>
        0%
      </span>
    );
  }

  const absPercent = Math.abs(changePercent);
  const displayPercent =
    absPercent >= 100
      ? Math.round(absPercent)
      : absPercent >= 10
      ? absPercent.toFixed(1)
      : absPercent.toFixed(1);

  if (isIncrease) {
    return (
      <span className="inline-flex items-center gap-1 text-red-400 text-sm font-medium">
        <svg
          className="w-3 h-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18"
          />
        </svg>
        +{displayPercent}%
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 text-emerald-400 text-sm font-medium">
      <svg
        className="w-3 h-3"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3"
        />
      </svg>
      -{displayPercent}%
    </span>
  );
}

export default function MonthComparisonTable({
  currentMonthData,
  lastMonthData,
  currentMonthLabel = "This Month",
  lastMonthLabel = "Last Month",
}: MonthComparisonTableProps) {
  const rows = buildComparisonRows(currentMonthData, lastMonthData);

  const currentTotal = rows.reduce((sum, r) => sum + r.currentMonth, 0);
  const lastTotal = rows.reduce((sum, r) => sum + r.lastMonth, 0);
  const totalChange = currentTotal - lastTotal;
  const totalChangePercent =
    lastTotal > 0 ? ((totalChange / lastTotal) * 100) : null;

  if (rows.length === 0) {
    return (
      <div className="bg-[#1a1a1f] border border-white/10 rounded-2xl p-6">
        <h3 className="text-white font-semibold text-lg mb-4">
          Month-over-Month Comparison
        </h3>
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <svg
            className="w-12 h-12 mb-3 opacity-40"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <p className="text-sm">No comparison data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1a1a1f] border border-white/10 rounded-2xl overflow-hidden">
      <div className="px-6 py-5 border-b border-white/10">
        <h3 className="text-white font-semibold text-lg">
          Month-over-Month Comparison
        </h3>
        <p className="text-gray-400 text-sm mt-1">
          Category spending compared to last month
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                Category
              </th>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                {lastMonthLabel}
              </th>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                {currentMonthLabel}
              </th>
              <th className="text-right px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                Change
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {rows.map((row) => (
              <tr
                key={row.category}
                className="hover:bg-white/[0.02] transition-colors duration-150"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: row.color }}
                    />
                    <span className="text-white text-sm font-medium">
                      {row.category}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4 text-right">
                  <span className="text-gray-400 text-sm">
                    {row.lastMonth > 0 ? formatCurrency(row.lastMonth) : "—"}
                  </span>
                </td>
                <td className="px-4 py-4 text-right">
                  <span className="text-white text-sm font-medium">
                    {row.currentMonth > 0
                      ? formatCurrency(row.currentMonth)
                      : "—"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <span className="text-gray-500 text-xs hidden sm:inline">
                      {row.change !== 0
                        ? (row.change > 0 ? "+" : "") +
                          formatCurrency(row.change)
                        : ""}
                    </span>
                    <ChangeIndicator
                      change={row.change}
                      changePercent={row.changePercent}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-white/10 bg-white/[0.02]">
              <td className="px-6 py-4">
                <span className="text-white text-sm font-semibold">Total</span>
              </td>
              <td className="px-4 py-4 text-right">
                <span className="text-gray-300 text-sm font-medium">
                  {formatCurrency(lastTotal)}
                </span>
              </td>
              <td className="px-4 py-4 text-right">
                <span className="text-white text-sm font-semibold">
                  {formatCurrency(currentTotal)}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <span className="text-gray-500 text-xs hidden sm:inline">
                    {totalChange !== 0
                      ? (totalChange > 0 ? "+" : "") +
                        formatCurrency(totalChange)
                      : ""}
                  </span>
                  <ChangeIndicator
                    change={totalChange}
                    changePercent={totalChangePercent}
                  />
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}