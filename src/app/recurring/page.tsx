"use client";
import React from 'react';

import { useState, useEffect, useCallback } from "react";

interface Category {
  id: string;
  name: string;
}

interface RecurringExpense {
  id: string;
  title: string;
  amount: number;
  categoryId: string;
  category: Category;
  frequency: "WEEKLY" | "MONTHLY" | "YEARLY";
  nextDueDate: string;
  isActive: boolean;
  createdAt: string;
}

interface ProcessResult {
  processed: number;
  message: string;
}

const frequencyColors: Record<string, string> = {
  WEEKLY: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
  MONTHLY: "bg-purple-500/20 text-purple-400 border border-purple-500/30",
  YEARLY: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
};

const frequencyLabels: Record<string, string> = {
  WEEKLY: "Weekly",
  MONTHLY: "Monthly",
  YEARLY: "Yearly",
};

function AddRecurringModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    title: "",
    amount: "",
    categoryId: "",
    frequency: "MONTHLY",
    nextDueDate: new Date().toISOString().split("T")[0],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCategories([]));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.title.trim()) return setError("Title is required.");
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0)
      return setError("Please enter a valid amount.");
    if (!form.categoryId) return setError("Please select a category.");
    if (!form.nextDueDate) return setError("Please select a start date.");

    setLoading(true);
    try {
      const res = await fetch("/api/recurring", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title.trim(),
          amount: parseFloat(form.amount),
          categoryId: form.categoryId,
          frequency: form.frequency,
          nextDueDate: new Date(form.nextDueDate).toISOString(),
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create recurring expense.");
      }
      onCreated();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#18181b] border border-white/10 rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">New Recurring Expense</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Title
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Netflix Subscription"
              className="w-full bg-[#0f0f11] border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Amount ($)
            </label>
            <input
              type="number"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              placeholder="0.00"
              min="0"
              step="0.01"
              className="w-full bg-[#0f0f11] border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Category
            </label>
            <select
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              className="w-full bg-[#0f0f11] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30 transition-all"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Frequency
            </label>
            <select
              value={form.frequency}
              onChange={(e) => setForm({ ...form, frequency: e.target.value })}
              className="w-full bg-[#0f0f11] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30 transition-all"
            >
              <option value="WEEKLY">Weekly</option>
              <option value="MONTHLY">Monthly</option>
              <option value="YEARLY">Yearly</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={form.nextDueDate}
              onChange={(e) => setForm({ ...form, nextDueDate: e.target.value })}
              className="w-full bg-[#0f0f11] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30 transition-all"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg border border-white/10 text-gray-300 hover:bg-white/5 transition-all font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-500/20"
            >
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function RecurringPage() {
  const [expenses, setExpenses] = useState<RecurringExpense[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [processResult, setProcessResult] = useState<ProcessResult | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/recurring");
      if (!res.ok) throw new Error("Failed to fetch recurring expenses.");
      const data = await res.json();
      setExpenses(Array.isArray(data) ? data : []);
    } catch {
      setError("Could not load recurring expenses. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const handleToggleActive = async (expense: RecurringExpense) => {
    setTogglingId(expense.id);
    try {
      const res = await fetch(`/api/recurring/${expense.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !expense.isActive }),
      });
      if (!res.ok) throw new Error("Failed to update.");
      await fetchExpenses();
    } catch {
      setError("Failed to toggle status.");
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this recurring expense?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/recurring/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete.");
      await fetchExpenses();
    } catch {
      setError("Failed to delete recurring expense.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleProcessDue = async () => {
    setProcessing(true);
    setProcessResult(null);
    setError("");
    try {
      const res = await fetch("/api/recurring/process", { method: "POST" });
      if (!res.ok) throw new Error("Failed to process.");
      const data = await res.json();
      setProcessResult({
        processed: data.processed ?? 0,
        message:
          data.processed === 0
            ? "No expenses were due for processing."
            : `Successfully auto-logged ${data.processed} expense${data.processed !== 1 ? "s" : ""}.`,
      });
      await fetchExpenses();
    } catch {
      setError("Failed to process due expenses.");
    } finally {
      setProcessing(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const isOverdue = (dateStr: string) => {
    return new Date(dateStr) < new Date();
  };

  const activeExpenses = expenses.filter((e) => e.isActive);
  const inactiveExpenses = expenses.filter((e) => !e.isActive);

  return (
    <div className="min-h-screen bg-[#0f0f11] text-white">
      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Recurring Expenses</h1>
            <p className="text-gray-400 mt-1 text-sm">
              Manage your scheduled expenses and auto-log them when due.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleProcessDue}
              disabled={processing}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {processing ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Process Due Expenses
                </>
              )}
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold transition-all shadow-lg shadow-orange-500/20 text-sm"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Recurring
            </button>
          </div>
        </div>

        {/* Process Result Banner */}
        {processResult && (
          <div
            className={`mb-6 p-4 rounded-xl border flex items-center justify-between gap-4 ${
              processResult.processed > 0
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : "bg-blue-500/10 border-blue-500/30 text-blue-400"
            }`}
          >
            <div className="flex items-center gap-3">
              <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">{processResult.message}</span>
            </div>
            <button
              onClick={() => setProcessResult(null)}
              className="text-current opacity-60 hover:opacity-100 transition-opacity text-xl leading-none"
            >
              &times;
            </button>
          </div>
        )}

        {/* Error Banner */}
        {error && (
          <div className="mb-6 p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
            <button
              onClick={() => setError("")}
              className="text-current opacity-60 hover:opacity-100 transition-opacity text-xl leading-none"
            >
              &times;
            </button>
          </div>
        )}

        {/* Stats Row */}
        {!loading && expenses.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="bg-[#18181b] border border-white/10 rounded-xl p-4">
              <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">Total</p>
              <p className="text-2xl font-bold text-white">{expenses.length}</p>
            </div>
            <div className="bg-[#18181b] border border-white/10 rounded-xl p-4">
              <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">Active</p>
              <p className="text-2xl font-bold text-emerald-400">{activeExpenses.length}</p>
            </div>
            <div className="bg-[#18181b] border border-white/10 rounded-xl p-4">
              <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">Inactive</p>
              <p className="text-2xl font-bold text-gray-400">{inactiveExpenses.length}</p>
            </div>
            <div className="bg-[#18181b] border border-white/10 rounded-xl p-4">
              <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">Monthly Total</p>
              <p className="text-2xl font-bold text-orange-400">
                $
                {activeExpenses
                  .reduce((sum, e) => {
                    if (e.frequency === "WEEKLY") return sum + e.amount * 4.33;
                    if (e.frequency === "MONTHLY") return sum + e.amount;
                    if (e.frequency === "YEARLY") return sum + e.amount / 12;
                    return sum;
                  }, 0)
                  .toFixed(0)}
              </p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <svg className="animate-spin h-8 w-8 text-orange-500" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            <p className="text-gray-400">Loading recurring expenses...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && expenses.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
              <svg className="h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-white mb-1">No recurring expenses yet</h3>
              <p className="text-gray-400 text-sm max-w-xs">
                Add your first recurring expense to automatically track subscriptions, bills, and more.
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="mt-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold transition-all shadow-lg shadow-orange-500/20 text-sm"
            >
              Add Your First Recurring Expense
            </button>
          </div>
        )}

        {/* Active Expenses */}
        {!loading && activeExpenses.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Active ({activeExpenses.length})
            </h2>
            <div className="space-y-3">
              {activeExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="bg-[#18181b] border border-white/10 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:border-white/20 transition-all group"
                >
                  {/* Left: Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-semibold text-white text-base truncate">{expense.title}</h3>
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${frequencyColors[expense.frequency]}`}
                      >
                        {frequencyLabels[expense.frequency]}
                      </span>
                      {isOverdue(expense.nextDueDate) && (
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                          Overdue
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        {expense.category?.name ?? "Uncategorized"}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Next due: {formatDate(expense.nextDueDate)}
                      </span>
                    </div>
                  </div>

                  {/* Right: Amount + Actions */}
                  <div className="flex items-center gap-3 sm:gap-4">
                    <span className="text-xl font-bold text-orange-400">
                      ${expense.amount.toFixed(2)}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleActive(expense)}
                        disabled={togglingId === expense.id}
                        title="Deactivate"
                        className="p-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 transition-all disabled:opacity-50"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(expense.id)}
                        disabled={deletingId === expense.id}
                        title="Delete"
                        className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 transition-all disabled:opacity-50"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Inactive Expenses */}
        {!loading && inactiveExpenses.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Inactive ({inactiveExpenses.length})
            </h2>
            <div className="space-y-3">
              {inactiveExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="bg-[#18181b] border border-white/5 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4 opacity-60 hover:opacity-80 transition-all"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-300 text-base truncate">{expense.title}</h3>
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${frequencyColors[expense.frequency]}`}
                      >
                        {frequencyLabels[expense.frequency]}
                      </span>
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-500/20 text-gray-400 border border-gray-500/30">
                        Inactive
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        {expense.category?.name ?? "Uncategorized"}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Next due: {formatDate(expense.nextDueDate)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-4">
                    <span className="text-xl font-bold text-gray-400">
                      ${expense.amount.toFixed(2)}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleActive(expense)}
                        disabled={togglingId === expense.id}
                        title="Activate"
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 transition-all disabled:opacity-50"