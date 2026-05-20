"use client";
import React from 'react';

import { useEffect, useState } from "react";
import DonutChart from "@/components/ui/donut-chart";
import LineChart from "@/components/ui/line-chart";
import StatCard from "@/components/ui/stat-card";

interface CategorySpend {
  category: string;
  total: number;
  color: string;
}

interface MonthlyTotal {
  month: string;
  total: number;
}

interface TopExpense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
}

interface MonthOverMonth {
  category: string;
  currentMonth: number;
  lastMonth: number;
  percentChange: number | null;
}

interface AnalyticsSummary {
  categorySpend: CategorySpend[];
  monthlyTotals: MonthlyTotal[];
  topExpenses: TopExpense[];
  monthOverMonth: MonthOverMonth[];
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
  Education: "#f43f5e",
  Travel: "#06b6d4",
  Other: "#94a3b8",
};

function getColor(category: string, index: number): string {
  if (CATEGORY_COLORS[category]) return CATEGORY_COLORS[category];
  const fallbacks = [
    "#f97316", "#3b82f6", "#a855f7", "#ec4899", "#22c55e",
    "#eab308", "#14b8a6", "#f43f5e", "#06b6d4", "#94a3b8",
  ];
  return fallbacks[index % fallbacks.length];
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function AnalyticsPage() {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSummary() {
      try {
        setLoading(true);
        const res = await fetch("/api/analytics/summary");
        if (!res.ok) {
          throw new Error("Failed to fetch analytics data");
        }
        const data: AnalyticsSummary = await res.json();
        // Assign colors to categories
        const coloredCategories = data.categorySpend.map((c, i) => ({
          ...c,
          color: getColor(c.category, i),
        }));
        setSummary({ ...data, categorySpend: coloredCategories });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchSummary();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f11] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#f97316] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0f0f11] flex items-center justify-center">
        <div className="bg-[#1a1a1f] border border-red-500/30 rounded-xl p-8 max-w-md text-center">
          <div className="text-red-400 text-4xl mb-4">⚠</div>
          <h2 className="text-white text-xl font-semibold mb-2">Failed to Load Analytics</h2>
          <p className="text-gray-400 text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-2 bg-[#f97316] hover:bg-[#ea6c0a] text-white rounded-lg text-sm font-medium transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!summary) return null;

  const donutData = summary.categorySpend.map((c) => ({
    label: c.category,
    value: c.total,
    color: c.color,
  }));

  const monthOverMonthChange =
    summary.totalLastMonth > 0
      ? ((summary.totalThisMonth - summary.totalLastMonth) / summary.totalLastMonth) * 100
      : null;

  const currentMonthName = new Date().toLocaleString("en-US", { month: "long", year: "numeric" });

  return (
    <div className="min-h-screen bg-[#0f0f11] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Spending Analytics
          </h1>
          <p className="text-gray-400 mt-1 text-sm">
            Insights and trends for {currentMonthName}
          </p>
        </div>

        {/* Stat Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <StatCard
            label="Total Spent This Month"
            value={formatCurrency(summary.totalThisMonth)}
            trend={
              monthOverMonthChange !== null
                ? {
                    direction: monthOverMonthChange >= 0 ? "up" : "down",
                    percent: Math.abs(monthOverMonthChange),
                  }
                : undefined
            }
          />
          <StatCard
            label="Total Spent Last Month"
            value={formatCurrency(summary.totalLastMonth)}
          />
          <StatCard
            label="Categories Tracked"
            value={String(summary.categorySpend.length)}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Donut Chart */}
          <div className="bg-[#1a1a1f] border border-white/5 rounded-2xl p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-white mb-1">
              Spending by Category
            </h2>
            <p className="text-gray-500 text-xs mb-6">Current month breakdown</p>
            {donutData.length > 0 ? (
              <DonutChart data={donutData} />
            ) : (
              <div className="flex items-center justify-center h-48 text-gray-500 text-sm">
                No spending data for this month
              </div>
            )}
          </div>

          {/* Line Chart */}
          <div className="bg-[#1a1a1f] border border-white/5 rounded-2xl p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-white mb-1">
              Monthly Spending Trend
            </h2>
            <p className="text-gray-500 text-xs mb-6">Last 6 months</p>
            {summary.monthlyTotals.length > 0 ? (
              <LineChart data={summary.monthlyTotals} />
            ) : (
              <div className="flex items-center justify-center h-48 text-gray-500 text-sm">
                No trend data available
              </div>
            )}
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top 5 Expenses */}
          <div className="bg-[#1a1a1f] border border-white/5 rounded-2xl p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-white mb-1">
              Top 5 Expenses
            </h2>
            <p className="text-gray-500 text-xs mb-6">Largest individual expenses this month</p>
            {summary.topExpenses.length > 0 ? (
              <div className="space-y-3">
                {summary.topExpenses.map((expense, index) => (
                  <div
                    key={expense.id}
                    className="flex items-center gap-4 p-3 rounded-xl bg-[#0f0f11] border border-white/5 hover:border-[#f97316]/30 transition-colors"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#f97316]/10 flex items-center justify-center">
                      <span className="text-[#f97316] text-xs font-bold">
                        #{index + 1}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">
                        {expense.description}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span
                          className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{
                            backgroundColor: `${getColor(expense.category, index)}20`,
                            color: getColor(expense.category, index),
                          }}
                        >
                          {expense.category}
                        </span>
                        <span className="text-gray-500 text-xs">
                          {formatDate(expense.date)}
                        </span>
                      </div>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <p className="text-white font-semibold text-sm">
                        {formatCurrency(expense.amount)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-48 text-gray-500 text-sm">
                No expenses this month
              </div>
            )}
          </div>

          {/* Month-over-Month Comparison */}
          <div className="bg-[#1a1a1f] border border-white/5 rounded-2xl p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-white mb-1">
              Month-over-Month
            </h2>
            <p className="text-gray-500 text-xs mb-6">Category comparison vs last month</p>
            {summary.monthOverMonth.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-left text-gray-500 font-medium pb-3 pr-4">
                        Category
                      </th>
                      <th className="text-right text-gray-500 font-medium pb-3 pr-4">
                        This Month
                      </th>
                      <th className="text-right text-gray-500 font-medium pb-3 pr-4">
                        Last Month
                      </th>
                      <th className="text-right text-gray-500 font-medium pb-3">
                        Change
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {summary.monthOverMonth.map((row, index) => {
                      const isIncrease =
                        row.percentChange !== null && row.percentChange > 0;
                      const isDecrease =
                        row.percentChange !== null && row.percentChange < 0;
                      const color = getColor(row.category, index);

                      return (
                        <tr
                          key={row.category}
                          className="hover:bg-white/[0.02] transition-colors"
                        >
                          <td className="py-3 pr-4">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                                style={{ backgroundColor: color }}
                              />
                              <span className="text-white font-medium">
                                {row.category}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 pr-4 text-right text-white">
                            {formatCurrency(row.currentMonth)}
                          </td>
                          <td className="py-3 pr-4 text-right text-gray-400">
                            {formatCurrency(row.lastMonth)}
                          </td>
                          <td className="py-3 text-right">
                            {row.percentChange === null ? (
                              <span className="text-gray-500 text-xs">—</span>
                            ) : (
                              <span
                                className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
                                  isDecrease
                                    ? "bg-green-500/10 text-green-400"
                                    : isIncrease
                                    ? "bg-red-500/10 text-red-400"
                                    : "bg-gray-500/10 text-gray-400"
                                }`}
                              >
                                {isIncrease && (
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
                                      d="M5 15l7-7 7 7"
                                    />
                                  </svg>
                                )}
                                {isDecrease && (
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
                                      d="M19 9l-7 7-7-7"
                                    />
                                  </svg>
                                )}
                                {Math.abs(row.percentChange).toFixed(1)}%
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex items-center justify-center h-48 text-gray-500 text-sm">
                No comparison data available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}