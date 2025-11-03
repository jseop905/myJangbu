# 🚀 빠른 시작 가이드

## 1분 안에 시작하기

### 1단계: 의존성 설치

```bash
npm install
# 또는
pnpm install
```

### 2단계: 환경변수 설정

`.env` 파일을 루트에 생성:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/myjangbu"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="any-random-string"
```

**로컬 PostgreSQL이 없다면?**

무료 클라우드 DB 사용:
- [Neon](https://neon.tech) - 가입 후 CONNECTION_STRING 복사
- [Supabase](https://supabase.com) - Database → Connection String 복사

### 3단계: 데이터베이스 초기화

```bash
# 스키마 푸시
npm run db:push

# 샘플 데이터 생성 (선택)
npm run db:seed
```

### 4단계: 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속! 🎉

---

## 주요 페이지

- **대시보드**: `/` - 이번 달 수입/지출 요약
- **거래내역**: `/ledger` - 거래 추가, 조회, 삭제

---

## 다음 단계

1. ✅ 거래 추가해보기 (우측 상단 "거래 추가" 버튼)
2. ✅ 대시보드 차트 확인
3. 📖 [TODO.md](./TODO.md) - 앞으로 추가할 기능
4. 📖 [ARCHITECTURE.md](./ARCHITECTURE.md) - 프로젝트 구조 이해

---

## 자주 묻는 질문

### Q: `npm run db:push` 실패
→ `DATABASE_URL`이 올바른지 확인하세요. PostgreSQL이 실행 중인지 체크.

### Q: 포트 3000이 이미 사용 중
→ `npm run dev -- -p 3001`로 다른 포트 사용

### Q: 시드 데이터는?
→ 데모 유저, 9개 카테고리, 3개 계좌, 7개 샘플 거래 생성

---

**문제 발생 시**: [GitHub Issues](https://github.com/yourusername/myjangbu/issues)

