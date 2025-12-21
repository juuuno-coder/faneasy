import { test, expect } from "@playwright/test";

test("mock checkout flow", async ({ page }) => {
  // seed local auth to avoid real Firebase dependency
  await page.goto("/");
  await page.evaluate(() => {
    localStorage.setItem(
      "faneasy-auth",
      JSON.stringify({
        user: {
          id: "u1",
          name: "테스트",
          email: "test@example.com",
          role: "fan",
        },
        token: "fake",
        isAuthenticated: true,
      })
    );
  });

  await page.goto("/checkout");
  await expect(page.locator("text=샘플 결제 (모의)")).toBeVisible();

  // choose pro plan
  await page.click("text=프로 - ₩500,000");

  await page.fill("#buyerName", "테스트 구매자");
  await page.fill("#buyerEmail", "buyer@example.com");

  await page.click("text=모의 결제 진행");

  await expect(page.locator("text=주문 완료")).toBeVisible();
  await expect(page.locator("text=주문 ID")).toBeVisible();
});
