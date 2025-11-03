/**
 * 공통 타입 정의
 */

export type TransactionType = "income" | "expense";
export type AccountType = "card" | "bank" | "cash" | "other";
export type CategoryType = "income" | "expense" | "both";
export type TransactionSource = "manual" | "import" | "rule";
export type FixedItemStatus = "active" | "paused";

// API 응답 공통 타입
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 페이지네이션
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

