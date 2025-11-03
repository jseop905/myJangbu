import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/shared/lib/prisma";
import {
  apiSuccess,
  handleZodError,
  handleServerError,
  getCurrentUserId,
} from "@/shared/api/helpers";

const createFixedItemSchema = z.object({
  name: z.string().min(1),
  type: z.enum(["income", "expense"]),
  amount: z.number().int().positive(),
  categoryId: z.string().min(1),
  accountId: z.string().min(1),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional(),
  recurrenceRule: z.string().optional(),
});

/**
 * GET /api/fixed-items - 정기 항목 목록 조회
 */
export async function GET() {
  try {
    const userId = await getCurrentUserId();

    const items = await prisma.fixedItem.findMany({
      where: { userId },
      include: {
        category: { select: { id: true, name: true } },
        account: { select: { id: true, name: true, type: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return apiSuccess(items);
  } catch (error: any) {
    return handleServerError(error);
  }
}

/**
 * POST /api/fixed-items - 정기 항목 생성
 * TODO: recurrenceRule 파싱 및 nextOccurrenceDate 계산
 */
export async function POST(request: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    const body = await request.json();

    const validated = createFixedItemSchema.parse(body);

    // TODO: RRULE 파싱하여 nextOccurrenceDate 계산 (rrule 라이브러리 사용)
    const nextOccurrenceDate = validated.startDate
      ? new Date(validated.startDate)
      : undefined;

    const item = await prisma.fixedItem.create({
      data: {
        ...validated,
        startDate: new Date(validated.startDate),
        endDate: validated.endDate ? new Date(validated.endDate) : null,
        nextOccurrenceDate,
        userId,
        status: "active",
      },
      include: {
        category: true,
        account: true,
      },
    });

    return apiSuccess(item, 201);
  } catch (error: any) {
    if (error.name === "ZodError") return handleZodError(error);
    return handleServerError(error);
  }
}

