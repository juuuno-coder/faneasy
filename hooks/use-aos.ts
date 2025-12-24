'use client';

import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

/**
 * 마케팅 페이지 전용 AOS 스크롤 애니메이션 훅
 * 사용법: 마케팅 컴포넌트에서 useAOS() 호출
 */
export function useAOS() {
  useEffect(() => {
    AOS.init({
      duration: 800,              // 애니메이션 지속 시간 (ms)
      easing: 'ease-out-cubic',   // 이징 함수
      once: true,                 // 한 번만 애니메이션 실행
      offset: 50,                 // 뷰포트에서 트리거 오프셋 (px)
      delay: 0,                   // 기본 딜레이
      anchorPlacement: 'top-bottom',
    });

    // 컴포넌트 언마운트 시 정리
    return () => {
      AOS.refresh();
    };
  }, []);
}

/**
 * AOS 애니메이션 타입 (data-aos 속성에 사용)
 * 
 * 페이드 애니메이션:
 * - fade-up: 아래에서 위로 페이드인
 * - fade-down: 위에서 아래로 페이드인
 * - fade-left: 오른쪽에서 왼쪽으로 페이드인
 * - fade-right: 왼쪽에서 오른쪽으로 페이드인
 * - fade-up-right: 왼쪽 아래에서 오른쪽 위로
 * - fade-up-left: 오른쪽 아래에서 왼쪽 위로
 * 
 * 줌 애니메이션:
 * - zoom-in: 작은 상태에서 확대
 * - zoom-in-up: 확대하며 위로
 * - zoom-out: 큰 상태에서 축소
 * 
 * 슬라이드 애니메이션:
 * - slide-up: 아래에서 슬라이드
 * - slide-down: 위에서 슬라이드
 * - slide-left: 오른쪽에서 슬라이드
 * - slide-right: 왼쪽에서 슬라이드
 * 
 * 플립 애니메이션:
 * - flip-up, flip-down, flip-left, flip-right
 * 
 * 추가 옵션:
 * - data-aos-delay="100": 딜레이 (ms)
 * - data-aos-duration="1000": 지속 시간 (ms)
 * - data-aos-easing="ease-in-out": 이징
 * - data-aos-offset="200": 오프셋 (px)
 */
