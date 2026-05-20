"use client";
import React from 'react';

import { useState, useEffect, useCallback } from "react";
import BudgetProgressBar from "@/components/ui/budget-progress-bar";
import BudgetForm from "@/components/ui/budget-form";

interface Category {
  id: string;
  name: string;
  color?: string;
}

interface Budget {
  id: string;
  categoryId: string;
  amount: number;
  month: string;
  category: Category;
}

interface Expense {
  id: string;
  amount: number;
  categoryId: string;
  date: string;
}

interface BudgetProgress {
  category: Category;
  budget: Budget | null;
  spent: number;
  limit: number;
  remaining: number;
}

export default function BudgetsPage() {
  const [budgetProgressList, setBudgetProgressList] = useState<BudgetProgress[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [currentMonth, setCurrentMonth] = useState<string>(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [budgetsRes, categoriesRes, expensesRes] = await Promise.all([
        fetch(`/api/budgets?month=${currentMonth}`),
        fetch("/api/categories"),
        fetch(`/api/expenses?month=${currentMonth}`),
      ]);

      if (!budgetsRes.ok) throw new Error("Failed to fetch budgets");
      if (!categoriesRes.ok) throw new Error("Failed to fetch categories");

      const budgets: Budget[] = await budgetsRes.json();
      const cats: Category[] = await categoriesRes.json();
      setCategories(cats);

      let expenses: Expense[] = [];
      if (expensesRes.ok) {
        const expData = await expensesRes.json();
        expenses = Array.isArray(expData) ? expData : expData.expenses || [];
      }

      // Filter expenses for current month
      const [year, month] = currentMonth.split("-").map(Number);
      const monthlyExpenses = expenses.filter((e) => {
        const d = new Date(e.date);
        return d.getFullYear() === year && d.getMonth() + 1 === month;
      });

      // Build progress list for each category
      const progressList: BudgetProgress[] = cats.map((cat) => {
        const budget = budgets.find((b) => b.categoryId === cat.id) || null;
        const spent = monthlyExpenses
          .filter((e) => e.categoryId === cat.id)
          .reduce((sum, e) => sum + e.amount, 0);
        const limit = budget ? budget.amount : 0;
        const remaining = limit - spent;
        return { category: cat, budget, spent, limit, remaining };
      });

      // Sort: categories with budgets first, then by name
      progressList.sort((a, b) => {
        if (a.budget && !b.budget) return -1;
        if (!a.budget && b.budget) return 1;
        return a.category.name.localeCompare(b.category.name);
      });

      setBudgetProgressList(progressList);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [currentMonth]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleEditBudget = (item: BudgetProgress) => {
    setEditingBudget(item.budget);
    setEditingCategory(item.category);
    setShowForm(true);
  };

  const handleAddBudget = () => {
    setEditingBudget(null);
    setEditingCategory(null);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingBudget(null);
    setEditingCategory(null);
  };

  const handleFormSuccess = () => {
    handleFormClose();
    fetchData();
  };

  const handleDeleteBudget = async (budgetId: string) => {
    if (!confirm("Are you sure you want to delete this budget?")) return;
    try {
      const res = await fetch(`/api/budgets/${budgetId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete budget");
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete budget");
    }
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);

  const getMonthLabel = (monthStr: string) => {
    const [year, month] = monthStr.split("-").map(Number);
    return new Date(year, month - 1, 1).toLocaleString("default", {
      month: "long",
      year: "numeric",
    });
  };

  const totalBudgeted = budgetProgressList.reduce((sum, item) => sum + item.limit, 0);
  const totalSpent = budgetProgressList.reduce((sum, item) => sum + item.spent, 0);
  const categoriesWithBudget = budgetProgressList.filter((item) => item.budget).length;
  const overBudgetCount = budgetProgressList.filter(
    (item) => item.budget && item.spent > item.limit
  ).length;

  return (
    <div className="min-h-screen bg-[#0f0f11] text-white">
      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Budget Dashboard
            </h1>
            <p className="text-gray-400 mt-1 text-sm">
              Track your spending limits and progress
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="month"
                value={currentMonth}
                onChange={(e) => setCurrentMonth(e.target.value)}
                className="bg-[#1a1a1f] border border-[#2a2a35] text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#f97316] transition-colors cursor-pointer"
              />
            </div>
            <button
              onClick={handleAddBudget}
              className="flex items-center gap-2 bg-[#f97316] hover:bg-[#ea6c0a] text-white font-semibold px-4 py-2 rounded-lg transition-colors duration-200 shadow-lg shadow-orange-900/20 text-sm whitespace-nowrap"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Set Budget
            </button>
          </div>
        </div>

        {/* Month Label */}
        <div className="mb-6">
          <span className="inline-flex items-center gap-2 bg-[#1a1a1f] border border-[#2a2a35] text-gray-300 text-sm px-3 py-1.5 rounded-full">
            <svg className="w-4 h-4 text-[#f97316]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {getMonthLabel(currentMonth)}
          </span>
        </div>

        {/* Summary Cards */}
        {!loading && !error && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="bg-[#1a1a1f] border border-[#2a2a35] rounded-xl p-4">
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Total Budgeted</p>
              <p className="text-white text-xl font-bold">{formatCurrency(totalBudgeted)}</p>
            </div>
            <div className="bg-[#1a1a1f] border border-[#2a2a35] rounded-xl p-4">
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Total Spent</p>
              <p className={`text-xl font-bold ${totalSpent > totalBudgeted && totalBudgeted > 0 ? "text-red-400" : "text-white"}`}>
                {formatCurrency(totalSpent)}
              </p>
            </div>
            <div className="bg-[#1a1a1f] border border-[#2a2a35] rounded-xl p-4">
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Categories Set</p>
              <p className="text-white text-xl font-bold">{categoriesWithBudget}</p>
            </div>
            <div className="bg-[#1a1a1f] border border-[#2a2a35] rounded-xl p-4">
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Over Budget</p>
              <p className={`text-xl font-bold ${overBudgetCount > 0 ? "text-red-400" : "text-emerald-400"}`}>
                {overBudgetCount}
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-900/20 border border-red-800/50 rounded-xl p-4 mb-6 flex items-center gap-3">
            <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-300 text-sm">{error}</p>
            <button onClick={fetchData} className="ml-auto text-red-400 hover:text-red-300 text-sm underline">
              Retry
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-[#1a1a1f] border border-[#2a2a35] rounded-xl p-5 animate-pulse">
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-2">
                    <div className="h-4 bg-[#2a2a35] rounded w-32" />
                    <div className="h-3 bg-[#2a2a35] rounded w-24" />
                  </div>
                  <div className="h-8 bg-[#2a2a35] rounded w-24" />
                </div>
                <div className="h-3 bg-[#2a2a35] rounded-full w-full" />
              </div>
            ))}
          </div>
        )}

        {/* Budget List */}
        {!loading && !error && (
          <div className="space-y-4">
            {budgetProgressList.length === 0 ? (
              <div className="bg-[#1a1a1f] border border-[#2a2a35] rounded-xl p-12 text-center">
                <div className="w-16 h-16 bg-[#2a2a35] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <p className="text-gray-300 font-medium mb-1">No categories found</p>
                <p className="text-gray-500 text-sm">Add categories and set budgets to get started</p>
              </div>
            ) : (
              budgetProgressList.map((item) => {
                const hasBudget = item.budget !== null;
                const percentage = hasBudget && item.limit > 0 ? (item.spent / item.limit) * 100 : 0;
                const isOverBudget = hasBudget && item.spent > item.limit;
                const isNearLimit = hasBudget && percentage >= 75 && percentage <= 100;

                return (
                  <div
                    key={item.category.id}
                    className={`bg-[#1a1a1f] border rounded-xl p-5 transition-all duration-200 hover:border-[#3a3a45] ${
                      isOverBudget
                        ? "border-red-800/50"
                        : isNearLimit
                        ? "border-yellow-800/50"
                        : "border-[#2a2a35]"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{
                            backgroundColor: item.category.color || "#f97316",
                          }}
                        />
                        <div>
                          <h3 className="text-white font-semibold text-base">
                            {item.category.name}
                          </h3>
                          {hasBudget ? (
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-gray-400 text-sm">
                                {formatCurrency(item.spent)} of {formatCurrency(item.limit)}
                              </span>
                              {isOverBudget && (
                                <span className="inline-flex items-center gap-1 bg-red-900/30 text-red-400 text-xs px-2 py-0.5 rounded-full border border-red-800/40">
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                  </svg>
                                  Over budget
                                </span>
                              )}
                              {isNearLimit && !isOverBudget && (
                                <span className="inline-flex items-center gap-1 bg-yellow-900/30 text-yellow-400 text-xs px-2 py-0.5 rounded-full border border-yellow-800/40">
                                  Near limit
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-500 text-sm">No budget set</span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        {hasBudget && (
                          <div className="text-right mr-2">
                            <p className={`text-sm font-medium ${isOverBudget ? "text-red-400" : "text-emerald-400"}`}>
                              {isOverBudget
                                ? `-${formatCurrency(Math.abs(item.remaining))} over`
                                : `${formatCurrency(item.remaining)} left`}
                            </p>
                          </div>
                        )}
                        <button
                          onClick={() => handleEditBudget(item)}
                          className="flex items-center gap-1.5 bg-[#2a2a35] hover:bg-[#f97316] text-gray-300 hover:text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-all duration-200"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          {hasBudget ? "Edit" : "Set Budget"}
                        </button>
                        {hasBudget && item.budget && (
                          <button
                            onClick={() => handleDeleteBudget(item.budget!.id)}
                            className="flex items-center gap-1.5 bg-[#2a2a35] hover:bg-red-900/50 text-gray-400 hover:text-red-400 text-xs font-medium px-2 py-1.5 rounded-lg transition-all duration-200"
                            title="Delete budget"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>

                    {hasBudget ? (
                      <BudgetProgressBar spent={item.spent} limit={item.limit} />
                    ) : (
                      <div className="mt-2">
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-gray-500 text-xs">No limit set</span>
                          <span className="text-gray-500 text-xs">
                            Spent: {formatCurrency(item.spent)}
                          </span>
                        </div>
                        <div className="w-full bg-[#2a2a35] rounded-full h-2">
                          <div className="bg-gray-600 h-2 rounded-full w-0" />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Overall Progress */}
        {!loading && !error && totalBudgeted > 0 && (
          <div className="mt-8 bg-[#1a1a1f] border border-[#2a2a35] rounded-xl p-5">
            <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
              <svg className="w-4 h-4 text-[#f97316]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Overall Budget Progress
            </h2>
            <BudgetProgressBar spent={totalSpent} limit={totalBudgeted} />
            <div className="flex justify-between mt-3 text-sm text-gray-400">
              <span>Total spent: <span className="text-white font-medium">{formatCurrency(totalSpent)}</span></span>
              <span>Total budget: <span className="text-white font-medium">{formatCurrency(totalBudgeted)}</span></span>
            </div>
          </div>
        )}
      </div>

      {/* Budget Form Modal */}
      {showForm && (
        <BudgetForm
          categories={categories}
          initialBudget={editingBudget}
          initialCategory={editingCategory}
          currentMonth={currentMonth}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
}