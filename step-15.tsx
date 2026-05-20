// src/app/api/recurring/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { addDays } from "date-fns";

function getNextDueDate(current: Date, frequency: string): Date {
  switch (frequency) {
    case "WEEKLY":
      return addDays(current, 7);
    case "MONTHLY":
      return addDays(current, 30);
    case "YEARLY":
      return addDays(current, 365);
    default:
      return addDays(current, 30);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    const existing = await prisma.recurringExpense.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Recurring expense not found" },
        { status: 404 }
      );
    }

    const updateData: Record<string, unknown> = {};

    if (typeof body.isActive === "boolean") {
      updateData.isActive = body.isActive;
    }
    if (body.title !== undefined) {
      updateData.title = body.title;
    }
    if (body.amount !== undefined) {
      updateData.amount = parseFloat(body.amount);
    }
    if (body.categoryId !== undefined) {
      updateData.categoryId = body.categoryId;
    }
    if (body.frequency !== undefined) {
      updateData.frequency = body.frequency;
    }
    if (body.nextDueDate !== undefined) {
      updateData.nextDueDate = new Date(body.nextDueDate);
    }

    const updated = await prisma.recurringExpense.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating recurring expense:", error);
    return NextResponse.json(
      { error: "Failed to update recurring expense" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const existing = await prisma.recurringExpense.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Recurring expense not found" },
        { status: 404 }
      );
    }

    await prisma.recurringExpense.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Recurring expense deleted successfully" });
  } catch (error) {
    console.error("Error deleting recurring expense:", error);
    return NextResponse.json(
      { error: "Failed to delete recurring expense" },
      { status: 500 }
    );
  }
}