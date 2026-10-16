import { test, expect } from '@playwright/test';
import { TypingTestPage } from '../pages/TypingTestPage.js';

/**
 * Core typing behaviour — the heart of the app.
 * These verify the metrics that used to be broken (WPM/accuracy always 0/1%).
 */
test.describe('Typing engine', () => {
  test.beforeEach(async ({ page }) => {
    const app = new TypingTestPage(page);
    await app.goto();
    await app.focusInput();
    page.app = app;
  });

  test('typing correctly advances through words and keeps them on screen', async ({ page }) => {
    const app = page.app;
    const first = (await app.wordsInOrder())[0];

    await app.typeWord(first);

    // The first word is now "done" and still rendered (monkeytype-style).
    await expect(app.doneWords).toHaveCount(1);
    expect((await app.doneWords.first().textContent()).trim()).toBe(first);
  });

  test('correct typing produces a WPM above zero', async ({ page }) => {
    const app = page.app;
    await app.typeWordsCorrectly(8);

    await expect
      .poll(async () => app.readWpm(), { message: 'WPM should rise above 0' })
      .toBeGreaterThan(0);
  });

  test('correct typing keeps accuracy at or near 100%', async ({ page }) => {
    const app = page.app;
    await app.typeWordsCorrectly(5);

    expect(await app.readAccuracy()).toBeGreaterThanOrEqual(95);
  });

  test('a wrong character is marked and lowers accuracy', async ({ page }) => {
    const app = page.app;
    const word = (await app.wordsInOrder())[0];

    // Type a deliberately wrong first character.
    const wrong = word[0] === 'z' ? 'x' : 'z';
    await app.typeChar(wrong);

    await expect(page.locator('.char.bad')).toHaveCount(1);
    expect(await app.readAccuracy()).toBeLessThan(100);
  });

  test('backspace removes the last typed character', async ({ page }) => {
    const app = page.app;
    const word = (await app.wordsInOrder())[0];

    await app.typeChar(word[0]);
    await page.keyboard.press('Backspace');

    await expect(page.locator('.char.bad')).toHaveCount(0);
    // Caret returns to the first position of the current word.
    const caretIndex = await page.evaluate(() => {
      const chars = [...document.querySelectorAll('.word.current .char')];
      return chars.findIndex((c) => c.classList.contains('caret'));
    });
    expect(caretIndex).toBe(0);
  });

  test('timer counts down once typing starts', async ({ page }) => {
    const app = page.app;
    const before = await app.readTimeLeft();
    await app.typeWordsCorrectly(3);

    await expect
      .poll(async () => app.readTimeLeft(), { message: 'timer should tick down' })
      .toBeLessThan(before);
  });
});
