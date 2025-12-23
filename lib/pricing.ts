/**
 * 가격 계산 유틸리티
 * 모든 제품에 VAT 10% 자동 계산 적용
 */

export interface PriceBreakdown {
  subtotal: number;      // VAT 별도 금액
  vat: number;           // 부가가치세 (10%)
  total: number;         // 총 결제금액 (VAT 포함)
}

/**
 * VAT 10%를 계산하여 가격 분석 반환
 * @param price VAT 별도 가격
 * @returns 가격 분석 객체 (subtotal, vat, total)
 */
export function calculatePriceWithVAT(price: number): PriceBreakdown {
  const subtotal = price;
  const vat = Math.round(subtotal * 0.1); // VAT 10%
  const total = subtotal + vat;

  return {
    subtotal,
    vat,
    total
  };
}

/**
 * 여러 제품의 총 가격 계산 (VAT 포함)
 * @param prices VAT 별도 가격 배열
 * @returns 총 가격 분석 객체
 */
export function calculateTotalWithVAT(prices: number[]): PriceBreakdown {
  const subtotal = prices.reduce((sum, price) => sum + price, 0);
  return calculatePriceWithVAT(subtotal);
}

/**
 * 가격을 한국 원화 형식으로 포맷
 * @param amount 금액
 * @returns 포맷된 문자열 (예: "330,000원")
 */
export function formatPrice(amount: number): string {
  return `${amount.toLocaleString()}원`;
}

/**
 * 월 구독료 (VAT 포함)
 * 사이트 배포(도메인 연결) 후부터 청구
 */
export const MONTHLY_SUBSCRIPTION_PLANS = {
  free: 0,
  basic: 22000,    // VAT 포함
  pro: 33000,      // VAT 포함
  master: 55000    // VAT 포함
} as const;

/**
 * 초기 세팅비 (VAT 별도)
 */
export const INITIAL_SETUP_PRICES = {
  basic: 300000,   // VAT 별도
  pro: 500000,     // VAT 별도
  master: 700000   // VAT 별도
} as const;
