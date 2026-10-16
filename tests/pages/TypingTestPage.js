/**
 * Page Object for the Fishytype typing-test application.
 *
 * All selectors and page interactions live here, so a UI change only needs to
 * be fixed in one place. Specs then read like plain user stories.
 */
export class TypingTestPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;

    // Selectors — kept in one place on purpose.
    this.brand = page.locator('.brand');
    this.words = page.locator('.words');
    this.word = page.locator('.word');
    this.currentWord = page.locator('.word.current');
    this.doneWords = page.locator('.word.done');
    this.input = page.locator('input.ghost-input');
    this.timeLeft = page.locator('.hud-time');
    this.restart = page.locator('.restart');

    this.statWpm = page.locator('.stat', { hasText: 'wpm' }).locator('.v');
    this.statAcc = page.locator('.stat', { hasText: 'acc' }).locator('.v');
    this.statBest = page.locator('.stat', { hasText: 'best' }).locator('.v');

    this.durationPill = (seconds) => page.locator('.pill', { hasText: `${seconds}s` });
    this.themePill = page.locator('.pill').first();
    this.themeItem = (name) =>
      page.locator('.theme-item').filter({ hasText: new RegExp(`^${name}$`, 'i') });

    this.resultsModal = page.locator('.modal');
    this.resultsWpm = page.locator('.big .v');
    this.resultsCells = page.locator('.cell');
  }

  async goto() {
    await this.page.goto('/');
    await this.words.waitFor({ state: 'visible' });
    return this;
  }

  /** The list of target words currently rendered, in order. */
  async wordsInOrder() {
    return this.word.allTextContents();
  }

  /** Focus the hidden input so keystrokes are captured. */
  async focusInput() {
    await this.input.focus();
  }

  /** Type a single character through real keyboard events. */
  async typeChar(char) {
    await this.page.keyboard.press(char === ' ' ? 'Space' : char);
  }

  /** Type a whole word then press space, exactly like a real user. */
  async typeWord(word, { space = true } = {}) {
    for (const char of word) {
      await this.typeChar(char);
    }
    if (space) await this.page.keyboard.press('Space');
  }

  /** Type the first N words of the current round, correctly. */
  async typeWordsCorrectly(count) {
    const words = await this.wordsInOrder();
    for (let i = 0; i < count && i < words.length; i++) {
      await this.typeWord(words[i]);
    }
  }

  async selectDuration(seconds) {
    await this.durationPill(seconds).click();
  }

  async restartTest() {
    await this.restart.click();
  }

  async readWpm() {
    return Number((await this.statWpm.textContent()) ?? '0');
  }

  async readAccuracy() {
    return Number(((await this.statAcc.textContent()) ?? '0%').replace('%', ''));
  }

  async readTimeLeft() {
    return Number(await this.timeLeft.textContent());
  }
}
