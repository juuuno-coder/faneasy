import { test, expect } from "@playwright/test";

test("protected admin redirect / login", async ({ page }) => {
  await page.goto("/admin/influencer");
  await expect(page).toHaveURL(/.*\/login/);
});

test("admin page visible when authenticated via localStorage", async ({
  page,
}) => {
  await page.goto("/");
  await page.evaluate(() => {
    localStorage.setItem(
      "faneasy-auth",
      JSON.stringify({
        user: {
          id: "u1",
          name: "테스트",
          email: "test@example.com",
          role: "influencer",
          subdomain: "test",
        },
        token: "fake",
        isAuthenticated: true,
      })
    );
  });

  await page.goto("/admin/influencer");
  await expect(page.locator("text=대시보드 개요")).toBeVisible();
  await expect(page.locator("text=팬 수")).toBeVisible();
});
