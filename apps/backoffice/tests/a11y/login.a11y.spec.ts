import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("login has no critical a11y violations", async ({ page }) => {
  await page.goto("http://localhost:3000/login");
  
  // Wait for page to be fully loaded
  await page.waitForLoadState('networkidle');
  
  // Run accessibility analysis
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze();
  
  // Expect no accessibility violations
  expect(results.violations).toEqual([]);
});
