import React from 'react';

import { TopExpense } from "@/types/analytics";

interface TopExpensesListProps {
  expenses: TopExpense[];
}

const CATEGORY_COLORS: Record<string, string> = {
  Food: "#f97316",
  Transport: "#3b82f6",
  Entertainment: "#8b5cf6",
  Shopping: "#ec4899",
  Health: "#10b981",
  Housing: "#f59e0b",
  Utilities: "#06b6d4",
  Education: "#84cc16",
  Travel: "#ef4444",
  Other: "#6b7280",
};

function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category] ?? "#6b7280";
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function getCategoryInitial(category: string): string {
  return category.charAt(0).toUpperCase();
}

export default function TopExpensesList({ expenses }: TopExpensesListProps) {
  if (!expenses || expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 rounded-full bg-[#1a1a1f] flex items-center justify-center mb-4">
          <svg
            className="w-8 h-8 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
        <p className="text-gray-400 text-sm">No expenses found for this month</p>
      </div>
    );
  }

  const maxAmount = Math.max(...expenses.map((e) => e.amount));

  return (
    <div className="space-y-3">
      {expenses.map((expense, index) => {
        const color = getCategoryColor(expense.category);
        const barWidth = maxAmount > 0 ? (expense.amount / maxAmount) * 100 : 0;

        return (
          <div
            key={expense.id}
            className="group relative bg-[#1a1a1f] rounded-xl p-4 border border-white/5 hover:border-white/10 transition-all duration-200 hover:bg-[#1e1e24]"
          >
            <div className="flex items-center gap-4">
              {/* Rank Badge */}
              <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#0f0f11] border border-white/10 flex items-center justify-center">
                <span className="text-xs font-bold text-gray-400">
                  {index + 1}
                </span>
              </div>

              {/* Category Icon */}
              <div
                className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg"
                style={{
                  backgroundColor: `${color}20`,
                  border: `1px solid ${color}40`,
                  color: color,
                }}
              >
                {getCategoryInitial(expense.category)}
              </div>

              {/* Expense Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="min-w-0">
                    <p className="text-white text-sm font-medium truncate leading-tight">
                      {expense.description || "No description"}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span
                        className="text-xs font-medium px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: `${color}15`,
                          color: color,
                        }}
                      >
                        {expense.category}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDate(expense.date)}
                      </span>
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <span className="text-white font-bold text-base">
                      {formatCurrency(expense.amount)}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-2 h-1 bg-[#0f0f11] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${barWidth}%`,
                      backgroundColor: color,
                      opacity: 0.7,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Summary Footer */}
      <div className="mt-4 pt-4 border-t border-white/5">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">
            Top {expenses.length} expense{expenses.length !== 1 ? "s" : ""}
          </span>
          <span className="text-gray-400 font-medium">
            Total:{" "}
            <span className="text-[#f97316]">
              {formatCurrency(expenses.reduce((sum, e) => sum + e.amount, 0))}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}