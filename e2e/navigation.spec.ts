import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('starts on daily tab', async ({ page }) => {
    const dailyTab = page.locator('[aria-current="page"]');
    await expect(dailyTab).toHaveText(/デイリー/);
  });

  test('switches to calendar tab', async ({ page }) => {
    await page.click('button:has-text("カレンダー")');
    await expect(page.locator('text=/\\d+年\\d+月/')).toBeVisible();
  });

  test('switches to settings tab', async ({ page }) => {
    await page.click('button:has-text("設定")');
    await expect(page.locator('h2:has-text("設定")')).toBeVisible();
    await expect(page.locator('text=データ管理')).toBeVisible();
  });

  test('switches back to daily tab', async ({ page }) => {
    await page.click('button:has-text("設定")');
    await page.click('button:has-text("デイリー")');
    await expect(page.locator('[aria-label="前日"]')).toBeVisible();
  });

  test('calendar date selection navigates to daily', async ({ page }) => {
    await page.click('button:has-text("カレンダー")');
    const dayButtons = page.locator('[aria-label*="月"][aria-label*="日"]');
    const firstDay = dayButtons.first();
    await firstDay.click();
    await expect(page.locator('[aria-label="前日"]')).toBeVisible();
  });
});
