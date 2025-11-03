import { prisma } from "@/shared/lib/prisma";
import { apiSuccess, handleServerError, getCurrentUserId } from "@/shared/api/helpers";

/**
 * GET /api/categories - 카테고리 목록 조회 (시스템 + 유저)
 */
export async function GET() {
  try {
    const userId = await getCurrentUserId();

    const categories = await prisma.category.findMany({
      where: {
        OR: [{ userId: null }, { userId }],
      },
      orderBy: { order: "asc" },
    });

    return apiSuccess(categories);
  } catch (error: any) {
    return handleServerError(error);
  }
}

