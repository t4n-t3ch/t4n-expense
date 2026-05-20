import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function getNextDueDate(currentDate: Date, frequency: string): Date {
  const next = new Date(currentDate);
  switch (frequency) {
    case 'WEEKLY':
      next.setDate(next.getDate() + 7);
      break;
    case 'MONTHLY':
      next.setMonth(next.getMonth() + 1);
      break;
    case 'YEARLY':
      next.setFullYear(next.getFullYear() + 1);
      break;
    default:
      next.setMonth(next.getMonth() + 1);
  }
  return next;
}

export async function POST(request: NextRequest) {
  try {
    const now = new Date();

    const dueRecurring = await prisma.recurringExpense.findMany({
      where: {
        isActive: true,
        nextDueDate: {
          lte: now,
        },
      },
      include: {
        category: true,
      },
    });

    if (dueRecurring.length === 0) {
      return NextResponse.json({
        message: 'No due recurring expenses found.',
        processed: 0,
      });
    }

    let processedCount = 0;

    for (const recurring of dueRecurring) {
      try {
        await prisma.expense.create({
          data: {
            title: recurring.title,
            amount: recurring.amount,
            categoryId: recurring.categoryId,
            date: recurring.nextDueDate,
          },
        });

        const newNextDueDate = getNextDueDate(recurring.nextDueDate, recurring.frequency);

        await prisma.recurringExpense.update({
          where: { id: recurring.id },
          data: {
            nextDueDate: newNextDueDate,
          },
        });

        processedCount++;
      } catch (innerError) {
        console.error(`Failed to process recurring expense id=${recurring.id}:`, innerError);
      }
    }

    return NextResponse.json({
      message: `Successfully processed ${processedCount} recurring expense(s).`,
      processed: processedCount,
    });
  } catch (error) {
    console.error('Error processing recurring expenses:', error);
    return NextResponse.json(
      { error: 'Failed to process recurring expenses' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}