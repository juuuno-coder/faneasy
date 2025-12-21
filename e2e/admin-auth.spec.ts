import { test, expect } from "@playwright/test";

const influencerUser = {
  id: "inf-1",
  name: "깡대표",
  email: "kkang@faneasy.kr",
  role: "influencer",
  subdomain: "kkang",
};

// Helper to seed zustand persist store used by app (key: 'faneasy-auth')
async function seedAuth(page: any, user: any) {
  const value = JSON.stringify({
    user,
    token: "test-token",
    isAuthenticated: true,
  });
  await page.addInitScript((data) => {
    localStorage.setItem("faneasy-auth", data);
  }, value);
}

test.describe("Admin auth flow (mocked)", () => {
  test("shows influencer dashboard when auth is seeded", async ({ page }) => {
    await seedAuth(page, influencerUser);
    await page.goto("/admin/influencer");

    await expect(page.locator("h1")).toHaveText(/대시보드/);
    await expect(page.locator("text=환영합니다,")).toHaveText(
      /환영합니다, 깡대표님!/
    );
  });

  test("redirects unauthenticated users to /login", async ({ page }) => {
    await page.goto("/admin/influencer");
    // If unauthenticated the page pushes to login; check URL contains /login
    await expect(page).toHaveURL(/.*\/login/);
  });
});
