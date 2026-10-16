import { test, expect } from '@playwright/test';
import { TypingTestPage } from '../pages/TypingTestPage.js';

/**
 * Feature tests — duration switching, restart, theming, and the results modal.
 */
test.describe('Features', () => {
  test('switching the duration updates the timer', async ({ page }) => {
    const app = new TypingTestPage(page);
    await app.goto();

    await app.selectDuration(15);
    await expect(app.timeLeft).toHaveText('15');

    await app.selectDuration(120);
    await expect(app.timeLeft).toHaveText('120');
  });

  test('restart clears progress and resets the stats', async ({ page }) => {
    const app = new TypingTestPage(page);
    await app.goto();
    await app.focusInput();
    await app.typeWordsCorrectly(4);

    await expect(app.doneWords.first()).toBeVisible();

    await app.restartTest();

    await expect(app.doneWords).toHaveCount(0);
    expect(await app.readWpm()).toBe(0);
  });

  test('a theme can be selected from the picker', async ({ page }) => {
    const app = new TypingTestPage(page);
    await app.goto();

    const before = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);

    await app.themePill.click();
    await app.themeItem('dracula').click();

    // The theme change animates (0.35s), so poll instead of reading instantly.
    await expect
      .poll(
        async () => page.evaluate(() => getComputedStyle(document.body).backgroundColor),
        { message: 'background should change after picking a theme' },
      )
      .not.toBe(before);
  });

  test('a finished round shows the results modal with real numbers', async ({ page }) => {
    const app = new TypingTestPage(page);
    await app.goto();
    await app.selectDuration(15);
    await app.focusInput();
    await app.typeWordsCorrectly(12);

    // Wait for the short round to finish.
    await expect(app.resultsModal).toBeVisible({ timeout: 25_000 });

    const wpm = Number(await app.resultsWpm.textContent());
    expect(wpm).toBeGreaterThan(0);

    const cells = await app.resultsCells.allTextContents();
    expect(cells.join(' ')).toMatch(/accuracy/i);
  });
});
