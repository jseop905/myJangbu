import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { ApiResponse } from "@/shared/types";

/**
 * API 성공 응답
 */
export function apiSuccess<T>(data: T, status = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json({ success: true, data }, { status });
}

/**
 * API 에러 응답
 */
export function apiError(message: string, status = 400): NextResponse<ApiResponse> {
  return NextResponse.json({ success: false, error: message }, { status });
}

/**
 * Zod 검증 에러 처리
 */
export function handleZodError(error: ZodError): NextResponse<ApiResponse> {
  const firstError = error.errors[0];
  const message = `${firstError.path.join(".")}: ${firstError.message}`;
  return apiError(message, 400);
}

/**
 * 서버 에러 처리
 */
export function handleServerError(error: unknown): NextResponse<ApiResponse> {
  console.error("[API Error]", error);
  const message = error instanceof Error ? error.message : "Internal server error";
  return apiError(message, 500);
}

/**
 * userId 추출 (NextAuth 통합 전에는 데모 유저 사용)
 * TODO: NextAuth session에서 userId 추출
 */
export async function getCurrentUserId(): Promise<string> {
  // 임시: 데모 유저 조회
  // 실제로는 getServerSession()으로 세션에서 가져와야 함
  const { prisma } = await import("./prisma");
  
  let user = await prisma.user.findUnique({
    where: { email: "demo@myjangbu.com" },
  });

  // 데모 유저가 없으면 생성
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: "demo@myjangbu.com",
        name: "데모 유저",
        timezone: "Asia/Seoul",
      },
    });
  }

  return user.id;
}

