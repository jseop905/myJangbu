import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 시드 데이터 생성 시작...");

  // 테스트 유저
  const user = await prisma.user.upsert({
    where: { email: "demo@myjangbu.com" },
    update: {},
    create: {
      email: "demo@myjangbu.com",
      name: "데모 유저",
      timezone: "Asia/Seoul",
    },
  });

  console.log(`✅ 유저 생성: ${user.email}`);

  // 기본 카테고리 (시스템)
  const categories = [
    { name: "식비", type: "expense", order: 1 },
    { name: "교통", type: "expense", order: 2 },
    { name: "쇼핑", type: "expense", order: 3 },
    { name: "주거", type: "expense", order: 4 },
    { name: "의료", type: "expense", order: 5 },
    { name: "문화", type: "expense", order: 6 },
    { name: "급여", type: "income", order: 7 },
    { name: "부수입", type: "income", order: 8 },
    { name: "기타", type: "both", order: 9 },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { id: `system-${cat.name}` },
      update: {},
      create: {
        id: `system-${cat.name}`,
        name: cat.name,
        type: cat.type,
        order: cat.order,
        userId: null, // 시스템 카테고리
      },
    });
  }

  console.log(`✅ ${categories.length}개 시스템 카테고리 생성`);

  // 기본 계좌
  const accounts = [
    {
      type: "card",
      name: "신한카드",
      issuer: "신한",
      last4: "1234",
      billingDay: 15,
      isDefault: true,
    },
    {
      type: "bank",
      name: "국민은행 입출금",
      last4: "5678",
      isDefault: false,
    },
    {
      type: "cash",
      name: "현금",
      isDefault: false,
    },
  ];

  for (const acc of accounts) {
    await prisma.account.create({
      data: {
        ...acc,
        userId: user.id,
      },
    });
  }

  console.log(`✅ ${accounts.length}개 계좌 생성`);

  // 샘플 거래 내역 (최근 30일)
  const now = new Date();
  const sampleTransactions = [
    { daysAgo: 1, type: "expense", amount: 15000, category: "식비", memo: "점심 식사" },
    { daysAgo: 2, type: "expense", amount: 3500, category: "교통", memo: "지하철" },
    { daysAgo: 3, type: "expense", amount: 85000, category: "쇼핑", memo: "의류 구매" },
    { daysAgo: 5, type: "expense", amount: 12000, category: "식비", memo: "저녁 식사" },
    { daysAgo: 7, type: "income", amount: 3000000, category: "급여", memo: "11월 급여" },
    { daysAgo: 10, type: "expense", amount: 25000, category: "문화", memo: "영화 관람" },
    { daysAgo: 15, type: "expense", amount: 450000, category: "주거", memo: "관리비" },
  ];

  const categoryMap = await prisma.category.findMany({
    where: { userId: null },
  });

  const accountList = await prisma.account.findMany({
    where: { userId: user.id },
  });

  for (const tx of sampleTransactions) {
    const date = new Date(now);
    date.setDate(date.getDate() - tx.daysAgo);

    const category = categoryMap.find((c) => c.name === tx.category);
    const account = accountList[0]; // 첫 번째 계좌 사용

    if (category && account) {
      await prisma.transaction.create({
        data: {
          userId: user.id,
          date: date,
          amount: tx.amount,
          type: tx.type,
          memo: tx.memo,
          categoryId: category.id,
          accountId: account.id,
          source: "manual",
        },
      });
    }
  }

  console.log(`✅ ${sampleTransactions.length}개 샘플 거래 생성`);
  console.log("🎉 시드 완료!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

