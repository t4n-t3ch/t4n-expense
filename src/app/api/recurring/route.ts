import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const recurringExpenses = await prisma.recurringExpense.findMany({
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(recurringExpenses, { status: 200 });
  } catch (error) {
    console.error('Error fetching recurring expenses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recurring expenses' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, amount, categoryId, frequency, nextDueDate } = body;

    if (!title || typeof title !== 'string' || title.trim() === '') {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    if (amount === undefined || amount === null || isNaN(Number(amount)) || Number(amount) <= 0) {
      return NextResponse.json(
        { error: 'Amount must be a positive number' },
        { status: 400 }
      );
    }

    if (!categoryId || typeof categoryId !== 'string') {
      return NextResponse.json(
        { error: 'Category is required' },
        { status: 400 }
      );
    }

    const validFrequencies = ['WEEKLY', 'MONTHLY', 'YEARLY'];
    if (!frequency || !validFrequencies.includes(frequency)) {
      return NextResponse.json(
        { error: 'Frequency must be WEEKLY, MONTHLY, or YEARLY' },
        { status: 400 }
      );
    }

    if (!nextDueDate) {
      return NextResponse.json(
        { error: 'Next due date is required' },
        { status: 400 }
      );
    }

    const parsedDate = new Date(nextDueDate);
    if (isNaN(parsedDate.getTime())) {
      return NextResponse.json(
        { error: 'Invalid next due date' },
        { status: 400 }
      );
    }

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    const recurringExpense = await prisma.recurringExpense.create({
      data: {
        title: title.trim(),
        amount: Number(amount),
        categoryId,
        frequency,
        nextDueDate: parsedDate,
        isActive: true,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(recurringExpense, { status: 201 });
  } catch (error) {
    console.error('Error creating recurring expense:', error);
    return NextResponse.json(
      { error: 'Failed to create recurring expense' },
      { status: 500 }
    );
  }
}