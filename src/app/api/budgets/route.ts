import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const monthParam = searchParams.get("month");

    let targetDate: Date;
    if (monthParam) {
      targetDate = new Date(monthParam);
    } else {
      targetDate = new Date();
    }

    const year = targetDate.getFullYear();
    const month = targetDate.getMonth();

    const monthStart = new Date(year, month, 1);
    const monthEnd = new Date(year, month + 1, 1);

    const budgets = await prisma.budget.findMany({
      where: {
        month: {
          gte: monthStart,
          lt: monthEnd,
        },
      },
      include: {
        category: true,
      },
      orderBy: {
        category: {
          name: "asc",
        },
      },
    });

    return NextResponse.json(budgets);
  } catch (error) {
    console.error("Error fetching budgets:", error);
    return NextResponse.json(
      { error: "Failed to fetch budgets" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { categoryId, amount, month } = body;

    if (!categoryId || amount === undefined || amount === null || !month) {
      return NextResponse.json(
        { error: "categoryId, amount, and month are required" },
        { status: 400 }
      );
    }

    if (typeof amount !== "number" || amount < 0) {
      return NextResponse.json(
        { error: "amount must be a non-negative number" },
        { status: 400 }
      );
    }

    const monthDate = new Date(month);
    if (isNaN(monthDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid month format" },
        { status: 400 }
      );
    }

    const year = monthDate.getFullYear();
    const monthIndex = monthDate.getMonth();
    const normalizedMonth = new Date(year, monthIndex, 1);
    const nextMonth = new Date(year, monthIndex + 1, 1);

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    const existingBudget = await prisma.budget.findFirst({
      where: {
        categoryId,
        month: {
          gte: normalizedMonth,
          lt: nextMonth,
        },
      },
    });

    let budget;
    if (existingBudget) {
      budget = await prisma.budget.update({
        where: { id: existingBudget.id },
        data: {
          amount,
          updatedAt: new Date(),
        },
        include: {
          category: true,
        },
      });
    } else {
      budget = await prisma.budget.create({
        data: {
          categoryId,
          amount,
          month: normalizedMonth,
        },
        include: {
          category: true,
        },
      });
    }

    return NextResponse.json(budget, {
      status: existingBudget ? 200 : 201,
    });
  } catch (error) {
    console.error("Error creating/updating budget:", error);
    return NextResponse.json(
      { error: "Failed to create or update budget" },
      { status: 500 }
    );
  }
}