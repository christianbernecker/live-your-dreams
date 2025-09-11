// audit.js - Screenshots + Style-Diff für drei Seiten (modal/inputs/buttons)
// Run: node audit.js

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const PAGES = [
  { name: 'modal',   url: 'http://designsystem.liveyourdreams.online/v2/components/modal/' },
  { name: 'inputs',  url: 'http://designsystem.liveyourdreams.online/v2/components/inputs/' },
  { name: 'buttons', url: 'http://designsystem.liveyourdreams.online/v2/components/buttons/' },
];

const SELECTOR_GROUPS = {
  page: 'body',
  heading: '.page-title, h1, .h1',
  subheading: '.section-title, h2, .h2',
  paragraph: '.page-subtitle, .showcase-item p, p',
  button: '.lyd-button, button',
  input: '.lyd-input, input',
  card: '.showcase-item, .property-preview, [class*="card"], .card',
};

const STYLE_KEYS = [
  'font-family','font-size','font-weight','line-height','letter-spacing','text-transform',
  'color','background-color','border-radius','box-shadow',
  'padding-top','padding-right','padding-bottom','padding-left',
  'margin-top','margin-right','margin-bottom','margin-left'
];

(async () => {
  const outDir = path.resolve('out');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });

  const styleSnapshots = {};

  for (const { name, url } of PAGES) {
    const page = await context.newPage();
    page.setDefaultTimeout(30000);
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.screenshot({ path: path.join(outDir, `${name}.png`), fullPage: true });

    const snapshot = await page.evaluate(({ SELECTOR_GROUPS, STYLE_KEYS }) => {
      const pick = (el, keys) => {
        if (!el) return null;
        const cs = getComputedStyle(el);
        const out = {};
        for (const k of keys) out[k] = cs.getPropertyValue(k);
        return out;
      };
      const root = getComputedStyle(document.documentElement);
      const vars = {};
      for (let i = 0; i < root.length; i++) {
        const prop = root.item(i);
        if (prop && prop.startsWith('--')) vars[prop] = root.getPropertyValue(prop).trim();
      }
      const q = (s) => document.querySelector(s);
      const groups = {};
      for (const [name, sel] of Object.entries(SELECTOR_GROUPS)) groups[name] = pick(q(sel), STYLE_KEYS);
      // Fokusindikator
      const probe = document.createElement('button');
      probe.textContent = 'focus-probe';
      document.body.appendChild(probe); probe.focus();
      const fs = getComputedStyle(probe);
      const focus = { outlineColor: fs.outlineColor, outlineStyle: fs.outlineStyle, outlineWidth: fs.outlineWidth };
      probe.remove();
      return { tokens: vars, groups, focus };
    }, { SELECTOR_GROUPS, STYLE_KEYS });

    styleSnapshots[name] = snapshot;
    await page.close();
  }

  const names = PAGES.map(p => p.name);
  const allDiffs = [];
  const equalAcross = (arr) => arr.every(v => v === arr[0]);

  for (const group of Object.keys(SELECTOR_GROUPS)) {
    for (const key of STYLE_KEYS) {
      const vals = names.map(n => styleSnapshots[n].groups[group]?.[key] ?? null);
      if (!equalAcross(vals)) {
        const row = { scope: `${group}.${key}` }; names.forEach((n,i)=>row[n]=vals[i]); allDiffs.push(row);
      }
    }
  }

  for (const k of ['outlineColor','outlineStyle','outlineWidth']) {
    const vals = names.map(n => styleSnapshots[n].focus?.[k] ?? null);
    if (!equalAcross(vals)) { const row = { scope: `focus.${k}` }; names.forEach((n,i)=>row[n]=vals[i]); allDiffs.push(row); }
  }

  const tokenNames = new Set();
  names.forEach(n => Object.keys(styleSnapshots[n].tokens || {}).forEach(t => tokenNames.add(t)));
  for (const t of tokenNames) {
    const vals = names.map(n => styleSnapshots[n].tokens?.[t] ?? null);
    if (!equalAcross(vals)) { const row = { scope: `:root ${t}` }; names.forEach((n,i)=>row[n]=vals[i]); allDiffs.push(row); }
  }

  const md = [];
  md.push(`# Style-Diff Report (modal / inputs / buttons)`);
  md.push(`Erzeugt am: ${new Date().toISOString()}`);
  md.push(``);
  md.push(`## Screenshots`);
  for (const n of names) md.push(`- ${n}: ./out/${n}.png`);
  md.push(``);
  md.push(`## Unterschiede in Styles / Tokens`);
  if (allDiffs.length === 0) {
    md.push(`✅ Keine Abweichungen gefunden (bezogen auf die geprüften Gruppen & Properties).`);
  } else {
    md.push(`Gefundene Abweichungen (${allDiffs.length}):`);
    md.push(``);
    md.push(`| Scope | ${names.join(' | ')} |`);
    md.push(`|---|${names.map(()=> '---').join('|')}|`);
    for (const r of allDiffs) md.push(`| ${r.scope} | ${names.map(n => (r[n] ?? '—').replace(/\|/g,'\\|')).join(' | ')} |`);
  }

  fs.writeFileSync(path.join(outDir, 'style-diff.md'), md.join('\n'), 'utf8');
  console.log(`\n✅ Fertig. Artefakte unter: ${outDir}`);
  console.log(`- Screenshots: ${names.map(n => `${n}.png`).join(', ')}`);
  console.log(`- Report: style-diff.md\n`);

  await browser.close();
})();


