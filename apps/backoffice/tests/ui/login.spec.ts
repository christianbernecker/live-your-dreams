import { expect, test } from "@playwright/test";

test.describe("Backoffice UI — DS Foundations", () => {
  test("login uses DS foundations without regressions", async ({ page }) => {
    await page.goto("http://localhost:3000/login");
    
    // Wait for fonts to load
    await page.waitForLoadState('networkidle');
    
    // Take full page screenshot for visual regression
    await expect(page).toHaveScreenshot('login-ds-foundations.png', { 
      fullPage: true, 
      maxDiffPixelRatio: 0.01 
    });
  });

  test("login form elements use DS tokens", async ({ page }) => {
    await page.goto("http://localhost:3000/login");
    
    // Check that design tokens are applied
    const emailInput = page.locator('input[name="email"]');
    const submitButton = page.locator('button[type="submit"]');
    
    // Verify CSS custom properties are used
    await expect(emailInput).toHaveCSS('border-color', 'rgb(229, 231, 235)'); // --lyd-color-surface-line
    await expect(submitButton).toHaveCSS('border-radius', '8px'); // --lyd-radius-md
  });
});
