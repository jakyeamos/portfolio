import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const SOUND_KEY = 'front-office:easter-eggs:sound';

test.describe('Front Office after-hours files', () => {
  test('Draft Desk keyboard activation opens a locked, focus-managed game dialog', async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'Run the keyboard pass once.');

    await page.goto('/');
    const trigger = page.locator('[data-easter-egg="build-ship"]').first();
    await trigger.focus();
    await page.keyboard.press('Enter');

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(page.locator('[data-build-ship-game]')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Build Ship' })).toBeFocused();
    await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('hidden');

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
    await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('');
  });

  test('Draft Desk touch activation exposes the mobile controls', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile', 'Run the touch pass at the mobile viewport.');

    await page.goto('/');
    await page.locator('[data-easter-egg="build-ship"]').first().tap();
    await expect(page.locator('[data-build-ship-game]')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Move build ship left' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Fire build ship patch' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Move build ship right' })).toBeVisible();
    await page.getByRole('button', { name: 'Fire build ship patch' }).tap();
    await expect(page.getByRole('button', { name: 'Close after-hours file' })).toBeVisible();
  });

  test('audio stays off until the visitor opts in and the preference is local', async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'Run the audio preference pass once.');

    await page.addInitScript((key) => localStorage.removeItem(key), SOUND_KEY);
    await page.goto('/');
    await page.locator('[data-easter-egg="build-ship"]').first().click();

    const soundToggle = page.getByRole('button', { name: 'Turn sound on' });
    await expect(soundToggle).toHaveAttribute('aria-pressed', 'false');
    await expect
      .poll(() => page.evaluate((key) => localStorage.getItem(key), SOUND_KEY))
      .toBeNull();

    await soundToggle.click();
    await expect(page.getByRole('button', { name: 'Turn sound off' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await expect
      .poll(() => page.evaluate((key) => localStorage.getItem(key), SOUND_KEY))
      .toBe('on');
  });

  test('each active local egg opens and closes without changing canonical page text', async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'Run the active roster pass once.');

    const cases = [
      {
        route: '/',
        trigger: async (): Promise<void> => {
          await page.locator('[data-easter-egg="draft-lottery"]').click();
        },
      },
      {
        route: '/',
        trigger: async (): Promise<void> => {
          await page.locator('[data-easter-egg="box-score-footnotes"]').first().click();
        },
      },
      {
        route: '/player-comps',
        trigger: async (): Promise<void> => {
          await page.locator('[data-easter-egg="player-comp-mixer"]').click();
        },
      },
      {
        route: '/film-room',
        trigger: async (): Promise<void> => {
          await page.locator('[data-easter-egg="directors-cut"]').click();
        },
      },
      {
        route: '/projects',
        trigger: async (): Promise<void> => {
          await page.getByText('Open the optional court view', { exact: true }).click();
          await page.locator('[data-easter-egg="chalkboard-play"]').click();
        },
      },
    ];

    for (const eggCase of cases) {
      await page.goto(eggCase.route);
      await eggCase.trigger();
      const canonicalText = await page.locator('main').innerText();
      await expect(page.getByRole('dialog')).toBeVisible();
      await expect(page.locator('[data-easter-panel]')).toBeVisible();
      await page.getByRole('button', { name: 'Close after-hours file' }).click();
      await expect(page.getByRole('dialog')).toBeHidden();
      expect(await page.locator('main').innerText()).toBe(canonicalText);
    }
  });

  test('Night Shift restores with Escape and with repeat activation', async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'Run the palette pass once.');

    await page.goto('/');
    const shell = page.locator('.site-shell');
    const trigger = page.locator('[data-easter-egg="night-shift"]');

    await trigger.click();
    await expect(shell).toHaveClass(/night-shift/);
    await page.keyboard.press('Escape');
    await expect(shell).not.toHaveClass(/night-shift/);

    await trigger.click();
    await expect(shell).toHaveClass(/night-shift/);
    await trigger.click();
    await expect(shell).not.toHaveClass(/night-shift/);
  });

  test('unknown routes render the Off the Board fallback', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'Run the fallback pass once.');

    await page.goto('/this-route-is-not-on-the-board');
    await expect(
      page.getByRole('heading', { name: 'That play is not in the dossier.' }),
    ).toBeVisible();
    await expect(page.getByRole('link', { name: 'Front page' })).toHaveAttribute('href', '/');
    await expect(page.getByRole('link', { name: 'Film Room' })).toHaveAttribute(
      'href',
      '/film-room',
    );
  });

  test('the open Build Ship overlay passes axe and remains usable in reduced motion', async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'Run the overlay audit once.');

    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await page.locator('[data-easter-egg="build-ship"]').first().click();
    await expect(page.locator('[data-build-ship-game]')).toBeVisible();

    const results = await new AxeBuilder({ page }).include('.after-hours-dialog').analyze();
    expect(results.violations, 'after-hours overlay accessibility violations').toEqual([]);

    const motionStyles = await page.locator('.after-hours-dialog').evaluate((element) => {
      const style = getComputedStyle(element);
      return { animationName: style.animationName, transitionDuration: style.transitionDuration };
    });
    expect(motionStyles.animationName).toBe('none');
    expect(motionStyles.transitionDuration).toBe('0s');
    await expect(
      page.locator('[data-build-ship-game] video, [data-build-ship-game] audio'),
    ).toHaveCount(0);
  });

  test('the full page shell has no horizontal overflow at this viewport', async ({ page }) => {
    await page.goto('/');
    await page.locator('[data-easter-egg="build-ship"]').first().click();
    await expect(page.locator('[data-build-ship-game]')).toBeVisible();

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );
    expect(hasHorizontalOverflow).toBe(false);
  });
});
