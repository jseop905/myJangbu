"use client";

import { useMemo } from "react";
import { LedgerSummary } from "@/widgets/ledger-summary/ui";
import { Button } from "@/shared/ui/button";

export default function DashboardPage() {
  // 이번 달 from/to 계산
  const { from, to } = useMemo(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    return {
      from: start.toISOString(),
      to: end.toISOString(),
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">대시보드</h1>
          <p className="text-muted-foreground">이번 달 수입·지출 현황</p>
        </div>
        <Button asChild>
          <a href="/ledger">거래내역 보기</a>
        </Button>
      </div>

      <LedgerSummary from={from} to={to} />
    </div>
  );
}

