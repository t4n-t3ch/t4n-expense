Edit Plan

1. prisma/schema.prisma — EDIT: Add RecurringExpense model with fields id, title, amount, categoryId, frequency (enum: WEEKLY/MONTHLY/YEARLY), nextDueDate, isActive, createdAt, and add relation to Category model
2. src/app/api/recurring/route.ts — NEW: GET handler to list all recurring expenses (with category relation), POST handler to create new recurring expense with validation
3. src/app/api/recurring/[id]/route.ts — NEW: PATCH handler to toggle isActive or update fields, DELETE handler to remove a recurring expense by id
4. src/app/api/recurring/process/route.ts — NEW: POST handler that queries all active recurring expenses where nextDueDate <= now, creates Expense entries for each, updates nextDueDate based on frequency (add 7/30/365 days), returns count of processed expenses
5. src/app/recurring/page.tsx — NEW: Full page component with server-side or client-side data fetching, displays list of recurring expenses with frequency badge, next due date, amount, category name, active/inactive toggle button, delete button, and a Process Due Expenses button that calls /api/recurring/process and shows result count
6. src/components/ui/recurring-form.tsx — NEW: Modal form component with controlled inputs for title (text), amount (number), category (dropdown fetched from API), frequency (select: WEEKLY/MONTHLY/YEARLY), startDate (date picker), submit handler calling POST /api/recurring
7. src/components/navbar.tsx — EDIT: Add a Recurring nav link pointing to /recurring alongside existing nav links
8. src/lib/prisma.ts — EDIT: Verify PrismaClient singleton is compatible with new RecurringExpense model (ensure no changes break existing client usage)
9. src/types/index.ts — EDIT: Add RecurringExpense TypeScript interface and Frequency enum type to match Prisma schema additions
10. src/app/api/categories/route.ts — EDIT: Verify GET handler returns id and name fields needed by recurring-form.tsx category dropdown
11. src/lib/utils.ts — EDIT: Add utility helpers for calculating nextDueDate based on frequency (addWeeks, addMonths, addYears) used by both POST and process route handlers
12. src/app/recurring/loading.tsx — NEW: Loading skeleton UI for the recurring expenses page while data is being fetched
13. src/app/recurring/error.tsx — NEW: Error boundary component for the recurring page to handle API or rendering failures gracefully
14. src/components/ui/frequency-badge.tsx — NEW: Small reusable badge component that displays frequency label (WEEKLY/MONTHLY/YEARLY) with distinct color styling for use in the recurring expenses list