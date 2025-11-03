import { z } from "zod";

/**
 * Transaction 엔티티 관련 스키마 및 타입
 */

export const createTransactionSchema = z.object({
  date: z.string().datetime(),
  amount: z.number().int().positive(),
  type: z.enum(["income", "expense"]),
  memo: z.string().optional(),
  categoryId: z.string().min(1),
  accountId: z.string().min(1),
});

export type CreateTransactionDto = z.infer<typeof createTransactionSchema>;

export const transactionFilterSchema = z.object({
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  type: z.enum(["income", "expense"]).optional(),
  categoryId: z.string().optional(),
  accountId: z.string().optional(),
});

export type TransactionFilter = z.infer<typeof transactionFilterSchema>;

