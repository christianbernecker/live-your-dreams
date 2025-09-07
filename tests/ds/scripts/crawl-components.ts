import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const BASE_URL = process.env.DS_BASE_URL ?? 'http://designsystem.liveyourdreams.online';
const ROOT = '/v2/components';
const OUT_DIR = 'tests/ds/__manifests__';
const OUT_FILE = join(OUT_DIR, 'components.json');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }});
  const url = BASE_URL + ROOT;

  await page.goto(url, { waitUntil: 'networkidle' });

  // Extract internal links under /v2/components (no anchors, no external)
  const links = await page.$$eval('a[href]', as => as
    .map(a => (a as HTMLAnchorElement).getAttribute('href') || '')
    .filter(href =>
      href.startsWith('/v2/components') &&
      !href.includes('#') &&
      !href.includes('mailto:') &&
      !href.includes('http')
    )
  );

  // Normalize + unique
  const unique = Array.from(new Set(links)).sort();

  // Optional allow/deny if needed:
  const allow = unique.filter(href => /^\/v2\/components\//.test(href));
  const manifest = { baseUrl: BASE_URL, root: ROOT, routes: allow };

  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(OUT_FILE, JSON.stringify(manifest, null, 2), 'utf-8');

  console.log(`Found ${allow.length} routes. Wrote ${OUT_FILE}`);
  await browser.close();
})().catch(err => {
  console.error(err);
  process.exit(1);
});
