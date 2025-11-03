# 아키텍처 문서

## FSD (Feature-Sliced Design) 구조

이 프로젝트는 FSD 아키텍처를 따릅니다. FSD는 확장 가능하고 유지보수하기 쉬운 프론트엔드 구조를 제공합니다.

### 레이어 설명

#### 1. `app/` - 애플리케이션 레이어
- Next.js App Router 라우팅
- 전역 레이아웃, providers
- API Routes (백엔드 엔드포인트)

#### 2. `shared/` - 공유 레이어
- **목적**: 프로젝트 전역에서 사용하는 재사용 가능한 코드
- **규칙**: 다른 레이어를 import 하지 않음 (순수 유틸)
- **구성**:
  - `lib/`: 유틸 함수, Prisma 클라이언트
  - `ui/`: shadcn/ui 기반 공통 UI 컴포넌트
  - `api/`: API 클라이언트, fetch 래퍼
  - `types/`: 전역 TypeScript 타입
  - `config/`: 상수, 설정

#### 3. `entities/` - 엔티티 레이어
- **목적**: 비즈니스 엔티티 (도메인 모델)
- **예시**: `transaction/`, `category/`, `account/`
- **구성**:
  - `model.ts`: Zod 스키마, 타입 정의
  - `hooks.ts`: React Query hooks (조회)
  - `api.ts`: API 호출 함수 (선택)

#### 4. `features/` - 기능 레이어
- **목적**: 사용자 인터랙션/액션
- **예시**: 거래 생성, 거래 삭제, 필터링
- **구성**:
  - `hooks.ts`: Mutation hooks (생성, 수정, 삭제)
  - `ui.tsx`: 기능별 UI 컴포넌트
  - `*.tsx`: 모달, 폼 등

#### 5. `widgets/` - 위젯 레이어
- **목적**: 여러 entities/features를 조합한 복잡한 UI 블록
- **예시**: 대시보드 요약 카드 + 차트, 거래 목록 + 필터
- **구성**:
  - `ui.tsx`: 위젯 메인 UI
  - `hooks.ts`: 위젯 전용 hooks

#### 6. `pages/` (app/ 안에 통합)
- Next.js App Router를 사용하므로 `app/` 안에 페이지 구현

---

## 의존성 규칙 (Import 방향)

```
app → widgets → features → entities → shared
```

- **하위 레이어는 상위 레이어를 import 할 수 없음**
- **같은 레이어 내에서는 cross-import 금지** (특히 entities, features)

---

## API 설계

### REST API 구조

```
/api/transactions           GET, POST
/api/transactions/[id]      GET, PUT, DELETE
/api/ledger/summary         GET (쿼리: from, to)
/api/categories             GET
/api/accounts               GET
/api/fixed-items            GET, POST
```

### 에러 처리 패턴

```typescript
try {
  // 비즈니스 로직
  return apiSuccess(data);
} catch (error) {
  if (error.name === "ZodError") return handleZodError(error);
  return handleServerError(error);
}
```

---

## 데이터베이스 설계

### 핵심 엔티티 관계

```
User (1) ──< (N) Transaction
User (1) ──< (N) Account
User (1) ──< (N) Category (nullable, 시스템 카테고리)
User (1) ──< (N) FixedItem

Transaction >── (1) Category
Transaction >── (1) Account

FixedItem >── (1) Category
FixedItem >── (1) Account
```

### 인덱스 전략
- `Transaction(userId, date)`: 사용자별 날짜 조회
- `Transaction(categoryId)`: 카테고리별 집계
- `Transaction(accountId)`: 계좌별 집계

---

## 확장 포인트 (TODO)

### 1. 정기 항목 전개 엔진
- **위치**: `src/features/fixed-items/expander.ts`
- **라이브러리**: `rrule` (RRULE 파싱)
- **트리거**: Vercel Cron (매일 자정)
- **로직**: `nextOccurrenceDate` 비교 → Transaction 생성 → 다음 날짜 업데이트

### 2. CSV Import
- **위치**: `src/features/transaction/import/`
- **플로우**: 업로드 → 파싱 → 매칭 (중복 체크) → Transaction 생성
- **중복 체크**: `matchHash = hash(date + amount + memo + accountId)`

### 3. 자동 분류 Rule
- **위치**: `src/features/transaction/auto-categorize/`
- **엔티티**: `Rule(userId, pattern, categoryId, priority)`
- **적용**: Transaction 생성 시 memo 패턴 매칭

### 4. NextAuth 통합
- **파일**: `src/app/api/auth/[...nextauth]/route.ts`
- **수정**: `src/shared/api/helpers.ts`의 `getCurrentUserId()`

---

## 성능 최적화 가이드

1. **N+1 문제 방지**: Prisma `include`로 join select
2. **집계는 DB에서**: `groupBy` 사용, 클라이언트 집계 금지
3. **페이지네이션**: `take`/`skip` 활용
4. **React Query 캐싱**: `staleTime` 설정

---

**작성일**: 2025-11-03

