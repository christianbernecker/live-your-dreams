import { test, expect } from '@playwright/test';
import { readFileSync } from 'fs';

type Manifest = { baseUrl: string; root: string; routes: string[]; };
const manifest: Manifest = JSON.parse(
  readFileSync('tests/ds/__manifests__/components.json', 'utf-8')
);

// Properties we care about for docs look & feel
const PROPS = [
  'font-family','font-size','font-weight','line-height','letter-spacing',
  'color','background-color','border-color','border-width','border-radius',
  'padding-top','padding-right','padding-bottom','padding-left',
  'margin-top','margin-right','margin-bottom','margin-left',
  'width','max-width','box-shadow','text-transform','opacity'
];

// Heuristics to pick stable elements on docs pages
const TARGET_SELECTORS = [
  'main h1',
  'main h2',
  'main p',
  'main a',
  'main button',
  'main [role="button"]',
  'main code',
  'main pre',
  '.accessibility-item h4',
  '.accessibility-item li',
  '.section-title'
];

async function snapshotSection(page) {
  const found: Record<string, any> = {};
  for (const sel of TARGET_SELECTORS) {
    const el = page.locator(sel).first();
    if (await el.count()) {
      const style = await el.evaluate((node, props) => {
        const cs = window.getComputedStyle(node as Element);
        const out: Record<string,string> = {};
        (props as string[]).forEach(p => out[p] = cs.getPropertyValue(p));
        return out;
      }, PROPS);
      found[sel] = style;
    }
  }
  return found;
}

test.describe('Design System v2 Components — CSS Snapshot', () => {
  for (const route of manifest.routes) {
    test(`CSS matches baseline ${route}`, async ({ page }) => {
      const target = route.startsWith('http') ? route : (process.env.DS_BASE_URL ?? manifest.baseUrl) + route;
      await page.goto(target, { waitUntil: 'networkidle' });

      // Stabilize
      await page.addStyleTag({ content: `*,*::before,*::after{transition:none!important;animation:none!important}` });

      const styles = await snapshotSection(page);

      // JSON snapshot = readable diffs for the LLM
      expect(JSON.stringify(styles, null, 2)).toMatchSnapshot(`${route.replace(/\//g,'_')}.json`);
    });
  }
});
