# Log: Marketing_Font_System_Fix_And_Design_System_Docs

**Date:** 2025-12-26 08:05:54
**Key Goal:** 마케팅 페이지 전반의 폰트 일관성(Poppins+Pretendard) 확보, 렌더링 충돌(FOUT) 해결, 그리고 재사용 가능한 디자인 시스템 가이드 구축

## 📝 상세 작업 일지 (Chronological)

### 1. 폰트 시스템 통합 및 AOS 애니메이션 튜닝

> **상황:**
>
> - 페이지마다 폰트가 제각각이거나 Next.js 기본 폰트(Geist)와 충돌 발생.
> - 스크롤 애니메이션(AOS)이 너무 빠르거나 모바일에서 작동하지 않음.
>
> **해결:**
>
> - `app/layout.tsx`: 기본 `Geist` 폰트 및 클래스 제거, `html lang="ko"` 설정으로 FOUT 방지.
> - `hooks/use-aos.ts`: 애니메이션 지속 시간(`duration`) 1000ms로 증가, `offset` 100px 설정, 모바일 활성화.
> - `app/globals.css`: Poppins(영문)와 Pretendard(한글) CSS 변수 정의 및 전역 적용.

### 2. Tailwind CSS Cascade 순서 수정 (Critical Fix)

> **상황:**
>
> - CSS에서 `font-family`를 선언했음에도 불구하고 브라우저 새로고침 시 폰트가 풀리거나 Tailwind 기본 스타일로 덮어씌워지는 문제 발생.
>
> **해결:**
>
> - `app/globals.css`: 구조를 완전히 재설계.
>   - `@import "tailwindcss"`를 파일 최상단으로 이동 (가장 중요).
>   - 사용자 정의 폰트 설정을 `@layer base` 내부로 이동하여 Tailwind 레이어 시스템 내에서 우선순위 확보.
>   - 모든 폰트 선언에 `!important`를 추가하여 외부 스타일 간섭 차단.
> - **결과:** Fan1, Fan4, Bizon 등 모든 페이지에서 `Poppins` + `Pretendard` 조합이 안정적으로 유지됨을 브라우저 에이전트로 검증.

### 3. 디자인 시스템 가이드 문서화

> **상황:**
>
> - 현재 확정된 디자인 스택(폰트, 컬러, 레이아웃)을 다른 프로젝트에서도 그대로 "복사-붙여넣기"하여 쓸 수 있도록 문서화 요청.
>
> **해결:**
>
> - `.agent/workflows/design-system.md` (최초생성 및 수정):
>   - **기술 스택 명시:** Next.js 16.1.0, React 19.2.3, Tailwind v4 등 정확한 버전 기록.
>   - **타이포그래피:** PC/모바일 반응형 폰트 크기 비교 테이블(px 단위 환산) 작성.
>   - **UI 패턴:** 버튼, 카드, 폼 요소의 구체적 Tailwind 클래스 조합(padding, rounded 등) 명시.
>   - **명칭 변경:** 단순 가이드가 아닌 재사용 가능한 '시스템'임을 강조하여 파일명 변경.
