import { expect, test } from '@playwright/test';

test('should navigate to the photos page', async ({ page }) => {
  await page.goto('/');
  await page.click('.menu a[href="/photos"]');
  await expect(page).toHaveURL('/photos?q=&page=1&limit=10');
  await expect(page.locator('h3')).toContainText('Photo');
});

test('should navigate to the animations page', async ({ page }) => {
  await page.goto('/');
  await page.click('.menu a[href="/animations"]');
  await expect(page).toHaveURL('/animations');
  await expect(page.locator('h3')).toContainText('Animation');
});
