"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTransactionSchema, CreateTransactionDto } from "@/entities/transaction/model";
import { useCreateTransaction } from "./hooks";
import { useCategories } from "@/entities/category/hooks";
import { useAccounts } from "@/entities/account/hooks";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";

interface CreateTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateTransactionDialog({ open, onOpenChange }: CreateTransactionDialogProps) {
  const { data: categoriesData } = useCategories();
  const { data: accountsData } = useAccounts();
  const createMutation = useCreateTransaction();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateTransactionDto>({
    resolver: zodResolver(createTransactionSchema),
    defaultValues: {
      type: "expense",
      date: new Date().toISOString(),
    },
  });

  const type = watch("type");

  const onSubmit = async (data: CreateTransactionDto) => {
    try {
      await createMutation.mutateAsync(data);
      reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to create transaction:", error);
    }
  };

  const categories = categoriesData?.data || [];
  const accounts = accountsData?.data || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>거래 추가</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* 타입 */}
          <div>
            <Label>타입</Label>
            <Select value={type} onValueChange={(value) => setValue("type", value as any)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">수입</SelectItem>
                <SelectItem value="expense">지출</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 금액 */}
          <div>
            <Label>금액</Label>
            <Input
              type="number"
              placeholder="10000"
              {...register("amount", { valueAsNumber: true })}
            />
            {errors.amount && <p className="text-sm text-red-600">{errors.amount.message}</p>}
          </div>

          {/* 카테고리 */}
          <div>
            <Label>카테고리</Label>
            <Select onValueChange={(value) => setValue("categoryId", value)}>
              <SelectTrigger>
                <SelectValue placeholder="선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {categories
                  .filter(
                    (c: any) => c.type === type || c.type === "both"
                  )
                  .map((c: any) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            {errors.categoryId && (
              <p className="text-sm text-red-600">{errors.categoryId.message}</p>
            )}
          </div>

          {/* 계좌 */}
          <div>
            <Label>결제 수단</Label>
            <Select onValueChange={(value) => setValue("accountId", value)}>
              <SelectTrigger>
                <SelectValue placeholder="선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((a: any) => (
                  <SelectItem key={a.id} value={a.id}>
                    {a.name} ({a.type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.accountId && (
              <p className="text-sm text-red-600">{errors.accountId.message}</p>
            )}
          </div>

          {/* 날짜 */}
          <div>
            <Label>날짜</Label>
            <Input
              type="datetime-local"
              {...register("date")}
              defaultValue={new Date().toISOString().slice(0, 16)}
            />
            {errors.date && <p className="text-sm text-red-600">{errors.date.message}</p>}
          </div>

          {/* 메모 */}
          <div>
            <Label>메모 (선택)</Label>
            <Input placeholder="메모를 입력하세요" {...register("memo")} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              취소
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? "저장 중..." : "추가"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

