import { defineConfig, devices } from '@playwright/test';

const BASE_URL = process.env.DS_BASE_URL ?? 'http://designsystem.liveyourdreams.online';

export default defineConfig({
  testDir: 'tests/ds',
  snapshotDir: 'tests/ds/__screenshots__',
  reporter: [['list'], ['html', { open: 'never' }]],
  fullyParallel: false,
  workers: 1,
  timeout: 90_000,
  expect: { timeout: 12_000 },
  // Two projects: Light & Dark. (Add mobile later if needed.)
  projects: [
    {
      name: 'desktop-light',
      use: {
        baseURL: BASE_URL,
        headless: true,
        viewport: { width: 1440, height: 900 },
        colorScheme: 'light',
        deviceScaleFactor: 1,
        locale: 'de-DE',
        timezoneId: 'Europe/Berlin',
        ignoreHTTPSErrors: true,
      }
    },
    {
      name: 'desktop-dark',
      use: {
        baseURL: BASE_URL + '?theme=dark', // if not supported, we still set colorScheme
        headless: true,
        viewport: { width: 1440, height: 900 },
        colorScheme: 'dark',
        deviceScaleFactor: 1,
        locale: 'de-DE',
        timezoneId: 'Europe/Berlin',
        ignoreHTTPSErrors: true,
      }
    }
  ],
});
