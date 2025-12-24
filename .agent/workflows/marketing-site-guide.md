# 마케팅 사이트 표준 가이드

이 문서는 모든 새로운 마케팅 페이지에 적용해야 할 표준 디자인 규칙을 정의합니다.

---

## 📝 폰트 시스템

### 한글 폰트: **Pretendard**

- CDN: `https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css`
- 이미 `globals.css`에 전역 적용됨

### 영문/숫자 폰트: **Poppins**

- CDN: Google Fonts
- 사용법: `className="font-poppins"` 또는 `className="font-number"`

```jsx
// 숫자에 Poppins 적용
<span className="font-poppins">300+</span>
<span className="font-number">1,500%</span>
```

---

## 📐 타이포그래피 규칙

### 자간 (Letter Spacing)

- 기본값: `-0.04em` (한글 최적화)
- 영문: `0` (Poppins에 자동 적용)

### 행간 (Line Height)

| 용도       | 클래스       | 값  |
| ---------- | ------------ | --- |
| 타이틀     | `lh-tight`   | 1.2 |
| 서브타이틀 | `lh-snug`    | 1.3 |
| 본문       | `lh-normal`  | 1.5 |
| 긴 설명    | `lh-relaxed` | 1.6 |

### 폰트 크기 (반응형)

| 용도          | Desktop | Mobile | 비율 |
| ------------- | ------- | ------ | ---- |
| 히어로 타이틀 | 64px    | 32px   | 50%  |
| 섹션 타이틀   | 48-52px | 24px   | ~50% |
| 카드 제목     | 28px    | 17px   | 60%  |
| 본문          | 17px    | 15px   | 88%  |

### 반응형 타이틀 클래스

```jsx
<h1 className="main-ttl lg-ttl">초대형 타이틀</h1>  // 64px → 32px
<h2 className="main-ttl md-ttl">대형 타이틀</h2>    // 58px → 26px
<h3 className="main-ttl ms-ttl">중형 타이틀</h3>    // 52px → 24px
```

---

## 🎬 AOS 스크롤 애니메이션

### 설치

```bash
npm install aos @types/aos
```

### 사용법

1. 마케팅 컴포넌트에서 `useAOS()` 훅 호출
2. 요소에 `data-aos` 속성 추가

```tsx
import { useAOS } from "@/hooks/use-aos";

export default function NewMarketing({ site }: { site: string }) {
  useAOS(); // AOS 초기화

  return (
    <div>
      <h1 data-aos="fade-up">타이틀</h1>
      <p data-aos="fade-up" data-aos-delay="100">
        설명
      </p>
    </div>
  );
}
```

### 자주 사용하는 애니메이션

| 애니메이션   | 설명              |
| ------------ | ----------------- |
| `fade-up`    | 아래→위 페이드인  |
| `fade-down`  | 위→아래 페이드인  |
| `fade-left`  | 오른쪽→왼쪽       |
| `fade-right` | 왼쪽→오른쪽       |
| `zoom-in`    | 확대되며 페이드인 |

### 딜레이 적용

```jsx
// 순차적으로 나타나게 하기
{
  items.map((item, i) => (
    <div data-aos="fade-up" data-aos-delay={i * 100}>
      {item}
    </div>
  ));
}
```

---

## 📱 반응형 브레이크포인트

| 브레이크포인트     | 용도                      |
| ------------------ | ------------------------- |
| `max-width: 900px` | 태블릿/모바일 전환 (메인) |
| `max-width: 600px` | 모바일                    |
| `max-width: 360px` | 작은 모바일               |

### 유틸리티 클래스

```jsx
<div className="mb-hide">모바일에서 숨김</div>
<div className="mb-show">모바일에서만 표시</div>
<div className="tab-hide">태블릿에서 숨김</div>
```

---

## 🎨 색상 시스템

각 마케팅 페이지는 고유한 브랜드 색상을 사용합니다:

| 사이트        | 메인 색상          | 용도          |
| ------------- | ------------------ | ------------- |
| Fan1 (MZ)     | `#FFE400` (Yellow) | 트렌디/MZ     |
| Fan2 (Growth) | `#22C55E` (Green)  | 성장/데이터   |
| Fan3 (Tech)   | `#6366F1` (Indigo) | 테크/프리미엄 |
| Fan4          | `#F97316` (Orange) | 에너지/신뢰   |
| Bizon         | `#F97316` (Orange) | 프랜차이즈    |

---

## ✅ 새 마케팅 페이지 생성 체크리스트

1. [ ] `app/sites/[site]/새이름-marketing.tsx` 파일 생성
2. [ ] `'use client'` 선언
3. [ ] `useAOS()` 훅 import 및 호출
4. [ ] 히어로 섹션에 `data-aos="fade-up"` 적용
5. [ ] 서비스/기능 카드에 순차 딜레이 적용: `data-aos-delay={i * 100}`
6. [ ] CTA 버튼에 그라데이션 적용
7. [ ] 반응형 타이틀 클래스 사용
8. [ ] `page.tsx`에 라우팅 조건 추가
9. [ ] 테스트: 모바일/데스크탑 모두 확인

---

## 📄 템플릿 구조

```tsx
"use client";

import { useAOS } from "@/hooks/use-aos";
import InquiryForm from "./inquiry-form";
import HeaderActions from "./header-actions";

export default function NewMarketing({ site }: { site: string }) {
  useAOS();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 ... ">
        <HeaderActions site={site} />
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 ...">
        <h1 data-aos="fade-up">타이틀</h1>
      </section>

      {/* Services */}
      <section id="services" className="py-24 ...">
        {/* 카드 그리드 */}
      </section>

      {/* Contact Form */}
      <section id="contact" className="py-24 ...">
        <InquiryForm influencerId="inf-1" variant="clean" />
      </section>

      {/* Footer */}
      <footer className="py-12 ...">...</footer>
    </div>
  );
}
```
