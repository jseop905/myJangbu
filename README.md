# 마이장부 (myJangbu)

간편한 수입·지출 관리 서비스

## 🚀 기술 스택

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes (REST)
- **Database**: PostgreSQL + Prisma ORM
- **State Management**: TanStack Query, Zustand
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts
- **Architecture**: FSD (Feature-Sliced Design)

## 📁 프로젝트 구조 (FSD)

```
src/
├── app/                 # Next.js App Router (라우팅, 레이아웃)
│   ├── api/            # API Routes
│   ├── layout.tsx      # 전역 레이아웃
│   ├── page.tsx        # 대시보드
│   └── ledger/         # 거래내역 페이지
├── shared/             # 공통 유틸, 타입, UI 컴포넌트
│   ├── api/           # API 클라이언트
│   ├── lib/           # 유틸 함수
│   ├── ui/            # shadcn/ui 컴포넌트
│   └── types/         # 공통 타입
├── entities/           # 비즈니스 엔티티 (Transaction, Category, Account)
│   ├── transaction/
│   ├── category/
│   └── account/
├── features/           # 사용자 기능 (거래 생성, 삭제 등)
│   └── transaction/
└── widgets/            # 조합된 UI 블록 (대시보드 요약, 차트 등)
    └── ledger-summary/
```

## 🛠️ 로컬 개발 환경 설정

### 1. 사전 요구사항

- Node.js 18+ 
- PostgreSQL 14+
- npm 또는 pnpm

### 2. 설치

```bash
# 의존성 설치
npm install

# 또는
pnpm install
```

### 3. 환경변수 설정

`.env` 파일을 생성하고 아래 내용을 입력하세요:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/myjangbu?schema=public"

# NextAuth (placeholder)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
```

**로컬 PostgreSQL 설정 예시**:
```bash
# PostgreSQL 설치 (macOS)
brew install postgresql@14
brew services start postgresql@14

# 데이터베이스 생성
createdb myjangbu
```

### 4. 데이터베이스 마이그레이션

```bash
# Prisma 마이그레이션
npm run db:push

# 또는 마이그레이션 파일 생성
npm run db:migrate
```

### 5. 시드 데이터 (선택)

```bash
npm run db:seed
```

시드 스크립트는 다음을 생성합니다:
- 데모 유저 (`demo@myjangbu.com`)
- 시스템 카테고리 (식비, 교통, 쇼핑 등)
- 샘플 계좌 (카드, 은행, 현금)
- 최근 30일 샘플 거래 내역

### 6. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

## 📦 주요 기능 (1차 스코프)

### ✅ 구현 완료
- [x] 거래(Transaction) CRUD API
- [x] 월간 수입/지출 집계 API
- [x] 카테고리별 지출 분포 차트
- [x] 대시보드 (이번 달 요약)
- [x] 거래내역 페이지 (리스트, 생성 모달)
- [x] Prisma 스키마 (User, Account, Category, Transaction, FixedItem)

### 🚧 TODO (후순위)
- [ ] **필터링**: 기간, 카테고리, 계좌별 필터
- [ ] **정기 항목 전개**: RRULE 파싱 및 자동 트랜잭션 생성 (Vercel Cron)
- [ ] **CSV 업로드**: 은행/카드사 거래 내역 Import
- [ ] **자동 분류 Rule**: 메모 패턴 → 카테고리 자동 매칭
- [ ] **중복 방지**: matchHash (date+amount+memo+account) 유니크
- [ ] **태그(Tag)**: Transaction N:M 관계
- [ ] **NextAuth 통합**: 실제 세션 기반 userId 추출
- [ ] **첨부파일**: S3 호환 스토리지 (영수증 이미지 등)

## 🧪 개발 스크립트

```bash
# 개발 서버
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버
npm run start

# 린트
npm run lint

# 코드 포맷팅
npm run format

# Prisma Studio (DB GUI)
npm run db:studio
```

## 📚 주요 규약

### 시간대
- **DB 저장**: UTC
- **클라이언트 표시**: Asia/Seoul (user.timezone 기반)

### 금액
- **저장 방식**: 정수 (int)
- **통화**: 원화(KRW)
- **부호**: `type` 필드로 구분 (income/expense), 금액은 항상 양수

### API 응답 포맷
```typescript
{
  success: boolean;
  data?: T;
  error?: string;
}
```

### 보안
- 모든 API 쿼리/변경에 `userId` 스코핑 필수
- Zod 스키마로 요청/응답 검증
- 400 (검증 실패) / 500 (서버 에러) 에러 코드 규칙화

## 🚀 배포

### Vercel 배포
1. GitHub 저장소 연결
2. 환경변수 설정 (`DATABASE_URL`, `NEXTAUTH_SECRET`)
3. 자동 배포

### 데이터베이스 (추천)
- [Neon](https://neon.tech) - Serverless PostgreSQL
- [Supabase](https://supabase.com) - PostgreSQL + Auth

## 📝 라이선스

MIT

---

**개발 시작일**: 2025-11-03  
**목표**: 작게 시작, 점진적 확장 🚀

