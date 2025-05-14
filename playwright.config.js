import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './playwright/tests',
  use: {
    baseURL: 'http://localhost:3000', // cambia esto según tu entorno
    trace: 'on-first-retry',
  },
  reporter: [['html', { outputFolder: 'tmp/playwright-report' }], ['list']],
  outputDir: 'tmp/screenshots/', // << Ruta donde Playwright guardará automáticamente los screenshots

});
