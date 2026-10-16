import { test, expect } from '@playwright/test';
import { TypingTestPage } from '../pages/TypingTestPage.js';

/**
 * Smoke tests — the app loads and its core UI is present.
 * These run fast and catch broken deploys before the deeper suites.
 */
test.describe('Smoke — app shell', () => {
  test('loads with the correct title and brand', async ({ page }) => {
    const app = new TypingTestPage(page);
    await app.goto();

    await expect(page).toHaveTitle(/Fishytype/i);
    await expect(app.brand).toBeVisible();
  });

  test('renders a word list and the hidden input', async ({ page }) => {
    const app = new TypingTestPage(page);
    await app.goto();

    await expect(app.words).toBeVisible();
    expect((await app.wordsInOrder()).length).toBeGreaterThan(5);
    await expect(app.input).toBeAttached();
  });

  test('shows the timer and the live stats bar', async ({ page }) => {
    const app = new TypingTestPage(page);
    await app.goto();

    await expect(app.timeLeft).toBeVisible();
    await expect(app.statWpm).toBeVisible();
    await expect(app.statAcc).toBeVisible();
    await expect(app.statBest).toBeVisible();
  });
});
