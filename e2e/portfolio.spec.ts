import { expect, test, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const PUBLIC_ROUTES = [
  '/',
  '/scouting-report',
  '/film-room',
  '/blog',
  '/projects',
  '/demos',
  '/player-comps',
  '/impact-report',
] as const;

function capturePageErrors(page: Page): string[] {
  const errors: string[] = [];

  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });

  return errors;
}

test('every public route loads directly without overflow or browser errors', async ({ page }) => {
  const errors = capturePageErrors(page);

  for (const route of PUBLIC_ROUTES) {
    await page.goto(route, { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('main')).toBeVisible();
    await expect(page.locator('h1')).toBeVisible();

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );
    expect(hasHorizontalOverflow, `${route} should not horizontally overflow`).toBe(false);
  }

  expect(errors).toEqual([]);
});

test('Mac Control targets expose stable identities and route-specific postconditions', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'One semantic contract pass is sufficient.');

  await page.goto('/');
  const app = page.locator('[data-mac-control-id="portfolio.app"]');
  await expect(app).toHaveAttribute('data-task-state', 'home_ready');

  await page.locator('[data-mac-control-id="portfolio.home.film-room"]').click();
  await expect(app).toHaveAttribute('data-task-state', 'film_room_ready');
  await expect(page.locator('[data-mac-control-id="portfolio.film-room.surface"]')).toHaveAttribute(
    'data-task-state',
    'film_room_ready',
  );

  await page.goto('/');
  await page.locator('[data-mac-control-id="portfolio.projects.roster"]').click();
  await expect(app).toHaveAttribute('data-task-state', 'project_roster_ready');
  await expect(
    page.locator('[data-mac-control-id="portfolio.projects.active-roster"]'),
  ).toBeVisible();

  await page.goto('/');
  await page.locator('[data-mac-control-id="portfolio.scouting-report"]').click();
  await expect(app).toHaveAttribute('data-task-state', 'scouting_report_ready');

  await page.goto('/');
  await page.locator('[data-mac-control-id="portfolio.impact-report"]').click();
  await expect(app).toHaveAttribute('data-task-state', 'impact_report_ready');

  await page.goto('/');
  const resume = page.locator('[data-mac-control-id="portfolio.home.resume"]');
  await expect(resume).toHaveAttribute('download', 'Jakye_Amos_Canonical_Base_Resume.pdf');
  const downloadPromise = page.waitForEvent('download');
  await resume.click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('Jakye_Amos_Canonical_Base_Resume.pdf');
  await expect(page.locator('[data-mac-control-id="portfolio.home"]')).toHaveAttribute(
    'data-task-state',
    'resume_download_requested',
  );
  await expect(page.getByRole('status')).toContainText('Resume download requested');
});

test('the menu is usable at tablet and mobile widths', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'desktop', 'Desktop navigation is already visible.');

  await page.goto('/');
  const menuButton = page.locator('header button[aria-controls]');
  await expect(menuButton).toHaveAttribute('aria-label', 'Open navigation');
  await menuButton.click();
  await expect(menuButton).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('navigation', { name: 'Mobile primary' })).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(menuButton).toHaveAttribute('aria-expanded', 'false');
  await expect(menuButton).toBeFocused();

  await menuButton.click();
  await page.getByRole('link', { name: 'Film Room', exact: true }).click();
  await expect(page).toHaveURL(/\/film-room$/);
  await expect(page.getByRole('main')).toBeVisible();
});

test('Film Room case-study tabs are keyboard-operable', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'One keyboard interaction pass is sufficient.');

  await page.goto('/film-room');
  const firstTab = page.getByRole('tab').first();
  await firstTab.focus();
  await page.keyboard.press('ArrowRight');

  const tabs = page.getByRole('tab');
  await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
  await expect(tabs.nth(1)).toBeFocused();
  await expect(page.getByRole('tabpanel')).toBeVisible();
});

test('project reports retain keyboard focus and the optional court is operable', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'One keyboard interaction pass is sufficient.');

  await page.goto('/projects');
  const trigger = page.getByRole('button', { name: /Open report/i }).first();
  await trigger.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  const clipFrame = page.getByRole('dialog').locator('iframe[data-clip-id]');
  await expect(clipFrame).toHaveCount(1);
  const clipConfiguration = await clipFrame.evaluate((frame) => ({
    clipId: frame.getAttribute('data-clip-id'),
    start: Number(frame.getAttribute('data-clip-start')),
    end: Number(frame.getAttribute('data-clip-end')),
    src: frame.getAttribute('src') ?? '',
  }));
  expect(clipConfiguration.clipId).toMatch(/^[a-z0-9-]+$/);
  expect(Number.isInteger(clipConfiguration.start)).toBe(true);
  expect(Number.isInteger(clipConfiguration.end)).toBe(true);
  expect(clipConfiguration.end).toBeGreaterThan(clipConfiguration.start);
  expect(clipConfiguration.src).toContain('autoplay=1');
  expect(clipConfiguration.src).toContain('mute=1');
  expect(clipConfiguration.src).toContain(`start=${clipConfiguration.start}`);
  expect(clipConfiguration.src).toContain(`end=${clipConfiguration.end}`);
  await expect(page.getByRole('button', { name: 'Unmute clip' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toBeHidden();
  await expect(trigger).toBeFocused();

  await page.getByText('Open the optional court view', { exact: true }).click();
  await expect(page.locator('[data-shot-clip-project]')).toHaveCount(19);
  const firstAxis = page.getByRole('tab', { name: 'Impact' });
  await firstAxis.focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tab', { name: 'Difficulty' })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  await expect(page.getByRole('tabpanel')).toBeVisible();
});

test('demos use selected local recordings with accessible timeline controls', async ({ page }) => {
  await page.goto('/demos');
  await expect(page.locator('[data-demo-empty="true"]')).toBeVisible();
  await expect(page.locator('video[data-demo-video]')).toHaveCount(0);

  const projectMarker = page.locator('[data-demo-project="bballedu"]');
  await expect(projectMarker).toBeVisible();
  await projectMarker.click();

  const video = page.locator('video[data-demo-video="bbdse-courtiq"]');
  await expect(video).toBeVisible();
  await expect(video).toHaveAttribute('data-demo-autoplay', 'selected');
  await expect(video).toHaveAttribute('src', /\/media\/demos\/bbdse-courtiq\.webm$/);
  await expect(video.locator('track[kind="captions"]')).toHaveCount(1);
  expect(await video.evaluate((element) => (element as HTMLVideoElement).muted)).toBe(true);
  await page.getByRole('button', { name: 'Pause BBDSE CourtIQ' }).click();

  const scrubber = page.getByRole('slider', { name: 'Seek BBDSE CourtIQ' });
  await scrubber.focus();
  await page.keyboard.press('ArrowRight');
  expect(Number(await scrubber.inputValue())).toBeGreaterThan(0);
  await page.getByRole('button', { name: /Draft room/ }).click();
  await expect(scrubber).toHaveValue('7');
  await scrubber.focus();
  await page.keyboard.press('Home');
  await expect(scrubber).toHaveValue('0');
  await page.getByRole('button', { name: 'Unmute' }).click();
  await expect(page.getByRole('button', { name: 'Sound on' })).toBeVisible();
});

test('key recruiter pages meet automated accessibility checks', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'Run the full axe pass once per browser.');

  for (const route of ['/', '/film-room', '/projects', '/demos'] as const) {
    await page.goto(route);
    await expect(page.getByRole('main')).toBeVisible();
    await expect(page.locator('h1')).toBeVisible();
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations, `${route} accessibility violations`).toEqual([]);
  }
});

test('reduced motion disables nonessential movement and autoplay', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'One preference-mode pass is sufficient.');

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');

  const workLink = page.getByRole('link', { name: 'View selected work' });
  await workLink.hover();
  const motionStyles = await workLink.evaluate((element) => {
    const style = getComputedStyle(element);
    return { transform: style.transform, transitionDuration: style.transitionDuration };
  });
  expect(motionStyles.transitionDuration).toBe('0s');
  expect(motionStyles.transform).toBe('none');
  await expect(page.locator('video[autoplay]')).toHaveCount(0);
  await expect(page.locator('marquee')).toHaveCount(0);

  await page.goto('/demos');
  await page.locator('[data-demo-project="bballedu"]').click();
  const selectedMarker = page.locator('[data-demo-project="bballedu"]');
  await expect(selectedMarker).toHaveClass(/demos-marker-selected/);
  expect(
    await selectedMarker.evaluate((element) => getComputedStyle(element).animationDuration),
  ).toBe('0s');
});
