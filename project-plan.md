Edit Plan

1. src/app/analytics/page.tsx — NEW: Full analytics dashboard page showing donut chart for category spending, line chart for 6-month trend, top 5 expenses table, and month-over-month comparison table with color-coded % change indicators
2. src/app/api/analytics/summary/route.ts — NEW: GET handler returning total spent per category for current month, monthly totals for last 6 months, and top 5 expenses, all computed via Prisma queries with month query param support
3. src/components/ui/donut-chart.tsx — NEW: Reusable SVG-based donut chart component accepting array of {label, value, color} data points, rendering donut segments with center total and a color-coded legend
4. src/components/ui/line-chart.tsx — NEW: Reusable SVG-based line chart component accepting monthly totals data, rendering a trend line with filled area, month labels on x-axis, amount values on y-axis, and hover tooltips
5. src/components/ui/stat-card.tsx — NEW: Reusable card component displaying a metric label, formatted value, and optional trend indicator with up/down arrow icon and color-coded percentage change (green for down, red for up)
6. src/components/navbar.tsx — EDIT: Add 'Analytics' nav link pointing to /analytics alongside existing Budgets and other navigation links
7. src/lib/analytics.ts — NEW: Utility functions for computing analytics data including category aggregations, monthly totals calculation, and top expenses extraction to keep route handler clean
8. src/types/analytics.ts — NEW: TypeScript interfaces for analytics data structures including CategorySpend, MonthlyTotal, TopExpense, MonthComparison, and AnalyticsSummaryResponse
9. src/app/analytics/loading.tsx — NEW: Loading skeleton UI for the analytics dashboard page showing placeholder cards and chart skeletons while data fetches
10. src/app/analytics/error.tsx — NEW: Error boundary component for the analytics page that displays a user-friendly error message with retry option
11. src/components/ui/month-comparison-table.tsx — NEW: Reusable table component displaying category spend vs last month with formatted amounts and color-coded percentage change indicators
12. src/components/ui/top-expenses-list.tsx — NEW: Reusable component rendering the top 5 largest individual expenses with category badge, description, date, and formatted amount
13. src/lib/format.ts — NEW: Utility functions for formatting currency amounts, percentages, and month labels consistently across analytics components
14. src/app/api/analytics/summary/route.test.ts — NEW: Basic test stubs and type validation for the analytics summary API route to ensure correct response shape and Prisma query structure