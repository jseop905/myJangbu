import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/shared/lib/prisma";
import {
  apiSuccess,
  handleZodError,
  handleServerError,
  getCurrentUserId,
} from "@/shared/api/helpers";

const summaryQuerySchema = z.object({
  from: z.string().datetime(),
  to: z.string().datetime(),
});

/**
 * GET /api/ledger/summary?from=...&to=...
 * 기간별 수입/지출 집계 및 카테고리별 분포
 */
export async function GET(request: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    const { searchParams } = request.nextUrl;

    const query = summaryQuerySchema.parse({
      from: searchParams.get("from"),
      to: searchParams.get("to"),
    });

    const fromDate = new Date(query.from);
    const toDate = new Date(query.to);

    // 전체 수입/지출 합계
    const totals = await prisma.transaction.groupBy({
      by: ["type"],
      where: {
        userId,
        date: {
          gte: fromDate,
          lte: toDate,
        },
      },
      _sum: {
        amount: true,
      },
    });

    const income = totals.find((t) => t.type === "income")?._sum.amount || 0;
    const expense = totals.find((t) => t.type === "expense")?._sum.amount || 0;

    // 카테고리별 지출 분포
    const byCategory = await prisma.transaction.groupBy({
      by: ["categoryId"],
      where: {
        userId,
        type: "expense",
        date: {
          gte: fromDate,
          lte: toDate,
        },
      },
      _sum: {
        amount: true,
      },
    });

    // 카테고리 정보 가져오기
    const categoryIds = byCategory.map((item) => item.categoryId);
    const categories = await prisma.category.findMany({
      where: { id: { in: categoryIds } },
      select: { id: true, name: true },
    });

    const categoryMap = Object.fromEntries(categories.map((c) => [c.id, c.name]));

    const expenseByCategory = byCategory.map((item) => ({
      categoryId: item.categoryId,
      categoryName: categoryMap[item.categoryId] || "알 수 없음",
      amount: item._sum.amount || 0,
    }));

    return apiSuccess({
      period: { from: fromDate, to: toDate },
      totals: {
        income,
        expense,
        balance: income - expense,
      },
      expenseByCategory,
    });
  } catch (error: any) {
    if (error.name === "ZodError") return handleZodError(error);
    return handleServerError(error);
  }
}

