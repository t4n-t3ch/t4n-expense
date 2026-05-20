import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const monthParam = searchParams.get('month');

    // Default to current month if not provided
    const now = monthParam ? new Date(monthParam) : new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    const budgets = await prisma.budget.findMany({
      where: {
        month: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
      include: {
        category: true,
      },
      orderBy: {
        category: {
          name: 'asc',
        },
      },
    });

    // Also get all categories to show ones without budgets
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
    });

    // Get expenses for this month grouped by category
    const expenses = await prisma.expense.groupBy({
      by: ['categoryId'],
      where: {
        date: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
      _sum: {
        amount: true,
      },
    });

    const expenseMap = new Map(
      expenses.map((e) => [e.categoryId, e._sum.amount ?? 0])
    );

    const budgetMap = new Map(budgets.map((b) => [b.categoryId, b]));

    const result = categories.map((category) => {
      const budget = budgetMap.get(category.id) ?? null;
      const spent = expenseMap.get(category.id) ?? 0;
      return {
        category,
        budget,
        spent,
        remaining: budget ? budget.amount - spent : null,
        percentage: budget && budget.amount > 0 ? (spent / budget.amount) * 100 : null,
      };
    });

    return NextResponse.json({ data: result, month: startOfMonth.toISOString() });
  } catch (error) {
    console.error('GET /api/budgets error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch budgets' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { categoryId, amount, month } = body;

    if (!categoryId || amount === undefined || amount === null) {
      return NextResponse.json(
        { error: 'categoryId and amount are required' },
        { status: 400 }
      );
    }

    if (typeof amount !== 'number' || amount < 0) {
      return NextResponse.json(
        { error: 'amount must be a non-negative number' },
        { status: 400 }
      );
    }

    // Parse month or default to current month
    const targetDate = month ? new Date(month) : new Date();
    const startOfMonth = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);

    // Verify category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Upsert: create or update budget for this category+month
    const endOfMonth = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0, 23, 59, 59, 999);

    const existingBudget = await prisma.budget.findFirst({
      where: {
        categoryId,
        month: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    });

    let budget;
    if (existingBudget) {
      budget = await prisma.budget.update({
        where: { id: existingBudget.id },
        data: { amount },
        include: { category: true },
      });
    } else {
      budget = await prisma.budget.create({
        data: {
          categoryId,
          amount,
          month: startOfMonth,
        },
        include: { category: true },
      });
    }

    return NextResponse.json({ data: budget }, { status: existingBudget ? 200 : 201 });
  } catch (error) {
    console.error('POST /api/budgets error:', error);
    return NextResponse.json(
      { error: 'Failed to create or update budget' },
      { status: 500 }
    );
  }
}