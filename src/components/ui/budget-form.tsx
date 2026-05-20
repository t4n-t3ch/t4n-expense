"use client";
import React from 'react';

import { useState, useEffect } from "react";
import { X } from "lucide-react";

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
}

interface BudgetFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingBudget?: Budget | null;
  preselectedCategoryId?: string;
}

export default function BudgetForm({
  isOpen,
  onClose,
  onSuccess,
  editingBudget,
  preselectedCategoryId,
}: BudgetFormProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [amount, setAmount] = useState("");
  const [month, setMonth] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fetchingCategories, setFetchingCategories] = useState(false);

  const getCurrentMonth = () => {
    const now = new Date();
    const year = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    return `${year}-${m}`;
  };

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      if (editingBudget) {
        setCategoryId(editingBudget.categoryId);
        setAmount(String(editingBudget.amount));
        const d = new Date(editingBudget.month);
        const year = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        setMonth(`${year}-${m}`);
      } else {
        setCategoryId(preselectedCategoryId || "");
        setAmount("");
        setMonth(getCurrentMonth());
      }
      setError("");
    }
  }, [isOpen, editingBudget, preselectedCategoryId]);

  const fetchCategories = async () => {
    setFetchingCategories(true);
    try {
      const res = await fetch("/api/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch {
      // silently fail
    } finally {
      setFetchingCategories(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!categoryId) {
      setError("Please select a category.");
      return;
    }
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError("Please enter a valid amount greater than 0.");
      return;
    }
    if (!month) {
      setError("Please select a month.");
      return;
    }

    setLoading(true);

    try {
      const [year, monthNum] = month.split("-").map(Number);
      const monthDate = new Date(year, monthNum - 1, 1).toISOString();

      if (editingBudget) {
        const res = await fetch(`/api/budgets/${editingBudget.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: Number(amount) }),
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to update budget.");
        }
      } else {
        const res = await fetch("/api/budgets", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            categoryId,
            amount: Number(amount),
            month: monthDate,
          }),
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to create budget.");
        }
      }

      onSuccess();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-[#1a1a1f] shadow-2xl shadow-black/50">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <h2 className="text-lg font-semibold text-white">
            {editingBudget ? "Edit Budget" : "Set Budget"}
          </h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Category */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Category
            </label>
            {fetchingCategories ? (
              <div className="h-11 animate-pulse rounded-lg bg-white/5" />
            ) : (
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                disabled={!!editingBudget}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none transition-colors focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="" className="bg-[#1a1a1f] text-gray-400">
                  Select a category...
                </option>
                {categories.map((cat) => (
                  <option
                    key={cat.id}
                    value={cat.id}
                    className="bg-[#1a1a1f] text-white"
                  >
                    {cat.name}
                  </option>
                ))}
              </select>
            )}
            {editingBudget && (
              <p className="text-xs text-gray-500">
                Category cannot be changed when editing a budget.
              </p>
            )}
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Budget Limit ($)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                $
              </span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                min="0.01"
                step="0.01"
                className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-8 pr-4 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30"
              />
            </div>
          </div>

          {/* Month */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Month
            </label>
            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              disabled={!!editingBudget}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none transition-colors focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30 disabled:cursor-not-allowed disabled:opacity-50 [color-scheme:dark]"
            />
            {editingBudget && (
              <p className="text-xs text-gray-500">
                Month cannot be changed when editing a budget.
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? editingBudget
                  ? "Saving..."
                  : "Creating..."
                : editingBudget
                ? "Save Changes"
                : "Set Budget"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}