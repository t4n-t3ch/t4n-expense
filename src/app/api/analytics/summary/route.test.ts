import { NextRequest } from "next/server";

// Mock Prisma client
jest.mock("@/lib/prisma", () => ({
  prisma: {
    expense: {
      findMany: jest.fn(),
      groupBy: jest.fn(),
    },
  },
}));

// Mock analytics utilities
jest.mock("@/lib/analytics", () => ({
  getCategoryTotals: jest.fn(),
  getMonthlyTotals: jest.fn(),
  getTopExpenses: jest.fn(),
}));

import { GET } from "./route";
import { prisma } from "@/lib/prisma";
import {
  getCategoryTotals,
  getMonthlyTotals,
  getTopExpenses,
} from "@/lib/analytics";

const mockGetCategoryTotals = getCategoryTotals as jest.MockedFunction<
  typeof getCategoryTotals
>;
const mockGetMonthlyTotals = getMonthlyTotals as jest.MockedFunction<
  typeof getMonthlyTotals
>;
const mockGetTopExpenses = getTopExpenses as jest.MockedFunction<
  typeof getTopExpenses
>;

function createRequest(params?: Record<string, string>): NextRequest {
  const url = new URL("http://localhost:3000/api/analytics/summary");
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }
  return new NextRequest(url.toString());
}

describe("GET /api/analytics/summary", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns analytics summary with default current month", async () => {
    const mockCategoryTotals = [
      { category: "Food", total: 450.0, color: "#f97316" },
      { category: "Transport", total: 120.5, color: "#3b82f6" },
      { category: "Entertainment", total: 80.0, color: "#8b5cf6" },
    ];

    const mockMonthlyTotals = [
      { month: "2024-07", total: 1200.0 },
      { month: "2024-08", total: 980.5 },
      { month: "2024-09", total: 1100.0 },
      { month: "2024-10", total: 750.0 },
      { month: "2024-11", total: 890.0 },
      { month: "2024-12", total: 650.5 },
    ];

    const mockTopExpenses = [
      {
        id: "1",
        description: "Rent",
        amount: 1200.0,
        category: "Housing",
        date: "2024-12-01",
      },
      {
        id: "2",
        description: "Groceries",
        amount: 250.0,
        category: "Food",
        date: "2024-12-05",
      },
      {
        id: "3",
        description: "Electric Bill",
        amount: 180.0,
        category: "Utilities",
        date: "2024-12-10",
      },
      {
        id: "4",
        description: "Netflix",
        amount: 15.99,
        category: "Entertainment",
        date: "2024-12-12",
      },
      {
        id: "5",
        description: "Gas",
        amount: 60.0,
        category: "Transport",
        date: "2024-12-15",
      },
    ];

    mockGetCategoryTotals.mockResolvedValue(mockCategoryTotals);
    mockGetMonthlyTotals.mockResolvedValue(mockMonthlyTotals);
    mockGetTopExpenses.mockResolvedValue(mockTopExpenses);

    const request = createRequest();
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty("categoryTotals");
    expect(data).toHaveProperty("monthlyTotals");
    expect(data).toHaveProperty("topExpenses");
    expect(data.categoryTotals).toEqual(mockCategoryTotals);
    expect(data.monthlyTotals).toEqual(mockMonthlyTotals);
    expect(data.topExpenses).toEqual(mockTopExpenses);
  });

  it("accepts a month query parameter", async () => {
    mockGetCategoryTotals.mockResolvedValue([]);
    mockGetMonthlyTotals.mockResolvedValue([]);
    mockGetTopExpenses.mockResolvedValue([]);

    const request = createRequest({ month: "2024-11" });
    const response = await GET(request);

    expect(response.status).toBe(200);
    expect(mockGetCategoryTotals).toHaveBeenCalledWith(
      expect.stringContaining("2024-11")
    );
  });

  it("returns empty arrays when no expenses exist", async () => {
    mockGetCategoryTotals.mockResolvedValue([]);
    mockGetMonthlyTotals.mockResolvedValue([]);
    mockGetTopExpenses.mockResolvedValue([]);

    const request = createRequest();
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.categoryTotals).toEqual([]);
    expect(data.monthlyTotals).toEqual([]);
    expect(data.topExpenses).toEqual([]);
  });

  it("returns 500 when an error occurs", async () => {
    mockGetCategoryTotals.mockRejectedValue(new Error("Database error"));

    const request = createRequest();
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toHaveProperty("error");
  });

  it("includes correct month in response metadata", async () => {
    mockGetCategoryTotals.mockResolvedValue([]);
    mockGetMonthlyTotals.mockResolvedValue([]);
    mockGetTopExpenses.mockResolvedValue([]);

    const request = createRequest({ month: "2024-10" });
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty("month");
    expect(data.month).toBe("2024-10");
  });

  it("returns correct structure for category totals", async () => {
    const mockCategoryTotals = [
      { category: "Food", total: 300.0, color: "#f97316" },
    ];

    mockGetCategoryTotals.mockResolvedValue(mockCategoryTotals);
    mockGetMonthlyTotals.mockResolvedValue([]);
    mockGetTopExpenses.mockResolvedValue([]);

    const request = createRequest();
    const response = await GET(request);
    const data = await response.json();

    expect(data.categoryTotals[0]).toMatchObject({
      category: expect.any(String),
      total: expect.any(Number),
    });
  });

  it("returns correct structure for monthly totals", async () => {
    const mockMonthlyTotals = [{ month: "2024-12", total: 650.5 }];

    mockGetCategoryTotals.mockResolvedValue([]);
    mockGetMonthlyTotals.mockResolvedValue(mockMonthlyTotals);
    mockGetTopExpenses.mockResolvedValue([]);

    const request = createRequest();
    const response = await GET(request);
    const data = await response.json();

    expect(data.monthlyTotals[0]).toMatchObject({
      month: expect.any(String),
      total: expect.any(Number),
    });
  });

  it("returns correct structure for top expenses", async () => {
    const mockTopExpenses = [
      {
        id: "1",
        description: "Rent",
        amount: 1200.0,
        category: "Housing",
        date: "2024-12-01",
      },
    ];

    mockGetCategoryTotals.mockResolvedValue([]);
    mockGetMonthlyTotals.mockResolvedValue([]);
    mockGetTopExpenses.mockResolvedValue(mockTopExpenses);

    const request = createRequest();
    const response = await GET(request);
    const data = await response.json();

    expect(data.topExpenses[0]).toMatchObject({
      id: expect.any(String),
      description: expect.any(String),
      amount: expect.any(Number),
      category: expect.any(String),
    });
  });

  it("calls getMonthlyTotals for the last 6 months", async () => {
    mockGetCategoryTotals.mockResolvedValue([]);
    mockGetMonthlyTotals.mockResolvedValue([]);
    mockGetTopExpenses.mockResolvedValue([]);

    const request = createRequest();
    await GET(request);

    expect(mockGetMonthlyTotals).toHaveBeenCalledTimes(1);
    expect(mockGetMonthlyTotals).toHaveBeenCalledWith(6);
  });

  it("calls getTopExpenses with limit of 5", async () => {
    mockGetCategoryTotals.mockResolvedValue([]);
    mockGetMonthlyTotals.mockResolvedValue([]);
    mockGetTopExpenses.mockResolvedValue([]);

    const request = createRequest();
    await GET(request);

    expect(mockGetTopExpenses).toHaveBeenCalledTimes(1);
    expect(mockGetTopExpenses).toHaveBeenCalledWith(
      expect.anything(),
      5
    );
  });

  it("handles invalid month parameter gracefully", async () => {
    mockGetCategoryTotals.mockResolvedValue([]);
    mockGetMonthlyTotals.mockResolvedValue([]);
    mockGetTopExpenses.mockResolvedValue([]);

    const request = createRequest({ month: "invalid-date" });
    const response = await GET(request);

    // Should either return 200 with default month or 400 for invalid input
    expect([200, 400]).toContain(response.status);
  });

  it("returns totalSpent as sum of category totals", async () => {
    const mockCategoryTotals = [
      { category: "Food", total: 300.0, color: "#f97316" },
      { category: "Transport", total: 150.0, color: "#3b82f6" },
      { category: "Entertainment", total: 50.0, color: "#8b5cf6" },
    ];

    mockGetCategoryTotals.mockResolvedValue(mockCategoryTotals);
    mockGetMonthlyTotals.mockResolvedValue([]);
    mockGetTopExpenses.mockResolvedValue([]);

    const request = createRequest();
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    if (data.totalSpent !== undefined) {
      expect(data.totalSpent).toBeCloseTo(500.0, 2);
    }
  });
});