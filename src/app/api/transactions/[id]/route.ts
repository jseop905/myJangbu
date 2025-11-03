import { NextRequest } from "next/server";
import { prisma } from "@/shared/lib/prisma";
import {
  apiSuccess,
  apiError,
  handleZodError,
  handleServerError,
  getCurrentUserId,
} from "@/shared/api/helpers";
import { createTransactionSchema } from "@/entities/transaction/model";

type Params = { params: { id: string } };

/**
 * GET /api/transactions/[id] - 거래 상세 조회
 */
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const userId = await getCurrentUserId();
    const { id } = params;

    const transaction = await prisma.transaction.findFirst({
      where: { id, userId },
      include: {
        category: true,
        account: true,
      },
    });

    if (!transaction) {
      return apiError("Transaction not found", 404);
    }

    return apiSuccess(transaction);
  } catch (error: any) {
    return handleServerError(error);
  }
}

/**
 * PUT /api/transactions/[id] - 거래 수정
 */
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const userId = await getCurrentUserId();
    const { id } = params;
    const body = await request.json();

    const validated = createTransactionSchema.parse(body);

    // 권한 확인
    const existing = await prisma.transaction.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return apiError("Transaction not found", 404);
    }

    const transaction = await prisma.transaction.update({
      where: { id },
      data: {
        ...validated,
        date: new Date(validated.date),
      },
      include: {
        category: true,
        account: true,
      },
    });

    return apiSuccess(transaction);
  } catch (error: any) {
    if (error.name === "ZodError") return handleZodError(error);
    return handleServerError(error);
  }
}

/**
 * DELETE /api/transactions/[id] - 거래 삭제
 */
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const userId = await getCurrentUserId();
    const { id } = params;

    // 권한 확인
    const existing = await prisma.transaction.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return apiError("Transaction not found", 404);
    }

    await prisma.transaction.delete({
      where: { id },
    });

    return apiSuccess({ message: "Transaction deleted" });
  } catch (error: any) {
    return handleServerError(error);
  }
}

