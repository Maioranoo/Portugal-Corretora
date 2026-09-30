import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  retries: 0,
  // Porta própria dos testes: o servidor sobe sempre com o ID de teste do Pixel, nunca reaproveita o de desenvolvimento
  use: { baseURL: 'http://localhost:4399', trace: 'retain-on-failure' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    {
      name: 'mobile',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
        deviceScaleFactor: 3,
      },
    },
  ],
  webServer: {
    command: 'npm run dev -- --port 4399',
    url: 'http://localhost:4399',
    reuseExistingServer: false,
    env: { PUBLIC_META_PIXEL_ID: '1234567890123456' },
  },
});
