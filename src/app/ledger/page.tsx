"use client";

import { useState } from "react";
import { useTransactions, useDeleteTransaction } from "@/features/transaction/hooks";
import { CreateTransactionDialog } from "@/features/transaction/create-dialog";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { PageHeader } from "@/shared/ui/page-header";
import { formatKRW, formatDate } from "@/shared/lib/utils";
import { Trash2 } from "lucide-react";

export default function LedgerPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { data, isLoading } = useTransactions();
  const deleteMutation = useDeleteTransaction();

  const transactions = data?.data || [];

  const handleDelete = async (id: string) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      await deleteMutation.mutateAsync(id);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="거래내역"
        description="수입과 지출을 관리하세요"
        action={<Button onClick={() => setDialogOpen(true)}>+ 거래 추가</Button>}
      />

      {/* 필터 영역 - TODO: 구현 예정 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">필터 (TODO)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">기간, 카테고리, 계좌별 필터 추가 예정</p>
        </CardContent>
      </Card>

      {/* 거래 목록 */}
      <Card>
        <CardHeader>
          <CardTitle>최근 거래</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && <p>로딩 중...</p>}

          {!isLoading && transactions.length === 0 && (
            <p className="py-8 text-center text-muted-foreground">거래 내역이 없습니다</p>
          )}

          {!isLoading && transactions.length > 0 && (
            <div className="space-y-2">
              {transactions.map((tx: any) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between rounded-lg border p-4 hover:bg-accent"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{tx.category.name}</span>
                      <span className="text-sm text-muted-foreground">· {tx.account.name}</span>
                    </div>
                    {tx.memo && <p className="text-sm text-muted-foreground">{tx.memo}</p>}
                    <p className="text-xs text-muted-foreground">{formatDate(tx.date, "long")}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <p
                      className={`text-lg font-bold ${tx.type === "income" ? "text-green-600" : "text-red-600"}`}
                    >
                      {tx.type === "income" ? "+" : "-"}
                      {formatKRW(tx.amount)}
                    </p>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(tx.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <CreateTransactionDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}
