import { prisma } from "@/shared/lib/prisma";
import { apiSuccess, handleServerError, getCurrentUserId } from "@/shared/api/helpers";

/**
 * GET /api/accounts - 계좌 목록 조회
 */
export async function GET() {
  try {
    const userId = await getCurrentUserId();

    const accounts = await prisma.account.findMany({
      where: { userId },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });

    return apiSuccess(accounts);
  } catch (error: any) {
    return handleServerError(error);
  }
}

