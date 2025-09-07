import { test, expect } from '@playwright/test';
import { readFileSync } from 'fs';

type Manifest = { baseUrl: string; root: string; routes: string[]; };
const manifest: Manifest = JSON.parse(
  readFileSync('tests/ds/__manifests__/components.json', 'utf-8')
);

test.describe('Design System v2 Components — Visual', () => {
  for (const route of manifest.routes) {
    test(`Visual baseline ${route}`, async ({ page }) => {
      const target = route.startsWith('http') ? route : (process.env.DS_BASE_URL ?? manifest.baseUrl) + route;

      await page.goto(target, { waitUntil: 'networkidle' });

      // Optional: toggle dark theme if site uses a switch (uncomment as needed)
      // const themeToggle = page.locator('[data-testid="theme-toggle"]');
      // if (await themeToggle.isVisible()) await themeToggle.click();

      // Kill animations/transitions → stable rendering
      await page.addStyleTag({ content: `
        *, *::before, *::after { transition: none !important; animation: none !important; caret-color: transparent !important; }
        html { scroll-behavior: auto !important; }
      `});

      // Mask dynamic regions: timestamps, iframes, live previews, ads, random avatars, etc.
      const masks = [
        page.locator('time, iframe, video, [aria-busy="true"], [data-dynamic], .skeleton, .blink'),
        page.locator('code .line:hover') // code hovers
      ];

      // Snap full page OR main content if huge pages cause flakiness
      await expect(page).toHaveScreenshot(`${route.replace(/\//g,'_')}.png`, {
        fullPage: true,
        maxDiffPixelRatio: 0.01,
        animations: 'disabled',
        scale: 'device',
        mask: masks
      });
    });
  }
});
