"use client";
import React from 'react';

import { useState, useEffect } from "react";

interface Category {
  id: string;
  name: string;
}

interface RecurringFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function RecurringForm({ onClose, onSuccess }: RecurringFormProps) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [frequency, setFrequency] = useState<"WEEKLY" | "MONTHLY" | "YEARLY">("MONTHLY");
  const [startDate, setStartDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fetchingCategories, setFetchingCategories] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
          if (data.length > 0) {
            setCategoryId(data[0].id);
          }
        }
      } catch {
        // silently fail
      } finally {
        setFetchingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Please enter a valid amount greater than 0.");
      return;
    }
    if (!categoryId) {
      setError("Please select a category.");
      return;
    }
    if (!startDate) {
      setError("Please select a start date.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/recurring", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          amount: parsedAmount,
          categoryId,
          frequency,
          nextDueDate: new Date(startDate).toISOString(),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to create recurring expense.");
        return;
      }

      onSuccess();
      onClose();
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const frequencyOptions = [
    { value: "WEEKLY", label: "Weekly" },
    { value: "MONTHLY", label: "Monthly" },
    { value: "YEARLY", label: "Yearly" },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-md rounded-2xl shadow-2xl"
        style={{
          backgroundColor: "#18181b",
          border: "1px solid #27272a",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5"
          style={{ borderBottom: "1px solid #27272a" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center w-9 h-9 rounded-xl"
              style={{ backgroundColor: "rgba(249,115,22,0.15)" }}
            >
              <svg
                className="w-5 h-5"
                style={{ color: "#f97316" }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-white">New Recurring Expense</h2>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors duration-150"
            style={{ color: "#71717a" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#27272a";
              (e.currentTarget as HTMLButtonElement).style.color = "#ffffff";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
              (e.currentTarget as HTMLButtonElement).style.color = "#71717a";
            }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          {/* Error */}
          {error && (
            <div
              className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm"
              style={{
                backgroundColor: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.3)",
                color: "#f87171",
              }}
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {error}
            </div>
          )}

          {/* Title */}
          <div className="space-y-2">
            <label className="block text-sm font-medium" style={{ color: "#a1a1aa" }}>
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Netflix Subscription"
              className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-zinc-500 outline-none transition-all duration-150"
              style={{
                backgroundColor: "#09090b",
                border: "1px solid #27272a",
              }}
              onFocus={(e) => {
                e.currentTarget.style.border = "1px solid #f97316";
                e.currentTarget.style.boxShadow = "0 0 0 3px rgba(249,115,22,0.1)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.border = "1px solid #27272a";
                e.currentTarget.style.boxShadow = "none";
              }}
              required
            />
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <label className="block text-sm font-medium" style={{ color: "#a1a1aa" }}>
              Amount
            </label>
            <div className="relative">
              <span
                className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium"
                style={{ color: "#71717a" }}
              >
                $
              </span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                min="0.01"
                step="0.01"
                className="w-full pl-8 pr-4 py-3 rounded-xl text-sm text-white placeholder-zinc-500 outline-none transition-all duration-150"
                style={{
                  backgroundColor: "#09090b",
                  border: "1px solid #27272a",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.border = "1px solid #f97316";
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(249,115,22,0.1)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.border = "1px solid #27272a";
                  e.currentTarget.style.boxShadow = "none";
                }}
                required
              />
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="block text-sm font-medium" style={{ color: "#a1a1aa" }}>
              Category
            </label>
            {fetchingCategories ? (
              <div
                className="w-full px-4 py-3 rounded-xl text-sm"
                style={{
                  backgroundColor: "#09090b",
                  border: "1px solid #27272a",
                  color: "#71717a",
                }}
              >
                Loading categories...
              </div>
            ) : (
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none transition-all duration-150 cursor-pointer"
                style={{
                  backgroundColor: "#09090b",
                  border: "1px solid #27272a",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.border = "1px solid #f97316";
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(249,115,22,0.1)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.border = "1px solid #27272a";
                  e.currentTarget.style.boxShadow = "none";
                }}
                required
              >
                {categories.length === 0 ? (
                  <option value="" disabled>
                    No categories available
                  </option>
                ) : (
                  categories.map((cat) => (
                    <option key={cat.id} value={cat.id} style={{ backgroundColor: "#18181b" }}>
                      {cat.name}
                    </option>
                  ))
                )}
              </select>
            )}
          </div>

          {/* Frequency */}
          <div className="space-y-2">
            <label className="block text-sm font-medium" style={{ color: "#a1a1aa" }}>
              Frequency
            </label>
            <div className="grid grid-cols-3 gap-2">
              {frequencyOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setFrequency(opt.value as "WEEKLY" | "MONTHLY" | "YEARLY")}
                  className="px-3 py-3 rounded-xl text-sm font-medium transition-all duration-150"
                  style={
                    frequency === opt.value
                      ? {
                          backgroundColor: "rgba(249,115,22,0.15)",
                          border: "1px solid #f97316",
                          color: "#f97316",
                        }
                      : {
                          backgroundColor: "#09090b",
                          border: "1px solid #27272a",
                          color: "#71717a",
                        }
                  }
                  onMouseEnter={(e) => {
                    if (frequency !== opt.value) {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = "#3f3f46";
                      (e.currentTarget as HTMLButtonElement).style.color = "#a1a1aa";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (frequency !== opt.value) {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = "#27272a";
                      (e.currentTarget as HTMLButtonElement).style.color = "#71717a";
                    }
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Start Date */}
          <div className="space-y-2">
            <label className="block text-sm font-medium" style={{ color: "#a1a1aa" }}>
              Start Date (First Due Date)
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none transition-all duration-150"
              style={{
                backgroundColor: "#09090b",
                border: "1px solid #27272a",
                colorScheme: "dark",
              }}
              onFocus={(e) => {
                e.currentTarget.style.border = "1px solid #f97316";
                e.currentTarget.style.boxShadow = "0 0 0 3px rgba(249,115,22,0.1)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.border = "1px solid #27272a";
                e.currentTarget.style.boxShadow = "none";
              }}
              required
            />
          </div>

          {/* Summary */}
          {title && amount && parseFloat(amount) > 0 && (
            <div
              className="px-4 py-3 rounded-xl text-sm"
              style={{
                backgroundColor: "rgba(249,115,22,0.05)",
                border: "1px solid rgba(249,115,22,0.2)",
              }}
            >
              <p style={{ color: "#a1a1aa" }}>
                <span style={{ color: "#f97316" }} className="font-medium">
                  {title}
                </span>{" "}
                will be logged as{" "}
                <span style={{ color: "#f97316" }} className="font-medium">
                  ${parseFloat(amount || "0").toFixed(2)}
                </span>{" "}
                every{" "}
                <span style={{ color: "#f97316" }} className="font-medium">
                  {frequency.toLowerCase()}
                </span>{" "}
                starting{" "}
                <span style={{ color: "#f97316" }} className="font-medium">
                  {startDate
                    ? new Date(startDate + "T00:00:00").toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "—"}
                </span>
                .
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150"
              style={{
                backgroundColor: "#27272a",
                color: "#a1a1aa",
                border: "1px solid #3f3f46",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#3f3f46";
                (e.currentTarget as HTMLButtonElement).style.color = "#ffffff";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#27272a";
                (e.currentTarget as HTMLButtonElement).style.color = "#a1a1aa";
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || fetchingCategories}
              className="flex-1 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 flex items-center justify-center gap-2"
              style={{
                backgroundColor: loading ? "rgba(249,115,22,0.5)" : "#f97316",
                color: "#ffffff",
                cursor: loading ? "not-allowed" : "pointer",
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#ea6c0a";
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#f97316";
                }
              }}
            >
              {loading ? (
                <>
                  <svg
                    className="w-4 h-4 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Creating...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create Recurring
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}