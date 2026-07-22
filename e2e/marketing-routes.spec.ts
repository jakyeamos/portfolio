import { test, expect } from '@playwright/test';

test('Soundscape project route is crawlable and hydrated', async ({ page }) => {
  await page.goto('/projects/soundscape');

  await expect(page).toHaveTitle('Soundscape | Jakye Amos Portfolio');
  await expect(page.locator('h1')).toHaveText('Soundscape');
  await expect(
    page.getByText('Active beta hardening across the shared web and mobile product surfaces.'),
  ).toBeVisible();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://jakyeamos.com/projects/soundscape',
  );
  expect(await page.locator('#portfolio-project-jsonld').textContent()).toContain(
    '"@type":"CreativeWork"',
  );
  await expect(page.getByRole('link', { name: 'Source repository' })).toHaveAttribute(
    'href',
    'https://github.com/jakyeamos/soundscape-app',
  );
});

test('sitemap and robots preserve only the intended public routes', async ({ request }) => {
  const sitemap = await request.get('/sitemap.xml');
  expect(sitemap.ok()).toBeTruthy();
  expect(await sitemap.text()).toContain('https://jakyeamos.com/projects/bballedu');

  const robots = await request.get('/robots.txt');
  expect(robots.ok()).toBeTruthy();
  const robotsText = await robots.text();
  expect(robotsText).toContain('Disallow: /blog/write');
  expect(robotsText).toContain('Sitemap: https://jakyeamos.com/sitemap.xml');
});
