/**
 * 앱 전역 상수
 */

export const APP_NAME = "마이장부";
export const APP_DESCRIPTION = "간편한 수입·지출 관리 서비스";

export const TRANSACTION_TYPES = [
  { value: "income", label: "수입", color: "text-green-600" },
  { value: "expense", label: "지출", color: "text-red-600" },
] as const;

export const ACCOUNT_TYPES = [
  { value: "card", label: "카드" },
  { value: "bank", label: "은행" },
  { value: "cash", label: "현금" },
  { value: "other", label: "기타" },
] as const;

export const DEFAULT_TIMEZONE = "Asia/Seoul";
export const DEFAULT_CURRENCY = "KRW";

// 차트 색상 팔레트
export const CHART_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

