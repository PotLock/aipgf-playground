import { expect, test } from '@playwright/test';

test('should renders register form', async ({ page }) => {
  await page.goto('/');
  await page.locator('.authentication').getByTestId('btn-signup').click();
  await expect(page).toHaveURL('/register');
  await expect(page.getByTestId('frm-register')).toBeVisible();
});
