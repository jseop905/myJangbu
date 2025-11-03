import { NextRequest } from "next/server";
import { prisma } from "@/shared/lib/prisma";
import {
  apiSuccess,
  apiError,
  handleZodError,
  handleServerError,
  getCurrentUserId,
} from "@/shared/api/helpers";
import {
  createTransactionSchema,
  transactionFilterSchema,
} from "@/entities/transaction/model";

/**
 * GET /api/transactions - 거래 내역 조회
 */
export async function GET(request: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    const { searchParams } = request.nextUrl;

    // 필터 파싱
    const filterRaw = {
      from: searchParams.get("from") || undefined,
      to: searchParams.get("to") || undefined,
      type: searchParams.get("type") || undefined,
      categoryId: searchParams.get("categoryId") || undefined,
      accountId: searchParams.get("accountId") || undefined,
    };

    const filter = transactionFilterSchema.parse(filterRaw);

    // 쿼리 조건 생성
    const where: any = { userId };
    if (filter.from || filter.to) {
      where.date = {};
      if (filter.from) where.date.gte = new Date(filter.from);
      if (filter.to) where.date.lte = new Date(filter.to);
    }
    if (filter.type) where.type = filter.type;
    if (filter.categoryId) where.categoryId = filter.categoryId;
    if (filter.accountId) where.accountId = filter.accountId;

    const transactions = await prisma.transaction.findMany({
      where,
      include: {
        category: { select: { id: true, name: true, type: true } },
        account: { select: { id: true, name: true, type: true } },
      },
      orderBy: { date: "desc" },
      take: 100, // 최대 100개
    });

    return apiSuccess(transactions);
  } catch (error: any) {
    if (error.name === "ZodError") return handleZodError(error);
    return handleServerError(error);
  }
}

/**
 * POST /api/transactions - 거래 생성
 */
export async function POST(request: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    const body = await request.json();

    const validated = createTransactionSchema.parse(body);

    const transaction = await prisma.transaction.create({
      data: {
        ...validated,
        date: new Date(validated.date),
        userId,
        source: "manual",
      },
      include: {
        category: { select: { id: true, name: true, type: true } },
        account: { select: { id: true, name: true, type: true } },
      },
    });

    return apiSuccess(transaction, 201);
  } catch (error: any) {
    if (error.name === "ZodError") return handleZodError(error);
    return handleServerError(error);
  }
}

