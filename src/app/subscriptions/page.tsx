"use client";

import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { PageHeader } from "@/shared/ui/page-header";
import { Trash2, Plus } from "lucide-react";

type Subscription = {
  id: string;
  name: string;
  amount: number;
  cycle: string;
  category: string;
};

// 목업 데이터
const MOCK_SUBSCRIPTIONS: Subscription[] = [
  { id: "1", name: "넷플릭스", amount: 13500, cycle: "매월 15일", category: "구독" },
  { id: "2", name: "유튜브 프리미엄", amount: 10450, cycle: "매월 1일", category: "구독" },
  { id: "3", name: "KT 인터넷", amount: 33000, cycle: "매월 5일", category: "통신비" },
  { id: "4", name: "Apple Music", amount: 10900, cycle: "매월 20일", category: "구독" },
];

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(MOCK_SUBSCRIPTIONS);
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newAmount, setNewAmount] = useState("");

  const handleAdd = () => {
    if (!newName.trim() || !newAmount.trim()) return;

    const newSubscription: Subscription = {
      id: Date.now().toString(),
      name: newName,
      amount: parseInt(newAmount),
      cycle: "매월 1일",
      category: "구독",
    };

    setSubscriptions([...subscriptions, newSubscription]);
    setNewName("");
    setNewAmount("");
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      setSubscriptions(subscriptions.filter((sub) => sub.id !== id));
    }
  };

  const totalAmount = subscriptions.reduce((sum, sub) => sum + sub.amount, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="구독관리"
        description="구독, 통신비 등 정기적인 수입·지출을 관리합니다"
        action={
          <Button onClick={() => setIsAdding(!isAdding)}>
            <Plus className="mr-2 h-4 w-4" />
            구독 추가
          </Button>
        }
      />

      {/* 요약 카드 */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">월 총 구독료</p>
            <p className="text-3xl font-bold text-red-600">
              {totalAmount.toLocaleString("ko-KR")}원
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 추가 폼 */}
      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">새 구독 추가</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="구독명 (예: 넷플릭스)"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="flex-1"
              />
              <Input
                type="number"
                placeholder="금액"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                className="w-32"
              />
              <Button onClick={handleAdd}>추가</Button>
              <Button variant="outline" onClick={() => setIsAdding(false)}>
                취소
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 구독 목록 */}
      <Card>
        <CardHeader>
          <CardTitle>구독 목록</CardTitle>
        </CardHeader>
        <CardContent>
          {subscriptions.length === 0 && (
            <p className="py-8 text-center text-muted-foreground">등록된 구독이 없습니다</p>
          )}

          {subscriptions.length > 0 && (
            <div className="space-y-2">
              {subscriptions.map((sub) => (
                <div
                  key={sub.id}
                  className="flex items-center justify-between rounded-lg border p-4 hover:bg-accent"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{sub.name}</span>
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                        {sub.category}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{sub.cycle}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <p className="text-lg font-bold text-red-600">
                      {sub.amount.toLocaleString("ko-KR")}원
                    </p>

                    <Button variant="ghost" size="icon" onClick={() => handleDelete(sub.id)}>
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
