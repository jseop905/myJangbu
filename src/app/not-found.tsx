"use client";

import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { Button } from "@/shared/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-8 px-4">
      <div className="flex flex-col items-center space-y-6">
        <FileQuestion className="h-24 w-24 text-muted-foreground" />
        <div className="space-y-3 text-center">
          <h1 className="text-4xl font-bold">404</h1>
          <h2 className="text-2xl font-semibold">페이지를 찾을 수 없습니다</h2>
          <p className="text-muted-foreground">요청하신 페이지가 존재하지 않거나 이동되었습니다.</p>
        </div>
      </div>
      <Button asChild size="lg" className="px-8 py-6 text-base">
        <Link href="/">홈으로 돌아가기</Link>
      </Button>
    </div>
  );
}
