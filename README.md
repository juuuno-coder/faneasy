# FanEasy - 팬페이지 플랫폼

인플루언서와 팬들이 함께 소통하고 수익을 공유할 수 있는 혁신적인 팬페이지 플랫폼입니다.

## 🌟 주요 기능

### 1. 서브도메인 기반 멀티테넌시

- 각 인플루언서는 고유한 서브도메인을 가집니다 (예: `kkang.faneasy.kr`)
- 독립적인 브랜딩과 커스터마이징 가능

### 2. 계층적 팬페이지 구조

- **1차 페이지**: 인플루언서 메인 페이지 (`kkang.faneasy.kr`)
- **2차 페이지**: 팬의 하위 페이지 (`kkang.faneasy.kr/fan1`)
- 팬들도 자신만의 공간을 만들어 운영 가능

### 3. 차별화된 관리 시스템

- **인플루언서 대시보드**: 전체 페이지 관리, 팬 권한 설정, 수익 분배 관리
- **팬 대시보드**: 제한된 권한 내에서 자신의 하위 페이지 관리

### 4. 권한 관리 시스템

팬마다 다른 권한 부여 가능:

- 콘텐츠 편집 권한
- 상품 관리 권한
- 분석 조회 권한

### 5. 수익 공유

- 인플루언서와 팬 간 수익 분배
- 플랫폼 수수료 자동 계산

## 🚀 시작하기

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

서버가 [http://localhost:3500](http://localhost:3500)에서 실행됩니다.

문제가 발생할 경우(예: `EADDRINUSE` 또는 `.next/dev/lock` 관련 오류), 먼저 `npm run clean:dev`를 실행해 잠금 파일을 제거한 뒤 다시 `npm run dev`를 시도하세요.

### Firebase 설정 (개발)

- 로컬 개발에서 Firebase를 사용하려면 **서비스 계정(서버)** 과 **웹 앱(클라이언트)** 정보를 생성하세요.
- `.env.local` 또는 `.env.local.example`에 다음 변수를 추가하세요:
  - `NEXT_PUBLIC_FIREBASE_API_KEY`
  - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
  - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
  - `NEXT_PUBLIC_FIREBASE_APP_ID`
  - `FIREBASE_PROJECT_ID`
  - `FIREBASE_CLIENT_EMAIL`
  - `FIREBASE_PRIVATE_KEY` (개행은 `\n`으로 이스케이프)

**서비스 계정 키 설정**

- Firebase Console에서 프로젝트 설정 → 서비스 계정 → 새 비공개 키 생성
- 생성된 JSON에서 `client_email`, `private_key`, `project_id` 값을 `.env.local`에 추가하세요 (private_key의 개행은 `\n`으로 치환하세요)

- API & Scripts
  - 서버사이드 회원가입: `POST /api/auth/signup` (requires service account)
  - 서버사이드 로그인(토큰 검증): `POST /api/auth/login` (accepts `{ idToken }` to verify Firebase ID tokens)
  - Firestore 시드 스크립트: `npm run seed:firestore` (requires `ts-node` and service account) - Firebase 상태 확인 스크립트: `npm run check:firebase`- 참조: `fan-platform/env.example.txt` 또는 `.env.local.example`에 예시가 포함되어 있습니다.

## 📱 사용 방법

### 서버 사이드 인증 (개발용) — 수동 테스트

1. 서비스 계정 설정 (`FIREBASE_PRIVATE_KEY`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PROJECT_ID`)을 `.env.local`에 추가합니다.
2. 관리자 초기화 확인: `npm run check:firebase` (정상인 경우 `Firebase admin check OK` 출력)
3. Mock 데이터를 Firestore로 시드: `npm run seed:firestore` (성공 시 `Seeding completed.` 출력)
4. 클라이언트에서 Firebase Web SDK로 로그인하여 얻은 `idToken`을 `POST /api/auth/login`에 `{ idToken }`으로 전송해서 서버 검증을 확인합니다.

### 테스트 실행

- 단위 테스트 (Jest): `npm test`
- E2E (Playwright): `npm run test:e2e` — E2E 테스트는 애플리케이션에 인증 상태를 주입하기 위해 `localStorage`에 `faneasy-auth` 상태를 씁니다. 따라서 Firebase 서비스 계정 없이도 보호된 페이지 렌더링 테스트가 가능합니다.
- CI: GitHub Actions 워크플로우(`.github/workflows/ci.yml`)가 유닛 테스트와 E2E를 실행합니다. 스테이징에서 실제 Firebase로 테스트/시드를 실행하려면 리포지토리 Secrets에 `FIREBASE_PRIVATE_KEY`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PROJECT_ID`를 추가하고 `PW_BASE_URL` 또는 `BASE_URL`을 스테이징 URL로 설정하세요.

### 1. 메인 랜딩 페이지

- URL: `http://localhost:3500`
- 플랫폼 소개 및 데모 사이트 링크

### 2. 인플루언서 페이지

- URL: `http://[subdomain].localhost:3500`
- 예시:
  - `http://kkang.localhost:3500` - 깡대표 팬페이지
  - `http://iu.localhost:3500` - IU 팬페이지

### 3. 팬 하위 페이지

- URL: `http://[subdomain].localhost:3500/[fanSlug]`
- 예시:
  - `http://kkang.localhost:3500/fan1` - 팬1의 페이지
  - `http://kkang.localhost:3500/fan2` - 팬2의 페이지

### 4. 관리자 로그인

- URL: `http://localhost:3500/login`

#### 테스트 계정

**인플루언서 계정 (깡대표)**

- 이메일: `kkang@faneasy.kr`
- 비밀번호: `password123`
- 대시보드: `/admin/influencer`

**팬 계정 (팬1)**

- 이메일: `fan1@example.com`
- 비밀번호: `password123`
- 대시보드: `/admin/fan`

**팬 계정 (팬2)**

- 이메일: `fan2@example.com`
- 비밀번호: `password123`
- 대시보드: `/admin/fan`

## 🏗️ 프로젝트 구조

```
faneasy/
├── app/
│   ├── _sites/
│   │   └── [site]/              # 서브도메인 페이지
│   │       ├── page.tsx         # 인플루언서 메인 페이지
│   │       └── [fanSlug]/       # 팬 하위 페이지
│   │           └── page.tsx
│   ├── admin/
│   │   ├── influencer/          # 인플루언서 대시보드
│   │   │   └── page.tsx
│   │   └── fan/                 # 팬 대시보드
│   │       └── page.tsx
│   ├── api/
│   │   └── auth/
│   │       └── login/           # 로그인 API
│   │           └── route.ts
│   ├── login/                   # 로그인 페이지
│   │   └── page.tsx
│   └── page.tsx                 # 메인 랜딩 페이지
├── lib/
│   ├── types.ts                 # TypeScript 타입 정의
│   ├── store.ts                 # Zustand 전역 상태 관리
│   └── data.ts                  # Mock 데이터
└── middleware.ts                # 서브도메인 라우팅
```

## 🎨 기술 스택

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand
- **Authentication**: JWT + bcryptjs
- **Icons**: Lucide React
- **Animations**: Framer Motion

## 🔐 인증 시스템

- JWT 기반 토큰 인증
- 역할 기반 접근 제어 (RBAC)
- 로컬 스토리지를 통한 세션 유지

## 📊 데이터 구조

### Influencer (인플루언서)

- 고유 서브도메인
- 페이지 설정 (테마, 색상, 로고 등)
- 수익 분배 설정

### Fan (팬)

- 소속 인플루언서 ID
- 고유 slug (URL 경로)
- 페이지 설정
- 권한 설정

### Product (상품)

- 소유자 정보 (인플루언서 또는 팬)
- 상품 정보
- 재고 관리

### Order (주문)

- 구매자 정보
- 수익 분배 정보

## 🌐 서브도메인 라우팅

`middleware.ts`에서 서브도메인을 감지하고 적절한 페이지로 라우팅합니다:

1. `localhost:3500` → 메인 랜딩 페이지
2. `kkang.localhost:3500` → `/_sites/kkang` (인플루언서 페이지)
3. `kkang.localhost:3500/fan1` → `/_sites/kkang/fan1` (팬 하위 페이지)

## 🎯 향후 개발 계획

- [ ] 실제 데이터베이스 연동 (PostgreSQL/MongoDB)
- [ ] 파일 업로드 기능 (이미지, 동영상)
- [ ] 결제 시스템 통합 (Stripe/Toss Payments)
- [ ] 실시간 채팅 기능
- [ ] 알림 시스템
- [ ] 분석 대시보드 (Google Analytics 통합)
- [ ] SEO 최적화
- [ ] 모바일 앱 (React Native)

## 📝 라이선스

MIT License

## 👥 기여

이슈와 PR은 언제나 환영합니다!

---

**FanEasy** - 팬과 인플루언서를 연결하는 가장 쉬운 방법 💜
