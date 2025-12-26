# FanEasy 디자인 시스템

> 다른 프로젝트에 바로 적용 가능한 재사용 디자인 시스템

---

## 📚 목차

1. [핵심 기술 스택](#핵심-기술-스택)
2. [폰트 시스템](#폰트-시스템)
3. [타이포그래피 (PC/모바일 치수)](#타이포그래피)
4. [레이아웃 시스템 (컨테이너, 여백)](#레이아웃-시스템)
5. [UI 컴포넌트 패턴](#ui-컴포넌트-패턴)
6. [색상 시스템](#색상-시스템)
7. [간격/여백 규칙](#간격여백-규칙)
8. [반응형 브레이크포인트](#반응형-브레이크포인트)
9. [AOS 애니메이션](#aos-애니메이션)

---

## 🛠 핵심 기술 스택

```json
{
  "framework": "Next.js 16.1.0 (App Router)",
  "react": "19.2.3",
  "typescript": "^5",
  "styling": "Tailwind CSS ^4",
  "animation": "AOS ^2.3.4",
  "icons": "Lucide React ^0.562.0"
}
```

---

## 🔤 폰트 시스템

### 설치 및 로드

```css
/* app/globals.css - 최상단 */
@import "tailwindcss";
@import url("https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css");
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap");
```

### CSS 변수 정의

```css
@layer base {
  :root {
    --font-poppins: "Poppins", sans-serif;
    --font-pretendard: "Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont,
      system-ui;
    --font-main: "Poppins", "Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont,
      system-ui;
  }

  /* 전역 폰트 적용 */
  *,
  *::before,
  *::after {
    font-family: var(--font-main) !important;
  }

  body {
    font-family: var(--font-main);
    word-break: keep-all;
    letter-spacing: -0.02em;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
}
```

### 폰트 규칙

- **영문/숫자**: Poppins (자동 적용)
- **한글**: Pretendard (자동 폴백)
- **자간**: `-0.02em` (기본), `-0.04em` (타이틀), `0` (영문 전용)

---

## 📐 타이포그래피

### 반응형 폰트 크기 (PC/모바일)

| 용도                 | 클래스             | PC (>900px)     | 모바일 (≤900px)  | 축소율 | Weight | Line Height |
| -------------------- | ------------------ | --------------- | ---------------- | ------ | ------ | ----------- |
| **초대형 타이틀**    | `.main-ttl.lg-ttl` | 64px (4rem)     | 32px (2rem)      | 50%    | 800    | 1.2         |
| **대형 타이틀**      | `.main-ttl.md-ttl` | 58px (3.625rem) | 26px (1.625rem)  | ~45%   | 800    | 1.2         |
| **중형 타이틀**      | `.main-ttl.ms-ttl` | 52px (3.25rem)  | 24px (1.5rem)    | ~46%   | 700    | 1.25        |
| **소형 타이틀**      | `.main-ttl.sm-ttl` | 28px (1.75rem)  | 17px (1.0625rem) | ~61%   | 700    | 1.3         |
| **아주 작은 타이틀** | `.main-ttl.ss-ttl` | 24px (1.5rem)   | 15px (0.9375rem) | 62.5%  | 600    | 1.35        |
| **최소 타이틀**      | `.main-ttl.xs-ttl` | 20px (1.25rem)  | 15px (0.9375rem) | 75%    | 600    | 1.4         |

### 고정 폰트 크기

| 클래스     | 크기 | 용도                 |
| ---------- | ---- | -------------------- |
| `.f-rem12` | 12px | 캡션, 라벨           |
| `.f-rem14` | 14px | 작은 본문, 부가 정보 |
| `.f-rem15` | 15px | 모바일 본문          |
| `.f-rem17` | 17px | **PC 본문 (기본)**   |
| `.f-rem20` | 20px | 소제목               |
| `.f-rem24` | 24px | 섹션 제목            |
| `.f-rem28` | 28px | 큰 제목              |
| `.f-rem32` | 32px | 히어로 부제목        |

### 실전 사용 예시

```tsx
// 히어로 섹션
<h1 className="text-4xl md:text-5xl lg:text-7xl font-black leading-tight text-white">
  사장님, 장사하세요.
</h1>

// 또는 커스텀 클래스
<h1 className="main-ttl lg-ttl text-white">
  PC 64px, 모바일 32px
</h1>

// 본문
<p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
  설명 텍스트
</p>
```

---

## 📦 레이아웃 시스템

### 컨테이너 최대 너비

| 용도            | 클래스      | 최대 너비 | 좌우 패딩     |
| --------------- | ----------- | --------- | ------------- |
| **일반 콘텐츠** | `max-w-7xl` | 1280px    | `px-6` (24px) |
| **좁은 콘텐츠** | `max-w-5xl` | 1024px    | `px-6`        |
| **폼/텍스트**   | `max-w-3xl` | 768px     | `px-6`        |
| **헤더**        | `max-w-6xl` | 1152px    | `px-6`        |

### 섹션 패딩 (상하)

| 디바이스     | 클래스     | 패딩 |
| ------------ | ---------- | ---- |
| **모바일**   | `py-12`    | 48px |
| **태블릿**   | `md:py-20` | 80px |
| **데스크탑** | `lg:py-24` | 96px |

### 실전 레이아웃 패턴

```tsx
// 표준 섹션
<section className="py-12 md:py-20 lg:py-24 px-6 bg-white">
  <div className="max-w-7xl mx-auto">
    {/* 콘텐츠 */}
  </div>
</section>

// 히어로 섹션
<section className="relative min-h-screen flex items-center justify-center">
  <div className="max-w-5xl mx-auto px-6 text-center">
    {/* 히어로 콘텐츠 */}
  </div>
</section>

// 고정 헤더
<header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
  <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
    {/* 헤더 콘텐츠 */}
  </div>
</header>
```

---

## 🎨 UI 컴포넌트 패턴

### 1. 버튼

#### 주요 CTA 버튼

```tsx
<a
  href="#contact"
  className="px-10 py-5 bg-linear-to-r from-orange-500 to-red-500 text-white rounded-2xl text-xl font-bold hover:shadow-2xl hover:shadow-orange-500/40 transition-all flex items-center gap-3"
>
  <Play className="h-6 w-6" />
  지금 바로 진단받기
  <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
</a>
```

**치수**:

- 패딩: `px-10 py-5` (40px 좌우, 20px 상하)
- 폰트: `text-xl font-bold` (20px, 700)
- 라운드: `rounded-2xl` (16px)
- 아이콘: `h-6 w-6` (24px)

#### 보조 버튼

```tsx
<a
  href="#services"
  className="px-8 py-4 bg-white border border-gray-200 text-gray-700 font-bold rounded-lg hover:border-gray-400 transition-all"
>
  서비스 소개
</a>
```

**치수**:

- 패딩: `px-8 py-4` (32px 좌우, 16px 상하)
- 라운드: `rounded-lg` (8px)

#### 작은 버튼 (헤더용)

```tsx
<a
  href="#contact"
  className="px-5 py-2.5 bg-linear-to-r from-orange-500 to-red-500 text-white rounded-full text-sm font-bold hover:shadow-lg transition-all"
>
  진단 요청하기
</a>
```

**치수**:

- 패딩: `px-5 py-2.5` (20px 좌우, 10px 상하)
- 폰트: `text-sm` (14px)
- 라운드: `rounded-full`

### 2. 카드

#### 서비스 카드

```tsx
<div className="group p-8 border border-gray-100 rounded-2xl hover:shadow-xl transition-all bg-white">
  <div className="mb-4">
    <Icon className="h-8 w-8 text-blue-500" />
  </div>
  <h3 className="text-xl font-bold mb-3 group-hover:text-blue-500 transition-colors">
    카드 제목
  </h3>
  <p className="text-gray-600">카드 설명</p>
</div>
```

**치수**:

- 패딩: `p-8` (32px)
- 라운드: `rounded-2xl` (16px)
- 아이콘: `h-8 w-8` (32px)
- 제목: `text-xl font-bold` (20px, 700)
- 간격: `mb-4`, `mb-3` (16px, 12px)

#### 고객 후기 카드

```tsx
<div className="p-6 bg-white border border-gray-200 rounded-xl">
  <div className="flex items-center gap-1 mb-3">
    {[...Array(5)].map((_, i) => (
      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
    ))}
  </div>
  <p className="text-gray-700 mb-4 leading-relaxed">"후기 내용"</p>
  <div className="flex items-center gap-3">
    <div className="h-10 w-10 rounded-full bg-gray-200" />
    <div>
      <p className="font-bold text-sm">고객명</p>
      <p className="text-xs text-gray-500">직책</p>
    </div>
  </div>
</div>
```

**치수**:

- 패딩: `p-6` (24px)
- 라운드: `rounded-xl` (12px)
- 별점: `h-5 w-5` (20px)
- 아바타: `h-10 w-10` (40px)

### 3. 배지/태그

```tsx
// 강조 배지
<span className="inline-block px-4 py-2 bg-orange-500/20 backdrop-blur-sm text-orange-300 rounded-full text-sm font-bold border border-orange-500/30">
  🔥 현재 300개 프랜차이즈 지점 마케팅 진행 중
</span>

// 일반 배지
<span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
  DATA-DRIVEN
</span>
```

**치수**:

- 강조: `px-4 py-2` (16px, 8px), `text-sm` (14px)
- 일반: `px-3 py-1` (12px, 4px), `text-xs` (12px)

### 4. 입력 폼

```tsx
<input
  type="text"
  placeholder="이름"
  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
/>

<textarea
  placeholder="문의 내용"
  rows={4}
  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
/>
```

**치수**:

- 패딩: `px-4 py-3` (16px, 12px)
- 라운드: `rounded-lg` (8px)
- 포커스 링: `ring-2` (2px)

---

## 🎨 색상 시스템

### 브랜드 색상

```css
:root {
  /* Fan1 (MZ Marketing) */
  --color-fan1: #ffe400;
  --color-fan1-dark: #ccb600;

  /* Fan2 (Growth Marketing) */
  --color-fan2: #22c55e;
  --color-fan2-dark: #16a34a;

  /* Fan3 (Tech Marketing) */
  --color-fan3: #6366f1;
  --color-fan3-dark: #4f46e5;

  /* Fan4 */
  --color-fan4: #f97316;
  --color-fan4-dark: #ea580c;

  /* Bizon */
  --color-bizon: #f97316;
}
```

### 그라데이션 패턴

```tsx
// 선형 그라데이션 (버튼, 배경)
<div className="bg-linear-to-r from-orange-500 to-red-500">

// 텍스트 그라데이션
<h1 className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 via-purple-500 to-cyan-400">
  그라데이션 텍스트
</h1>

// 배경 그라데이션 (오버레이)
<div className="bg-linear-to-b from-transparent via-black/50 to-black">
```

### 색상 사용 규칙

| 용도              | 색상                  | Tailwind 클래스                      |
| ----------------- | --------------------- | ------------------------------------ |
| **주요 CTA**      | Orange-Red 그라데이션 | `from-orange-500 to-red-500`         |
| **본문 텍스트**   | 진한 회색             | `text-gray-900`                      |
| **보조 텍스트**   | 중간 회색             | `text-gray-600`                      |
| **비활성 텍스트** | 연한 회색             | `text-gray-400`                      |
| **배경**          | 흰색/연한 회색        | `bg-white`, `bg-gray-50`             |
| **테두리**        | 연한 회색             | `border-gray-100`, `border-gray-200` |

---

## 📏 간격/여백 규칙

### Tailwind 간격 값 (실제 픽셀)

| 클래스   | 픽셀 | 용도                      |
| -------- | ---- | ------------------------- |
| `gap-1`  | 4px  | 아이콘-텍스트 간격 (최소) |
| `gap-2`  | 8px  | 작은 요소 간격            |
| `gap-3`  | 12px | 버튼 내 아이콘-텍스트     |
| `gap-4`  | 16px | 카드 내 요소 간격         |
| `gap-6`  | 24px | 섹션 내 요소 간격         |
| `gap-8`  | 32px | 그리드 간격 (기본)        |
| `gap-12` | 48px | 큰 그리드 간격            |

### 마진/패딩 표준값

```tsx
// 섹션 간격
<section className="py-12 md:py-20 lg:py-24">  // 48px → 80px → 96px

// 요소 간 간격
<div className="mb-4">   // 16px (작은 간격)
<div className="mb-6">   // 24px (중간 간격)
<div className="mb-8">   // 32px (큰 간격)
<div className="mb-12">  // 48px (섹션 구분)
<div className="mb-16">  // 64px (큰 섹션 구분)

// 좌우 패딩
<div className="px-4">   // 16px (모바일)
<div className="px-6">   // 24px (기본)
<div className="px-8">   // 32px (넓은 패딩)
```

### 실전 간격 패턴

```tsx
// 히어로 섹션
<div className="text-center">
  <span className="mb-6">배지</span>
  <h1 className="mb-6">타이틀</h1>
  <p className="mb-4">설명</p>
  <p className="mb-10">부가 설명</p>
  <div>버튼</div>
</div>

// 카드 그리드
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  {/* 카드들 */}
</div>

// 폼 요소
<div className="space-y-4">  // 각 요소 간 16px 간격
  <input />
  <input />
  <textarea />
  <button />
</div>
```

---

## 📱 반응형 브레이크포인트

### 브레이크포인트 정의

```css
/* 커스텀 브레이크포인트 */
@media (max-width: 900px)  { /* 태블릿/모바일 전환 */ }
@media (max-width: 600px)  { /* 모바일 */ }
@media (max-width: 360px)  { /* 작은 모바일 */ }

/* Tailwind 브레이크포인트 */
sm: 640px   /* 작은 태블릿 */
md: 768px   /* 태블릿 */
lg: 1024px  /* 작은 데스크탑 */
xl: 1280px  /* 데스크탑 */
```

### 반응형 유틸리티

```css
/* 모바일에서 숨김 */
.mb-hide {
  display: block;
}
@media (max-width: 600px) {
  .mb-hide {
    display: none !important;
  }
}

/* 모바일에서만 표시 */
.mb-show {
  display: none;
}
@media (max-width: 600px) {
  .mb-show {
    display: block !important;
  }
}
```

### 실전 반응형 패턴

```tsx
// 텍스트 크기
<h1 className="text-4xl md:text-5xl lg:text-7xl">
  모바일 36px → 태블릿 48px → PC 72px
</h1>

// 그리드
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  모바일 1열 → 태블릿 2열 → PC 3열
</div>

// 플렉스 방향
<div className="flex flex-col sm:flex-row gap-4">
  모바일 세로 → 태블릿 가로
</div>

// 패딩
<section className="py-12 md:py-20 lg:py-24 px-4 md:px-6 lg:px-8">
  모바일 → 태블릿 → PC 순차 증가
</section>

// 표시/숨김
<div className="hidden md:block">태블릿 이상 표시</div>
<div className="block md:hidden">모바일만 표시</div>
```

---

## 🎬 AOS 애니메이션

### 초기화 (hooks/use-aos.ts)

```typescript
"use client";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export function useAOS() {
  useEffect(() => {
    AOS.init({
      duration: 1000, // 애니메이션 지속 시간
      easing: "ease-out-cubic", // 이징 함수
      once: true, // 한 번만 실행
      offset: 100, // 트리거 오프셋 (px)
      delay: 0, // 기본 딜레이
      anchorPlacement: "top-bottom",
      disable: false, // 모바일에서도 활성화
    });
    return () => AOS.refresh();
  }, []);
}
```

### 사용법

```tsx
export default function MarketingPage() {
  useAOS(); // 컴포넌트 최상단에서 호출

  return (
    <div>
      {/* 기본 페이드업 */}
      <h1 data-aos="fade-up">타이틀</h1>

      {/* 딜레이 추가 */}
      <p data-aos="fade-up" data-aos-delay="100">
        설명
      </p>

      {/* 순차 애니메이션 */}
      {items.map((item, i) => (
        <div key={i} data-aos="fade-up" data-aos-delay={i * 100}>
          {item}
        </div>
      ))}
    </div>
  );
}
```

### 애니메이션 타입

| 타입         | 설명             | 추천 용도           |
| ------------ | ---------------- | ------------------- |
| `fade-up`    | 아래→위 페이드인 | 타이틀, 카드 (기본) |
| `fade-down`  | 위→아래 페이드인 | 배지, 헤더 요소     |
| `fade-left`  | 오른쪽→왼쪽      | 이미지 (우측)       |
| `fade-right` | 왼쪽→오른쪽      | 이미지 (좌측)       |
| `zoom-in`    | 확대 페이드인    | 강조 요소, 아이콘   |
| `slide-up`   | 슬라이드 업      | 모달, 팝업          |

### 딜레이 패턴

```tsx
// 순차 등장 (100ms 간격)
{items.map((item, i) => (
  <div data-aos="fade-up" data-aos-delay={i * 100}>
    {item}
  </div>
))}

// 계층별 딜레이
<div data-aos="fade-down">배지</div>
<h1 data-aos="fade-up" data-aos-delay="100">타이틀</h1>
<p data-aos="fade-up" data-aos-delay="200">설명</p>
<button data-aos="fade-up" data-aos-delay="300">버튼</button>
```

---

## 📋 실전 체크리스트

### 새 페이지 생성 시

- [ ] `useAOS()` 훅 추가
- [ ] 히어로 섹션: `min-h-screen`, 중앙 정렬
- [ ] 타이틀: 반응형 클래스 사용 (`text-4xl md:text-5xl lg:text-7xl`)
- [ ] 섹션 패딩: `py-12 md:py-20 lg:py-24`
- [ ] 컨테이너: `max-w-7xl mx-auto px-6`
- [ ] 주요 요소에 `data-aos="fade-up"` 추가
- [ ] 순차 애니메이션: `data-aos-delay={i * 100}`
- [ ] 모바일 테스트 (900px, 600px 브레이크포인트)

### 컴포넌트 개발 시

- [ ] 패딩: 버튼 `px-10 py-5`, 카드 `p-8`
- [ ] 라운드: 버튼 `rounded-2xl`, 카드 `rounded-2xl`
- [ ] 간격: 그리드 `gap-8`, 요소 간 `mb-6`
- [ ] 호버 효과: `hover:shadow-xl transition-all`
- [ ] 아이콘 크기: 버튼 `h-6 w-6`, 카드 `h-8 w-8`
- [ ] 폰트: 타이틀 `font-bold`, CTA `font-black`

---

## 🎯 빠른 참조표

### 자주 쓰는 조합

```tsx
// 히어로 타이틀
<h1 className="text-4xl md:text-5xl lg:text-7xl font-black leading-tight text-white" data-aos="fade-up">

// 섹션 타이틀
<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6" data-aos="fade-up">

// 본문
<p className="text-xl md:text-2xl text-gray-600 leading-relaxed">

// 주요 CTA
<a className="px-10 py-5 bg-linear-to-r from-orange-500 to-red-500 text-white rounded-2xl text-xl font-bold hover:shadow-2xl transition-all flex items-center gap-3">

// 카드
<div className="p-8 border border-gray-100 rounded-2xl hover:shadow-xl transition-all bg-white" data-aos="fade-up">

// 그리드
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

// 섹션
<section className="py-12 md:py-20 lg:py-24 px-6 bg-white">
  <div className="max-w-7xl mx-auto">
```

---

**마지막 업데이트**: 2025-12-25  
**버전**: 2.0.0 (최종 실전 가이드)
