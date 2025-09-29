# Testing Strategy - Design System & UI Components

**Live Your Dreams Backoffice - Comprehensive Testing Framework**

## 🎯 Übersicht

Diese Testing Strategy definiert das umfassende Test-Framework für Design System Components und UI-Konsistenz im Live Your Dreams Backoffice. Fokus auf Visual Regression Tests, Component Testing und Design System Compliance.

## 🏗️ Testing Architecture

### 1. Visual Regression Tests (Playwright)
```
apps/backoffice/tests/visual/
├── admin-pages.spec.ts          # Admin UI consistency
├── dashboard-pages.spec.ts      # Dashboard UI consistency  
├── auth-flow.spec.ts           # Login/Auth flow
└── component-library.spec.ts    # Individual components
```

### 2. Component Tests (Storybook)
```
packages/ui/stories/
├── Button.stories.tsx           # Button variants & states
├── Table.stories.tsx           # Table components & data
├── Badge.stories.tsx           # Badge variants & colors
└── Card.stories.tsx            # Card layouts & content
```

### 3. Integration Tests
```
apps/backoffice/tests/integration/
├── design-system.spec.ts       # DS CSS loading & variables
├── navigation.spec.ts          # Consistent navigation
└── crud-operations.spec.ts     # Full user workflows
```

## 📸 Visual Regression Testing

### Setup & Configuration

**Playwright Config:** `apps/backoffice/playwright.config.ts`
```typescript
export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'https://backoffice-cu5bahc8t-christianberneckers-projects.vercel.app',
    viewport: { width: 1280, height: 720 },
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'visual',
      testDir: './tests/visual',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
```

### Test Patterns

#### 1. Page-Level Visual Tests
```typescript
test('Admin Users Page - Full Layout', async ({ page }) => {
  // Navigate & wait for content
  await page.goto('/admin/users');
  await page.waitForSelector('.api-table');
  await page.waitForTimeout(1500);
  
  // Hide dynamic content
  await page.addStyleTag({
    content: `.timestamp, .last-login { visibility: hidden !important; }`
  });
  
  // Screenshot with high precision
  await expect(page).toHaveScreenshot('admin-users-full.png', {
    fullPage: true,
    threshold: 0.2, // 20% difference tolerance
  });
});
```

#### 2. Component-Level Visual Tests
```typescript
test('Admin Users Table - Design System Compliance', async ({ page }) => {
  await page.goto('/admin/users');
  await page.waitForSelector('.api-table');
  
  // Focus on table component only
  const tableContainer = page.locator('.api-table').first();
  await expect(tableContainer).toHaveScreenshot('admin-table.png', {
    threshold: 0.1, // Strict comparison for components
  });
});
```

#### 3. Badge Consistency Tests
```typescript
test('Status Badges - Color & Typography Consistency', async ({ page }) => {
  await page.goto('/admin/users');
  await page.waitForSelector('.luxury-badge');
  
  // Test specific badge instance
  const badge = page.locator('.luxury-badge').first();
  await expect(badge).toHaveScreenshot('status-badge.png', {
    threshold: 0.05, // Very strict for design system elements
  });
});
```

### Visual Test Commands

```bash
# Run all visual tests
npm run test:visual

# Update baselines (after intentional changes)
npm run test:visual:update

# Run specific test suite
npm run test:visual -- --grep "Admin"

# Debug mode with headed browser
npm run test:visual -- --headed --debug
```

## 📚 Component Testing (Storybook)

### Storybook Setup

**Location:** `packages/ui/.storybook/`

**Configuration:** 
- Design System CSS automatically loaded
- All component variants documented
- Interactive testing environment
- Accessibility testing integrated

### Story Patterns

#### 1. Comprehensive Component Stories
```typescript
// Button.stories.tsx
export default {
  title: 'Design System/Button',
  component: Button,
  parameters: { layout: 'centered' },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'outline'],
    },
  },
} satisfies Meta<typeof Button>;

// All variant showcase
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px' }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="outline">Outline</Button>
    </div>
  ),
};
```

#### 2. Interactive Testing
```typescript
// Table.stories.tsx with data variations
export const WithSorting: Story = {
  render: () => {
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);
    
    return (
      <Table className="api-table">
        <TableHeader>
          <TableHeaderCell 
            sortable 
            sortDirection={sortDirection}
            onSort={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
          >
            Name
          </TableHeaderCell>
        </TableHeader>
      </Table>
    );
  },
};
```

### Storybook Commands

```bash
# Start Storybook development server
cd packages/ui
npm run storybook

# Build static Storybook
npm run build-storybook

# Test all stories
npm run test-storybook
```

## 🔍 Integration Testing

### Design System Integration Tests

```typescript
// tests/integration/design-system.spec.ts
describe('Design System Integration', () => {
  test('CSS Variables Available', async ({ page }) => {
    await page.goto('/admin/users');
    
    // Test CSS variable availability
    const primaryColor = await page.evaluate(() => {
      return getComputedStyle(document.documentElement)
        .getPropertyValue('--lyd-primary').trim();
    });
    
    expect(primaryColor).toBe('#000066');
  });
  
  test('Master CSS Classes Available', async ({ page }) => {
    await page.goto('/admin/users');
    
    // Test Design System classes
    const apiTable = await page.locator('.api-table').count();
    const luxuryBadge = await page.locator('.luxury-badge').count();
    const lydButton = await page.locator('.lyd-button').count();
    
    expect(apiTable).toBeGreaterThan(0);
    expect(luxuryBadge).toBeGreaterThan(0);
    expect(lydButton).toBeGreaterThan(0);
  });
});
```

### Cross-Page Consistency Tests

```typescript
test('Navigation Consistency Across Pages', async ({ page }) => {
  const pages = ['/dashboard', '/admin/users', '/admin/roles'];
  
  for (const pagePath of pages) {
    await page.goto(pagePath);
    
    // Verify consistent navigation structure
    const sidebar = page.locator('.sidebar-navigation');
    const logo = page.locator('.lyd-logo');
    const userMenu = page.locator('.user-menu');
    
    await expect(sidebar).toBeVisible();
    await expect(logo).toBeVisible();
    await expect(userMenu).toBeVisible();
    
    // Screenshot navigation for consistency
    await expect(sidebar).toHaveScreenshot(`nav-${pagePath.replace(/\//g, '-')}.png`);
  }
});
```

## 🎨 Design System Compliance Tests

### CSS Class Usage Verification

```typescript
test('Design System Classes Usage', async ({ page }) => {
  await page.goto('/admin/users');
  
  // Verify correct table classes
  const incorrectTableClasses = await page.locator('.lyd-table').count();
  const correctTableClasses = await page.locator('.api-table').count();
  
  expect(incorrectTableClasses).toBe(0); // Should not exist
  expect(correctTableClasses).toBeGreaterThan(0); // Should exist
  
  // Verify badge classes
  const incorrectBadgeClasses = await page.locator('.table-badge').count();
  const correctBadgeClasses = await page.locator('.luxury-badge').count();
  
  expect(incorrectBadgeClasses).toBe(0);
  expect(correctBadgeClasses).toBeGreaterThan(0);
});
```

### Button Compliance Tests

```typescript
test('Button Design System Compliance', async ({ page }) => {
  await page.goto('/admin/users');
  
  // All buttons should have lyd-button class
  const allButtons = await page.locator('button').count();
  const dsButtons = await page.locator('button.lyd-button').count();
  const nativeButtons = await page.locator('button:not(.lyd-button)').count();
  
  console.log(`Total buttons: ${allButtons}, DS compliant: ${dsButtons}, Non-compliant: ${nativeButtons}`);
  
  // Warn about non-compliant buttons (don't fail, just warn)
  if (nativeButtons > 0) {
    console.warn(`Found ${nativeButtons} buttons without Design System classes`);
  }
});
```

## 🔄 Test Automation & CI/CD

### GitHub Actions Integration

```yaml
# .github/workflows/visual-tests.yml
name: Visual Regression Tests

on: [push, pull_request]

jobs:
  visual-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      
      - name: Install dependencies
        run: npm install
      
      - name: Run Playwright tests
        run: npm run test:visual
      
      - name: Upload test results
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
```

### Deployment Verification

```bash
# Post-deployment test script
#!/bin/bash
echo "🧪 Running post-deployment verification..."

# Wait for deployment to be ready
sleep 30

# Run critical visual tests
npm run test:visual -- --grep "Admin Users Page"
npm run test:visual -- --grep "Dashboard Main"

# Check Design System loading
curl -s https://backoffice.../master.css | grep -q "lyd-button" || exit 1

echo "✅ Deployment verification complete"
```

## 📊 Test Reporting & Metrics

### Visual Regression Reports

**Playwright HTML Reporter:**
- Automatic screenshot comparisons
- Diff visualization for failures
- Test execution timeline
- Browser compatibility results

**Accessible at:** `playwright-report/index.html`

### Component Coverage Metrics

**Storybook Coverage:**
- Component variant coverage
- Interactive state testing
- Accessibility compliance score
- Documentation completeness

### Design System Compliance Score

```typescript
// Calculate DS compliance score
const calculateComplianceScore = async (page: Page) => {
  const totalElements = await page.locator('button, table, .badge').count();
  const compliantElements = await page.locator('.lyd-button, .api-table, .luxury-badge').count();
  
  return Math.round((compliantElements / totalElements) * 100);
};
```

## 🎯 Testing Best Practices

### 1. Visual Test Guidelines

- **Consistent Viewport:** Always use 1280x720 for desktop tests
- **Stable Data:** Use mock data to avoid flaky tests
- **Hide Dynamic Content:** Timestamps, user-specific data
- **Appropriate Thresholds:** 0.05 for components, 0.2 for pages
- **Meaningful Names:** Descriptive screenshot filenames

### 2. Component Test Guidelines

- **All Variants:** Test every prop combination
- **Interactive States:** Hover, focus, disabled, loading
- **Accessibility:** Screen reader compliance
- **Responsive:** Mobile and desktop viewports
- **Data Variations:** Empty states, long content, special characters

### 3. Integration Test Guidelines

- **Critical Paths:** Login → Dashboard → CRUD operations
- **Cross-Browser:** Chrome, Firefox, Safari
- **Performance:** Page load times, bundle sizes
- **Error Scenarios:** Network failures, invalid data

## 🚀 Quick Start Guide

### Setup Testing Environment

```bash
# Install dependencies
cd apps/backoffice
npm install

# Install Playwright browsers
npx playwright install

# Run first visual test
npm run test:visual -- --grep "Admin Users"
```

### Development Workflow

```bash
# 1. Make UI changes
# 2. Update visual baselines if needed
npm run test:visual:update

# 3. Run full test suite
npm run test:visual

# 4. Start Storybook for component testing
cd packages/ui && npm run storybook

# 5. Deploy and verify
npm run deploy
npm run test:visual:production
```

### Debugging Failed Tests

```bash
# Run tests in headed mode
npm run test:visual -- --headed --debug

# Generate trace files
npm run test:visual -- --trace on

# View test results
npx playwright show-report
```

## 📚 Resources & References

- **Playwright Documentation:** https://playwright.dev/
- **Storybook Guide:** https://storybook.js.org/docs
- **Visual Testing Best Practices:** [Internal Wiki]
- **Design System Reference:** `packages/design-system/dist/master.css`
- **Live Component Library:** `packages/ui/stories/`

## 🔄 Maintenance & Updates

### Monthly Tasks
- [ ] Update Playwright to latest version
- [ ] Review and update visual baselines
- [ ] Audit test coverage and add missing tests
- [ ] Performance regression analysis

### After Major Updates
- [ ] Regenerate all visual baselines
- [ ] Update component stories
- [ ] Verify Design System integration
- [ ] Run full regression test suite

---

**Version:** 1.0  
**Letzte Aktualisierung:** 2024-09-26  
**Status:** Active Testing Framework für Enterprise Design System

