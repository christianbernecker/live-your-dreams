# PATCH: Inject DS Foundations from `master.css` (non‑breaking, stacked PR)

**Status:** ready  
**Owner:** Amanda / LYD Core  
**Scope:** `apps/backoffice` · `packages/design-tokens` · `packages/design-system` (base/utilities)  
**Goal:** Extract the **foundations** from `master.css` (tokens/base/utilities) and integrate them into the Backoffice via **CSS Cascade Layers**, **without refactoring components**. Keep Cursor’s ongoing tasks unblocked by shipping this as a **small, isolated PR**.

---

## 1) Why this patch?

- We want a **clean, enforced base** (tokens + base + utilities) before more UI lands.  
- `@layer` **cascade layers** give us explicit, predictable priority: `tokens < base < components < utilities < app`.  
- `next/font` enables **self‑hosted fonts** with **no layout shift** and fewer network requests.

**References**:  
- MDN on **cascade layers** and `@layer`: see notes at the bottom.  
- MDN on **`:has()` performance** caveats.  
- Next.js **`next/font`** docs (App Router).  
- Playwright **visual snapshots** & **axe** accessibility testing.

---

## 2) Branching & PR strategy (stacked, low risk)

- Create a new branch off the current working branch:  
  ```bash
  git checkout -b chore/ds-foundations-split
  ```

- This PR should **only** include:
  1. New **tokens/base/utilities** styles (extracted from `master.css`).
  2. Import order via **@layer** in the app.
  3. **next/font** migration for fonts.
  4. Minimal **tests** (visual+a11y) for `/login` to lock the baseline.

- Open as **Draft PR**; once green, merge first. Rebase Cursor’s feature branch afterwards.

---

## 3) Files to add / change

### 3.1 Design Tokens (extracted from `master.css`)

Create `packages/design-tokens/css/index.css`:

```css
/* packages/design-tokens/css/index.css */
@layer tokens {
  :root {
    /* TODO: Replace placeholders with values from CI guideline / master.css */
    --lyd-color-brand-primary: /* e.g. #000066 */;
    --lyd-color-brand-secondary: /* e.g. #3366CC */;

    --lyd-color-text-default: #111111;
    --lyd-color-text-muted: #666666;

    --lyd-color-surface-bg: #FFFFFF;
    --lyd-color-surface-line: #E5E7EB;
    --lyd-color-accent: #E8F0FE;

    --lyd-radius-sm: 4px;
    --lyd-radius-md: 8px;
    --lyd-radius-lg: 12px;

    --lyd-space-xs: 4px;
    --lyd-space-sm: 8px;
    --lyd-space-md: 16px;
    --lyd-space-lg: 24px;
    --lyd-space-xl: 32px;
  }

  /* Optional dark theme hook */
  [data-theme="dark"] {
    --lyd-color-surface-bg: #0B0B0D;
    --lyd-color-text-default: #FFFFFF;
    --lyd-color-text-muted: #8B90A0;
    /* add/adjust remaining dark tokens */
  }
}
```

> **Notes**: Only **tokens** (CSS custom properties) belong here. No layout rules, no resets, no showcases.

---

### 3.2 Base (reset + basic typography)

Create `packages/design-system/base.css`:

```css
/* packages/design-system/base.css */
@layer base {
  /* Reset */
  *, *::before, *::after { box-sizing: border-box; }
  html, body { height: 100%; }
  body {
    margin: 0;
    background: var(--lyd-color-surface-bg);
    color: var(--lyd-color-text-default);
    font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
    font-size: 16px;
    line-height: 1.6;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Basic headings */
  h1, h2, h3 { font-weight: 700; line-height: 1.2; }
  h1 { font-size: clamp(24px, 3vw, 28px); }
  h2 { font-size: clamp(20px, 2.5vw, 24px); }
  h3 { font-size: clamp(18px, 2vw, 20px); }

  /* Links */
  a { color: var(--lyd-color-brand-secondary); text-decoration: none; }
  a:hover { text-decoration: underline; }
}
```

> **Keep it minimal**: No doc‑layout, no sidebar, no demo “card” styles here.

---

### 3.3 Utilities (neutral, no hacks)

Create `packages/design-system/utilities.css`:

```css
/* packages/design-system/utilities.css */
@layer utilities {
  .text-center { text-align: center; }

  .d-flex { display: flex; }
  .items-center { align-items: center; }
  .justify-between { justify-content: space-between; }

  .mt-xs { margin-top: var(--lyd-space-xs); }
  .mt-sm { margin-top: var(--lyd-space-sm); }
  .mt-md { margin-top: var(--lyd-space-md); }
  .mt-lg { margin-top: var(--lyd-space-lg); }

  .mb-xs { margin-bottom: var(--lyd-space-xs); }
  .mb-sm { margin-bottom: var(--lyd-space-sm); }
  .mb-md { margin-bottom: var(--lyd-space-md); }
  .mb-lg { margin-bottom: var(--lyd-space-lg); }

  .p-sm { padding: var(--lyd-space-sm); }
  .p-md { padding: var(--lyd-space-md); }
  .p-lg { padding: var(--lyd-space-lg); }
}
```

> **Exclude**: Anything doc‑specific (showcases, demo grids) and all global `!important` / forced `position` / `z-index` rules.

---

### 3.4 App imports with **Cascade Layers**

Edit `apps/backoffice/app/globals.css`:

```css
/* apps/backoffice/app/globals.css */
@layer tokens, base, components, utilities, app;

@import "@liveyourdreams/design-tokens/css/index.css" layer(tokens);
@import "@liveyourdreams/design-system/base.css" layer(base);
/* @liveyourdreams/ui component CSS will load under layer(components) */
@import "@liveyourdreams/design-system/utilities.css" layer(utilities);

@layer app {
  /* app-only layout helpers (use tokens!) */
  .lyd-shell { min-height: 100dvh; display: grid; grid-template-columns: 280px 1fr; }
  .lyd-main { padding: clamp(16px, 3vw, 32px); }
}
```

> With layers, there’s no need for `!important` and we keep the cascade predictable. See references below.

---

### 3.5 Fonts via **`next/font`** (no CLS, self‑hosted)

Edit `apps/backoffice/app/layout.tsx` (App Router):

```tsx
// apps/backoffice/app/layout.tsx
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
```

> Remove any `@import` webfont references from CSS. `next/font` optimizes & self‑hosts fonts and avoids layout shift.

---

### 3.6 Drop global overlay hacks (`:has`, z-index “nuclear”)

Do **not** copy doc‑specific global rules from `master.css` that:
- use `body:has(...)` or other broad, dynamic selectors,  
- enforce `position: absolute !important` on dropdowns/overlays,  
- apply global “nuclear” z-indexes.

Use **React Portals** for modals/menus/tooltips and keep a **local z-index scale** as tokens (e.g., `--z-dropdown`, `--z-modal`, `--z-toast`).

---

## 4) Tests & CI (minimal, for safety)

### 4.1 Visual snapshot for `/login`

Create `apps/backoffice/tests/ui/login.spec.ts`:

```ts
import { test, expect } from "@playwright/test";

test.describe("Backoffice UI — foundations", () => {
  test("login uses foundations without regressions", async ({ page }) => {
    await page.goto("http://localhost:3000/login");
    await expect(page).toHaveScreenshot({ fullPage: true, maxDiffPixelRatio: 0.01 });
  });
});
```

### 4.2 Accessibility check for `/login`

Create `apps/backoffice/tests/a11y/login.a11y.spec.ts`:

```ts
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("login has no critical a11y violations", async ({ page }) => {
  await page.goto("http://localhost:3000/login");
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
```

> On the first run, Playwright generates reference screenshots. Subsequent runs compare diffs. Update baselines **consciously** if the only changes are font/rendering differences caused by `next/font`.

---

## 5) Acceptance criteria

- [ ] App imports **tokens/base/utilities** via `@layer` (no doc/showcase CSS).  
- [ ] No `@import` webfonts in CSS; fonts via **`next/font`**.  
- [ ] No global `:has(body …)`/z-index hacks introduced.  
- [ ] `/login` **visual snapshot** stable with DS foundations.  
- [ ] `/login` **axe** check: zero critical violations.

---

## 6) Rollout & Rebase

1. Open PR **as draft**: `chore/ds-foundations-split`.  
2. Validate CI: lint/tests/snapshots.  
3. Merge once green.  
4. Rebase the active Cursor branch onto `main` — low risk, imports are additive.

---

## 7) Notes & references

- **Cascade layers (`@layer`)**: MDN guide and at‑rule reference.  
- **CSS performance & `:has()`**: MDN performance notes; use sparingly and avoid broad dynamic selectors like `body:has(...)`.  
- **Next.js fonts**: `next/font` (App Router) for self‑hosting and zero CLS.  
- **Playwright snapshots**: `expect(page).toHaveScreenshot()` flow.  
- **Playwright a11y**: axe‑core integration patterns.

### Links
- MDN — *Cascade layers (Learn)*: https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Cascade_layers  
- MDN — *@layer at‑rule*: https://developer.mozilla.org/en-US/docs/Web/CSS/%40layer  
- MDN — *`:has()` reference / performance*: https://developer.mozilla.org/en-US/docs/Web/CSS/%3Ahas  
- MDN — *CSS performance optimization* (notes on `:has()`): https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Performance/CSS  
- Next.js — *Font Optimization (App)*: https://nextjs.org/docs/app/getting-started/fonts  
- Next.js — *Font API reference*: https://nextjs.org/docs/14/app/api-reference/components/font  
- Playwright — *Visual comparisons*: https://playwright.dev/docs/test-snapshots  
- Playwright — *`toHaveScreenshot` API*: https://playwright.dev/docs/api/class-pageassertions  
- Playwright — *Accessibility testing*: https://playwright.dev/docs/accessibility-testing  
