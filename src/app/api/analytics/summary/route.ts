import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const monthParam = searchParams.get("month"); // format: YYYY-MM

    // Determine target month
    const now = new Date();
    let targetYear = now.getFullYear();
    let targetMonth = now.getMonth(); // 0-indexed

    if (monthParam) {
      const parts = monthParam.split("-");
      if (parts.length === 2) {
        targetYear = parseInt(parts[0], 10);
        targetMonth = parseInt(parts[1], 10) - 1; // convert to 0-indexed
      }
    }

    const monthStart = new Date(targetYear, targetMonth, 1);
    const monthEnd = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59, 999);

    // Previous month for comparison
    const prevMonthStart = new Date(targetYear, targetMonth - 1, 1);
    const prevMonthEnd = new Date(targetYear, targetMonth, 0, 23, 59, 59, 999);

    // 1. Total spent per category for current month
    const currentMonthExpenses = await prisma.expense.findMany({
      where: {
        date: {
          gte: monthStart,
          lte: monthEnd,
        },
      },
      include: {
        category: true,
      },
    });

    const categoryMap: Record<string, { id: string; name: string; color: string; total: number }> = {};
    for (const expense of currentMonthExpenses) {
      const catId = expense.categoryId ?? "uncategorized";
      const catName = expense.category?.name ?? "Uncategorized";
      const catColor = expense.category?.color ?? "#6b7280";
      if (!categoryMap[catId]) {
        categoryMap[catId] = { id: catId, name: catName, color: catColor, total: 0 };
      }
      categoryMap[catId].total += expense.amount;
    }
    const categoryTotals = Object.values(categoryMap).sort((a, b) => b.total - a.total);

    // 2. Previous month category totals for comparison
    const prevMonthExpenses = await prisma.expense.findMany({
      where: {
        date: {
          gte: prevMonthStart,
          lte: prevMonthEnd,
        },
      },
      include: {
        category: true,
      },
    });

    const prevCategoryMap: Record<string, { id: string; name: string; color: string; total: number }> = {};
    for (const expense of prevMonthExpenses) {
      const catId = expense.categoryId ?? "uncategorized";
      const catName = expense.category?.name ?? "Uncategorized";
      const catColor = expense.category?.color ?? "#6b7280";
      if (!prevCategoryMap[catId]) {
        prevCategoryMap[catId] = { id: catId, name: catName, color: catColor, total: 0 };
      }
      prevCategoryMap[catId].total += expense.amount;
    }

    // Build month-over-month comparison
    const allCategoryIds = new Set([
      ...Object.keys(categoryMap),
      ...Object.keys(prevCategoryMap),
    ]);

    const monthOverMonth = Array.from(allCategoryIds).map((catId) => {
      const current = categoryMap[catId];
      const prev = prevCategoryMap[catId];
      const currentTotal = current?.total ?? 0;
      const prevTotal = prev?.total ?? 0;
      const name = current?.name ?? prev?.name ?? "Uncategorized";
      const color = current?.color ?? prev?.color ?? "#6b7280";

      let percentChange: number | null = null;
      if (prevTotal > 0) {
        percentChange = ((currentTotal - prevTotal) / prevTotal) * 100;
      } else if (currentTotal > 0) {
        percentChange = 100;
      }

      return {
        id: catId,
        name,
        color,
        currentTotal,
        prevTotal,
        percentChange,
      };
    }).sort((a, b) => b.currentTotal - a.currentTotal);

    // 3. Monthly totals for last 6 months
    const monthlyTotals: { month: string; year: number; monthIndex: number; total: number }[] = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(targetYear, targetMonth - i, 1);
      const mStart = new Date(d.getFullYear(), d.getMonth(), 1);
      const mEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);

      const expenses = await prisma.expense.findMany({
        where: {
          date: {
            gte: mStart,
            lte: mEnd,
          },
        },
        select: {
          amount: true,
        },
      });

      const total = expenses.reduce((sum, e) => sum + e.amount, 0);
      const monthLabel = mStart.toLocaleString("default", { month: "short" });

      monthlyTotals.push({
        month: monthLabel,
        year: d.getFullYear(),
        monthIndex: d.getMonth(),
        total,
      });
    }

    // 4. Top 5 largest individual expenses this month
    const topExpenses = await prisma.expense.findMany({
      where: {
        date: {
          gte: monthStart,
          lte: monthEnd,
        },
      },
      include: {
        category: true,
      },
      orderBy: {
        amount: "desc",
      },
      take: 5,
    });

    const topExpensesFormatted = topExpenses.map((e) => ({
      id: e.id,
      description: e.description,
      amount: e.amount,
      date: e.date.toISOString(),
      category: e.category
        ? { id: e.category.id, name: e.category.name, color: e.category.color }
        : null,
    }));

    // 5. Summary totals
    const totalSpentThisMonth = currentMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
    const totalSpentLastMonth = prevMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
    let totalPercentChange: number | null = null;
    if (totalSpentLastMonth > 0) {
      totalPercentChange = ((totalSpentThisMonth - totalSpentLastMonth) / totalSpentLastMonth) * 100;
    } else if (totalSpentThisMonth > 0) {
      totalPercentChange = 100;
    }

    return NextResponse.json({
      targetMonth: {
        year: targetYear,
        month: targetMonth + 1, // 1-indexed for display
        label: monthStart.toLocaleString("default", { month: "long", year: "numeric" }),
      },
      summary: {
        totalSpentThisMonth,
        totalSpentLastMonth,
        totalPercentChange,
        expenseCount: currentMonthExpenses.length,
      },
      categoryTotals,
      monthOverMonth,
      monthlyTotals,
      topExpenses: topExpensesFormatted,
    });
  } catch (error) {
    console.error("Analytics summary error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics summary" },
      { status: 500 }
    );
  }
}