Edit Plan

1. prisma/schema.prisma — EDIT: Add Budget model with fields id, categoryId, amount, month (DateTime), createdAt, updatedAt, and a relation to the existing Category model
2. src/app/api/budgets/route.ts — NEW: Create GET handler to list all budgets for current month and POST handler to create or update a budget for a category/month using Prisma
3. src/app/api/budgets/[id]/route.ts — NEW: Create PATCH handler to update a budget amount and DELETE handler to remove a budget by id using Prisma
4. src/app/budgets/page.tsx — NEW: Create full budget dashboard page showing each category with budget limit, total spent this month, visual progress bar, remaining amount, and Edit Budget button
5. src/components/ui/budget-form.tsx — NEW: Create modal form component with category dropdown, amount limit input, and month selector for setting or editing a budget limit
6. src/components/ui/budget-progress-bar.tsx — NEW: Create reusable progress bar component accepting spent and limit props, rendering colored bar (green under 75%, yellow 75-99%, red over 100%) with percentage label
7. src/components/navbar.tsx — EDIT: Add a Budgets nav link alongside existing navigation links pointing to /budgets
8. src/lib/prisma.ts — EDIT: Verify Prisma client singleton is exported correctly to support new Budget model queries (no breaking changes, confirm compatibility)
9. src/types/index.ts — EDIT: Add Budget, BudgetWithCategory, and BudgetProgress TypeScript interfaces/types to support the new budget feature across components and API routes
10. src/app/api/budgets/route.ts — (covered in #2, placeholder to note: include month-based filtering logic using startOf/endOf month DateTime range in GET handler)
11. src/lib/budget-utils.ts — NEW: Create utility functions for calculating budget progress percentage, determining color thresholds, and formatting remaining/overspent amounts
12. src/app/budgets/loading.tsx — NEW: Create loading skeleton UI for the budgets page to handle async data fetching states gracefully
13. src/app/budgets/error.tsx — NEW: Create error boundary component for the budgets page to handle API or data fetching failures with a user-friendly message
14. prisma/migrations — EDIT: Note that after updating schema.prisma, run prisma migrate dev to generate migration file for the new Budget model (document migration command in a README or migration note)