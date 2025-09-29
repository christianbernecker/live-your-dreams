import { expect, test } from '@playwright/test';

/**
 * Visual Regression Tests for Admin Pages
 * 
 * These tests take screenshots of admin pages and compare them against
 * stored baseline images to detect visual changes.
 */

test.describe('Admin Pages Visual Tests', () => {
  
  // Mock login for all tests
  test.beforeEach(async ({ page }) => {
    // Navigate to login and perform mock authentication
    await page.goto('/');
    
    // Fill in demo credentials
    await page.fill('input[name="email"]', 'admin@liveyourdreams.online');
    await page.fill('input[name="password"]', 'admin123');
    
    // Click login button
    await page.click('button[type="submit"]');
    
    // Wait for dashboard to load
    await page.waitForURL(/\/dashboard/);
    
    // Wait for any potential redirects and page stabilization
    await page.waitForTimeout(2000);
  });

  test('Admin Overview Page', async ({ page }) => {
    // Navigate to admin overview
    await page.goto('/admin');
    
    // Wait for content to load
    await page.waitForSelector('[data-testid="admin-overview"], .admin-stats, h1');
    await page.waitForTimeout(1000);
    
    // Hide dynamic elements that change (dates, counts that might vary)
    await page.addStyleTag({
      content: `
        [data-dynamic="true"], 
        .timestamp, 
        .last-updated,
        time {
          visibility: hidden !important;
        }
      `
    });
    
    // Take screenshot
    await expect(page).toHaveScreenshot('admin-overview.png', {
      fullPage: true,
      threshold: 0.2,
    });
  });

  test('Admin Users Page - Table Design', async ({ page }) => {
    // Navigate to users admin page
    await page.goto('/admin/users');
    
    // Wait for table to load
    await page.waitForSelector('.api-table, table');
    await page.waitForTimeout(1500);
    
    // Ensure all images are loaded (avatars)
    await page.waitForFunction(() => {
      const images = document.querySelectorAll('img');
      return Array.from(images).every(img => img.complete);
    });
    
    // Take screenshot focusing on the table area
    const tableContainer = page.locator('.api-table, table').first();
    await expect(tableContainer).toHaveScreenshot('admin-users-table.png', {
      threshold: 0.2,
    });
  });

  test('Admin Users Page - Full Layout', async ({ page }) => {
    // Navigate to users admin page
    await page.goto('/admin/users');
    
    // Wait for all elements to load
    await page.waitForSelector('.api-table, table');
    await page.waitForSelector('.luxury-badge, .badge');
    await page.waitForSelector('.lyd-button.icon-only, .table-actions button');
    await page.waitForTimeout(1500);
    
    // Hide dynamic timestamps and counts
    await page.addStyleTag({
      content: `
        .timestamp, 
        .last-login,
        [data-dynamic="true"] {
          visibility: hidden !important;
        }
      `
    });
    
    // Full page screenshot
    await expect(page).toHaveScreenshot('admin-users-full.png', {
      fullPage: true,
      threshold: 0.2,
    });
  });

  test('Admin Users Page - Badge Consistency', async ({ page }) => {
    // Navigate to users admin page
    await page.goto('/admin/users');
    
    // Wait for table and badges to load
    await page.waitForSelector('.luxury-badge, .badge');
    await page.waitForTimeout(1000);
    
    // Take screenshot of just the badges area for detailed comparison
    const badgeContainer = page.locator('table tbody tr').first();
    await expect(badgeContainer).toHaveScreenshot('admin-users-badges.png', {
      threshold: 0.1, // Strict comparison for badges
    });
  });

  test('Admin Users Page - Action Buttons', async ({ page }) => {
    // Navigate to users admin page
    await page.goto('/admin/users');
    
    // Wait for action buttons to load
    await page.waitForSelector('.table-actions button, .lyd-button.icon-only');
    await page.waitForTimeout(1000);
    
    // Take screenshot of action buttons
    const actionsContainer = page.locator('.table-actions, td:last-child').first();
    await expect(actionsContainer).toHaveScreenshot('admin-users-actions.png', {
      threshold: 0.1, // Strict comparison for buttons
    });
  });

  test('Admin Roles Page', async ({ page }) => {
    // Navigate to roles admin page
    await page.goto('/admin/roles');
    
    // Wait for content to load
    await page.waitForSelector('table, .api-table');
    await page.waitForTimeout(1500);
    
    // Full page screenshot
    await expect(page).toHaveScreenshot('admin-roles-full.png', {
      fullPage: true,
      threshold: 0.2,
    });
  });

  test('Admin Navigation Tabs', async ({ page }) => {
    // Navigate to admin area
    await page.goto('/admin');
    
    // Wait for navigation tabs to load
    await page.waitForSelector('nav, .lyd-tabs, [role="tablist"]');
    await page.waitForTimeout(1000);
    
    // Take screenshot of navigation area
    const navigation = page.locator('nav, .lyd-tabs').first();
    await expect(navigation).toHaveScreenshot('admin-navigation.png', {
      threshold: 0.1,
    });
  });

  test('Design System Components - Cross-Page Consistency', async ({ page }) => {
    // Test that Design System components look consistent across pages
    const pages = ['/admin', '/admin/users', '/admin/roles'];
    
    for (let i = 0; i < pages.length; i++) {
      await page.goto(pages[i]);
      await page.waitForTimeout(1500);
      
      // Screenshot of buttons on this page
      const buttons = page.locator('.lyd-button').first();
      if (await buttons.count() > 0) {
        await expect(buttons).toHaveScreenshot(`buttons-consistency-${i}.png`, {
          threshold: 0.1,
        });
      }
    }
  });
});

