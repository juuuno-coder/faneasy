# FanEasy 디자인 시스템 가이드

> 다른 프로젝트에도 재사용 가능한 디자인 시스템 설정 문서

---

## 📚 목차

1. [기술 스택](#기술-스택)
2. [폰트 시스템](#폰트-시스템)
3. [타이포그래피](#타이포그래피)
4. [반응형 디자인](#반응형-디자인)
5. [색상 시스템](#색상-시스템)
6. [애니메이션](#애니메이션)
7. [레이아웃 패턴](#레이아웃-패턴)

---

## 🛠 핵심 기술 스택

- **Next.js** `16.1.0` (App Router)
- **React** `19.2.3`
- **TypeScript** `^5`
- **Tailwind CSS** `^4`
- **AOS** `^2.3.4` (스크롤 애니메이션)

---

## ⚙️ 세부 설정값

### 1. 폰트 설정

#### CDN 로드

```css
/* globals.css - 최상단 */
@import "tailwindcss";
@import url("https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css");
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap");
```

#### CSS 변수 정의

```css
@layer base {
  :root {
    --font-pretendard: "Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont,
      system-ui, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    --font-poppins: "Poppins", sans-serif;
    --font-main: "Poppins", "Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont,
      system-ui, Roboto, "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR",
      "Malgun Gothic", sans-serif;
  }
}
```

#### 전역 폰트 적용

```css
@layer base {
  html {
    font-family: var(--font-main);
  }

  body {
    font-family: var(--font-main);
    word-break: keep-all;
    letter-spacing: -0.02em;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* 모든 요소에 강제 적용 */
  *,
  *::before,
  *::after {
    font-family: var(--font-main) !important;
  }
}
```

#### 폰트 클래스

```css
/* 영문 전용 */
.font-poppins {
  font-family: var(--font-poppins) !important;
  letter-spacing: 0;
}

/* 숫자 전용 (Tabular) */
.font-number {
  font-family: var(--font-poppins) !important;
  font-feature-settings: "tnum" on, "lnum" on;
  letter-spacing: 0;
}
```

### 2. 타이포그래피 설정

#### 반응형 폰트 크기 (PC/모바일 비교)

| 용도                 | 클래스             | PC (>900px)     | 모바일 (≤900px)  | 축소율 | Weight |
| -------------------- | ------------------ | --------------- | ---------------- | ------ | ------ |
| **초대형 타이틀**    | `.main-ttl.lg-ttl` | 64px (4rem)     | 32px (2rem)      | 50%    | 800    |
| **대형 타이틀**      | `.main-ttl.md-ttl` | 58px (3.625rem) | 26px (1.625rem)  | ~45%   | 800    |
| **중형 타이틀**      | `.main-ttl.ms-ttl` | 52px (3.25rem)  | 24px (1.5rem)    | ~46%   | 700    |
| **소형 타이틀**      | `.main-ttl.sm-ttl` | 28px (1.75rem)  | 17px (1.0625rem) | ~61%   | 700    |
| **아주 작은 타이틀** | `.main-ttl.ss-ttl` | 24px (1.5rem)   | 15px (0.9375rem) | 62.5%  | 600    |
| **최소 타이틀**      | `.main-ttl.xs-ttl` | 20px (1.25rem)  | 15px (0.9375rem) | 75%    | 600    |

#### 고정 폰트 크기 (반응형 없음)

| 크기       | 클래스    | rem  | px            | 용도 |
| ---------- | --------- | ---- | ------------- | ---- |
| `.f-rem12` | 0.75rem   | 12px | 캡션, 라벨    |
| `.f-rem14` | 0.875rem  | 14px | 작은 본문     |
| `.f-rem15` | 0.9375rem | 15px | 모바일 본문   |
| `.f-rem17` | 1.0625rem | 17px | PC 본문       |
| `.f-rem20` | 1.25rem   | 20px | 소제목        |
| `.f-rem24` | 1.5rem    | 24px | 섹션 제목     |
| `.f-rem28` | 1.75rem   | 28px | 큰 제목       |
| `.f-rem32` | 2rem      | 32px | 히어로 부제목 |
| `.f-rem48` | 3rem      | 48px | 히어로 타이틀 |
| `.f-rem52` | 3.25rem   | 52px | 메인 히어로   |
| `.f-rem58` | 3.625rem  | 58px | 초대형 히어로 |
| `.f-rem64` | 4rem      | 64px | 최대 히어로   |

#### 실제 CSS 코드

```css
/* 초대형 타이틀: 64px → 32px (50% 축소) */
.main-ttl.lg-ttl {
  font-size: 4rem;
  font-weight: 800;
  line-height: 1.2;
}
@media (max-width: 900px) {
  .main-ttl.lg-ttl {
    font-size: 2rem;
  }
}

/* 대형 타이틀: 58px → 26px */
.main-ttl.md-ttl {
  font-size: 3.625rem;
  font-weight: 800;
  line-height: 1.2;
}
@media (max-width: 900px) {
  .main-ttl.md-ttl {
    font-size: 1.625rem;
  }
}

/* 중형 타이틀: 52px → 24px */
.main-ttl.ms-ttl {
  font-size: 3.25rem;
  font-weight: 700;
  line-height: 1.25;
}
@media (max-width: 900px) {
  .main-ttl.ms-ttl {
    font-size: 1.5rem;
  }
}

/* 소형 타이틀: 28px → 17px */
.main-ttl.sm-ttl {
  font-size: 1.75rem;
  font-weight: 700;
  line-height: 1.3;
}
@media (max-width: 900px) {
  .main-ttl.sm-ttl {
    font-size: 1.0625rem;
  }
}
```

#### 사용 예시

```tsx
// 히어로 섹션 - 초대형 타이틀
<h1 className="main-ttl lg-ttl">
  PC 64px, 모바일 32px
</h1>

// 섹션 타이틀 - 중형
<h2 className="main-ttl ms-ttl">
  PC 52px, 모바일 24px
</h2>

// 카드 제목 - 소형
<h3 className="main-ttl sm-ttl">
  PC 28px, 모바일 17px
</h3>

// 고정 크기 (반응형 없음)
<p className="f-rem17">
  항상 17px (PC 본문)
</p>
```

### 3. 반응형 브레이크포인트

```css
/* 모바일 우선 (Mobile First) */
@media (max-width: 900px) {
  /* 태블릿/모바일 전환점 */
}
@media (max-width: 600px) {
  /* 모바일 */
}
@media (max-width: 360px) {
  /* 작은 모바일 */
}
```

#### 반응형 유틸리티

```css
/* 모바일에서 숨김 */
.mb-hide {
  display: block;
}
@media (max-width: 900px) {
  .mb-hide {
    display: none !important;
  }
}

/* 모바일에서만 표시 */
.mb-show {
  display: none;
}
@media (max-width: 900px) {
  .mb-show {
    display: block !important;
  }
}

/* 태블릿에서 숨김 */
.tab-hide {
  display: block;
}
@media (min-width: 601px) and (max-width: 900px) {
  .tab-hide {
    display: none !important;
  }
}
```

### 4. AOS 애니메이션 설정

#### 초기화 (hooks/use-aos.ts)

```typescript
"use client";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export function useAOS() {
  useEffect(() => {
    AOS.init({
      duration: 1000, // 애니메이션 지속 시간 (ms)
      easing: "ease-out-cubic", // 이징 함수
      once: true, // 한 번만 실행 (true) / 반복 (false)
      offset: 100, // 뷰포트에서 트리거 오프셋 (px)
      delay: 0, // 기본 딜레이 (ms)
      anchorPlacement: "top-bottom", // 트리거 위치
      disable: false, // 모바일에서도 활성화
    });
    return () => AOS.refresh();
  }, []);
}
```

#### 사용 예시

```tsx
export default function MarketingPage() {
  useAOS(); // 컴포넌트 최상단

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
        <div
          key={i}
          data-aos="fade-up"
          data-aos-delay={i * 100}
          data-aos-duration="1200"
        >
          {item}
        </div>
      ))}
    </div>
  );
}
```

#### 애니메이션 타입

```
fade-up        // 아래→위 페이드인
fade-down      // 위→아래 페이드인
fade-left      // 오른쪽→왼쪽 페이드인
fade-right     // 왼쪽→오른쪽 페이드인
zoom-in        // 확대 페이드인
zoom-out       // 축소 페이드인
slide-up       // 슬라이드 업
flip-left      // 왼쪽 플립
```

### 5. 색상 시스템

#### 브랜드 색상

```css
:root {
  /* Fan1 (MZ Marketing) */
  --color-fan1: #ffe400;

  /* Fan2 (Growth Marketing) */
  --color-fan2: #22c55e;

  /* Fan3 (Tech Marketing) */
  --color-fan3: #6366f1;

  /* Fan4 */
  --color-fan4: #f97316;

  /* Bizon */
  --color-bizon: #f97316;
}
```

#### 그라데이션 패턴

```tsx
// 선형 그라데이션
<div className="bg-linear-to-r from-orange-500 to-red-500">

// 텍스트 그라데이션
<h1 className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 via-purple-500 to-cyan-400">
```

### 6. 레이아웃 패턴

#### 컨테이너 최대 너비

```tsx
<div className="max-w-7xl mx-auto px-6">
  {/* 1280px 최대 너비, 중앙 정렬, 좌우 패딩 */}
</div>
```

#### 섹션 패딩 (반응형)

```tsx
<section className="py-12 md:py-20 lg:py-24 px-4 md:px-6 lg:px-8">
  {/* 모바일: py-12, 태블릿: py-20, 데스크탑: py-24 */}
</section>
```

#### 그리드 레이아웃

```tsx
// 반응형 그리드
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

// Auto-fit 그리드
<div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6">
```

### 7. 성능 최적화 설정

#### 폰트 로딩

```css
/* display=swap으로 FOUT 최소화 */
@import url("...&display=swap");
```

#### 이미지 최적화

```tsx
import Image from "next/image";

<Image
  src="/image.jpg"
  alt="설명"
  width={1200}
  height={600}
  priority // LCP 최적화 (히어로 이미지)
  loading="lazy" // 지연 로딩 (일반 이미지)
  quality={85} // 품질 (기본 75)
/>;
```

#### 폰트 스무딩

```css
body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

---

## 🔤 폰트 시스템

### 폰트 조합

```
영문/숫자: Poppins (Google Fonts)
한글: Pretendard Variable (CDN)
```

### CSS 설정

```css
/* globals.css */
@import "tailwindcss";
@import url("https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css");
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap");

@layer base {
  :root {
    --font-poppins: "Poppins", sans-serif;
    --font-pretendard: "Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont,
      system-ui;
    --font-main: "Poppins", "Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont,
      system-ui;
  }

  *,
  *::before,
  *::after {
    font-family: var(--font-main) !important;
  }

  body {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
}
```

### 폰트 클래스

```tsx
// 기본 (영문 Poppins, 한글 Pretendard 자동 폴백)
<div className="font-sans">텍스트 Text</div>

// 영문 전용 (Poppins 강제)
<div className="font-poppins">Numbers 123</div>

// 숫자 전용 (Tabular 정렬)
<div className="font-number">1,234,567</div>
```

### 폰트 가중치

| 클래스         | Weight | 용도   |
| -------------- | ------ | ------ |
| `.f-thin`      | 100    | 장식용 |
| `.f-light`     | 300    | 부제목 |
| `.f-regular`   | 400    | 본문   |
| `.f-medium`    | 500    | 강조   |
| `.f-semibold`  | 600    | 제목   |
| `.f-bold`      | 700    | 헤딩   |
| `.f-extrabold` | 800    | 히어로 |
| `.f-black`     | 900    | 초강조 |

---

## 📐 타이포그래피

### 폰트 크기 시스템

```css
/* 유틸리티 클래스 */
.f-rem12 {
  font-size: 0.75rem;
} /* 12px - 캡션 */
.f-rem14 {
  font-size: 0.875rem;
} /* 14px - 작은 본문 */
.f-rem15 {
  font-size: 0.9375rem;
} /* 15px - 본문 */
.f-rem17 {
  font-size: 1.0625rem;
} /* 17px - 큰 본문 */
.f-rem20 {
  font-size: 1.25rem;
} /* 20px - 소제목 */
.f-rem24 {
  font-size: 1.5rem;
} /* 24px - 제목 */
.f-rem28 {
  font-size: 1.75rem;
} /* 28px - 큰 제목 */
.f-rem32 {
  font-size: 2rem;
} /* 32px - 섹션 타이틀 */
.f-rem48 {
  font-size: 3rem;
} /* 48px - 히어로 */
.f-rem64 {
  font-size: 4rem;
} /* 64px - 메인 히어로 */
```

### 반응형 타이틀

```tsx
// 데스크탑 64px → 모바일 32px (50% 축소)
<h1 className="main-ttl lg-ttl">초대형 타이틀</h1>

// 데스크탑 58px → 모바일 26px
<h2 className="main-ttl md-ttl">대형 타이틀</h2>

// 데스크탑 52px → 모바일 24px
<h3 className="main-ttl ms-ttl">중형 타이틀</h3>

// 데스크탑 48px → 모바일 22px
<h4 className="main-ttl sm-ttl">소형 타이틀</h4>
```

### 자간/행간

```css
/* 한글 최적화 자간 */
letter-spacing: -0.02em; /* 기본값 */
letter-spacing: -0.04em; /* 타이틀용 (더 타이트) */

/* 행간 */
.lh-tight {
  line-height: 1.2;
} /* 타이틀 */
.lh-snug {
  line-height: 1.3;
} /* 서브타이틀 */
.lh-normal {
  line-height: 1.5;
} /* 본문 */
.lh-relaxed {
  line-height: 1.6;
} /* 긴 설명 */
```

---

## 📱 반응형 디자인

### 브레이크포인트

```css
/* 모바일 우선 (Mobile First) */
@media (max-width: 900px)  { /* 태블릿/모바일 */ }
@media (max-width: 600px)  { /* 모바일 */ }
@media (max-width: 360px)  { /* 작은 모바일 */ }

/* Tailwind 브레이크포인트 */
sm: 640px   /* 작은 태블릿 */
md: 768px   /* 태블릿 */
lg: 1024px  /* 작은 데스크탑 */
xl: 1280px  /* 데스크탑 */
2xl: 1536px /* 큰 데스크탑 */
```

### 반응형 유틸리티

```tsx
// 모바일에서 숨김
<div className="mb-hide">데스크탑 전용</div>

// 모바일에서만 표시
<div className="mb-show">모바일 전용</div>

// 태블릿에서 숨김
<div className="tab-hide">데스크탑/모바일 전용</div>

// Tailwind 방식
<div className="hidden md:block">태블릿 이상 표시</div>
<div className="block md:hidden">모바일만 표시</div>
```

### 반응형 폰트 크기 패턴

```tsx
// 방법 1: Tailwind 클래스
<h1 className="text-4xl md:text-6xl lg:text-7xl">
  반응형 타이틀
</h1>

// 방법 2: 커스텀 클래스
<h1 className="main-ttl lg-ttl">
  자동 반응형 타이틀
</h1>

// 방법 3: CSS clamp
<h1 style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}>
  유동적 타이틀
</h1>
```

### 컨테이너 패턴

```tsx
// 최대 너비 제한
<div className="max-w-7xl mx-auto px-6">
  {/* 콘텐츠 */}
</div>

// 반응형 패딩
<section className="py-12 md:py-20 lg:py-24 px-4 md:px-6 lg:px-8">
  {/* 섹션 */}
</section>
```

---

## 🎨 색상 시스템

### 브랜드별 색상

```css
/* Fan1 (MZ Marketing) */
--color-fan1: #ffe400; /* Yellow */

/* Fan2 (Growth Marketing) */
--color-fan2: #22c55e; /* Green */

/* Fan3 (Tech Marketing) */
--color-fan3: #6366f1; /* Indigo */

/* Fan4 (매듭컴퍼니 스타일) */
--color-fan4: #f97316; /* Orange */

/* Bizon */
--color-bizon: #f97316; /* Orange */
```

### 그라데이션 패턴

```tsx
// 선형 그라데이션
<div className="bg-linear-to-r from-orange-500 to-red-500">
  그라데이션 배경
</div>

// 텍스트 그라데이션
<h1 className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 via-purple-500 to-cyan-400">
  그라데이션 텍스트
</h1>
```

### 다크모드 대응

```tsx
// Tailwind 다크모드
<div className="bg-white dark:bg-gray-900 text-black dark:text-white">
  다크모드 대응
</div>
```

---

## 🎬 애니메이션

### AOS (Animate On Scroll)

#### 설치

```bash
npm install aos @types/aos
```

#### 초기화 (hooks/use-aos.ts)

```tsx
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
      offset: 100, // 트리거 오프셋
      disable: false, // 모바일에서도 활성화
    });
    return () => AOS.refresh();
  }, []);
}
```

#### 사용법

```tsx
export default function MarketingPage() {
  useAOS(); // 컴포넌트 최상단에서 호출

  return (
    <div>
      <h1 data-aos="fade-up">타이틀</h1>
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

#### 애니메이션 타입

```tsx
// 페이드
data-aos="fade-up"        // 아래→위
data-aos="fade-down"      // 위→아래
data-aos="fade-left"      // 오른쪽→왼쪽
data-aos="fade-right"     // 왼쪽→오른쪽

// 줌
data-aos="zoom-in"        // 확대
data-aos="zoom-out"       // 축소

// 슬라이드
data-aos="slide-up"       // 슬라이드 업
data-aos="slide-down"     // 슬라이드 다운
```

#### 옵션

```tsx
data-aos-duration="1500"     // 지속 시간 (ms)
data-aos-delay="200"         // 딜레이 (ms)
data-aos-offset="300"        // 오프셋 (px)
data-aos-easing="ease-in-out" // 이징
data-aos-once="false"        // 반복 실행
```

### Hover 효과

```tsx
// 스케일
<button className="hover:scale-105 transition-transform">
  버튼
</button>

// 그림자
<div className="hover:shadow-lg transition-shadow">
  카드
</div>

// 색상 변경
<a className="text-gray-400 hover:text-white transition-colors">
  링크
</a>

// 복합 효과
<div className="group">
  <img className="group-hover:scale-110 transition-transform duration-700" />
  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
    오버레이
  </div>
</div>
```

---

## 📦 레이아웃 패턴

### 히어로 섹션

```tsx
<section className="pt-32 pb-20 px-6 bg-linear-to-b from-gray-50 to-white">
  <div className="max-w-5xl mx-auto text-center">
    <h1 className="text-6xl md:text-7xl font-black mb-8" data-aos="fade-up">
      메인 타이틀
    </h1>
    <p
      className="text-xl text-gray-600 mb-10"
      data-aos="fade-up"
      data-aos-delay="100"
    >
      서브 타이틀
    </p>
    <div
      className="flex gap-4 justify-center"
      data-aos="fade-up"
      data-aos-delay="200"
    >
      <button className="px-8 py-4 bg-black text-white rounded-full">
        CTA 버튼
      </button>
    </div>
  </div>
</section>
```

### 그리드 레이아웃

```tsx
// 반응형 그리드
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  {items.map((item, i) => (
    <div key={i} data-aos="fade-up" data-aos-delay={i * 100}>
      카드
    </div>
  ))}
</div>

// Auto-fit 그리드
<div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6">
  {/* 자동으로 열 개수 조정 */}
</div>
```

### 카드 컴포넌트

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

### 고정 헤더

```tsx
<header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
  <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
    <div className="font-bold text-xl">로고</div>
    <nav className="hidden md:flex gap-8">
      <a href="#about">About</a>
      <a href="#services">Services</a>
    </nav>
  </div>
</header>;

{
  /* 헤더 높이만큼 패딩 */
}
<main className="pt-16">{/* 콘텐츠 */}</main>;
```

---

## 🎯 베스트 프랙티스

### 1. 폰트 로딩 최적화

```tsx
// ✅ 좋음: display=swap으로 FOUT 최소화
@import url('...&display=swap');

// ✅ 좋음: 필요한 weight만 로드
@import url('...?family=Poppins:wght@400;600;700');

// ❌ 나쁨: 모든 weight 로드
@import url('...?family=Poppins:wght@100;200;...;900');
```

### 2. 반응형 이미지

```tsx
// Next.js Image 컴포넌트 사용
import Image from "next/image";

<Image
  src="/hero.jpg"
  alt="히어로 이미지"
  width={1200}
  height={600}
  priority // LCP 최적화
  className="w-full h-auto"
/>;
```

### 3. 접근성

```tsx
// 시맨틱 HTML 사용
<header>
<nav>
<main>
<section>
<article>
<footer>

// ARIA 레이블
<button aria-label="메뉴 열기">
  <MenuIcon />
</button>

// 키보드 네비게이션
<a href="#main-content" className="sr-only focus:not-sr-only">
  본문으로 건너뛰기
</a>
```

### 4. 성능 최적화

```tsx
// 동적 import로 코드 스플리팅
const HeavyComponent = dynamic(() => import("./HeavyComponent"), {
  loading: () => <Skeleton />,
  ssr: false, // 클라이언트 전용
});

// 이미지 lazy loading
<img loading="lazy" src="..." alt="..." />;
```

---

## 📝 체크리스트

### 새 페이지 생성 시

- [ ] `useAOS()` 훅 추가
- [ ] 반응형 타이틀 클래스 사용
- [ ] 주요 섹션에 `data-aos` 속성 추가
- [ ] 모바일/데스크탑 모두 테스트
- [ ] SEO 메타데이터 설정
- [ ] 접근성 검증 (ARIA, 시맨틱 HTML)

### 컴포넌트 개발 시

- [ ] TypeScript 타입 정의
- [ ] 반응형 디자인 적용
- [ ] Hover/Focus 상태 디자인
- [ ] 로딩/에러 상태 처리
- [ ] 재사용 가능하게 props 설계

---

## 🔗 참고 자료

- [Tailwind CSS 공식 문서](https://tailwindcss.com)
- [AOS 라이브러리](https://michalsnik.github.io/aos/)
- [Pretendard 폰트](https://github.com/orioncactus/pretendard)
- [Poppins 폰트](https://fonts.google.com/specimen/Poppins)
- [Lucide Icons](https://lucide.dev)

---

**마지막 업데이트**: 2025-12-25
**버전**: 1.0.0
