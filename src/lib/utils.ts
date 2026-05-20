import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Frequency } from "@/types/index";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(d);
}

export function formatDateInput(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getNextDueDate(currentDate: Date, frequency: Frequency): Date {
  const next = new Date(currentDate);
  switch (frequency) {
    case "WEEKLY":
      next.setDate(next.getDate() + 7);
      break;
    case "MONTHLY":
      next.setMonth(next.getMonth() + 1);
      break;
    case "YEARLY":
      next.setFullYear(next.getFullYear() + 1);
      break;
    default:
      break;
  }
  return next;
}

export function frequencyLabel(frequency: Frequency): string {
  switch (frequency) {
    case "WEEKLY":
      return "Weekly";
    case "MONTHLY":
      return "Monthly";
    case "YEARLY":
      return "Yearly";
    default:
      return frequency;
  }
}

export function frequencyColor(frequency: Frequency): string {
  switch (frequency) {
    case "WEEKLY":
      return "bg-blue-500/20 text-blue-400 border border-blue-500/30";
    case "MONTHLY":
      return "bg-purple-500/20 text-purple-400 border border-purple-500/30";
    case "YEARLY":
      return "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30";
    default:
      return "bg-gray-500/20 text-gray-400 border border-gray-500/30";
  }
}

export function isOverdue(nextDueDate: string | Date): boolean {
  const due = typeof nextDueDate === "string" ? new Date(nextDueDate) : nextDueDate;
  return due <= new Date();
}

export function daysUntilDue(nextDueDate: string | Date): number {
  const due = typeof nextDueDate === "string" ? new Date(nextDueDate) : nextDueDate;
  const now = new Date();
  const diffMs = due.getTime() - now.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

export function dueDateLabel(nextDueDate: string | Date): string {
  const days = daysUntilDue(nextDueDate);
  if (days < 0) {
    return `Overdue by ${Math.abs(days)} day${Math.abs(days) === 1 ? "" : "s"}`;
  }
  if (days === 0) {
    return "Due today";
  }
  if (days === 1) {
    return "Due tomorrow";
  }
  return `Due in ${days} days`;
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + "...";
}

export function capitalize(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}