import { test, expect } from '@playwright/test';

test.describe('Daily Screen', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('navigates to previous day', async ({ page }) => {
    const dateText = await page.locator('h1').textContent();
    await page.click('[aria-label="前日"]');
    const newDateText = await page.locator('h1').textContent();
    expect(newDateText).not.toBe(dateText);
  });

  test('navigates to next day', async ({ page }) => {
    const dateText = await page.locator('h1').textContent();
    await page.click('[aria-label="翌日"]');
    const newDateText = await page.locator('h1').textContent();
    expect(newDateText).not.toBe(dateText);
  });

  test('displays empty state when no tasks', async ({ page }) => {
    await expect(page.locator('text=タスクがありません')).toBeVisible();
  });

  test('filters tasks by category', async ({ page }) => {
    await page.click('[aria-label="タスクを追加"]');
    await page.fill('#task-title', '仕事タスク');
    await page.selectOption('#task-category', 'work');
    await page.click('button:has-text("保存")');

    await page.click('[aria-label="タスクを追加"]');
    await page.fill('#task-title', '勉強タスク');
    await page.selectOption('#task-category', 'study');
    await page.click('button:has-text("保存")');

    await page.click('button:has-text("仕事")');
    await expect(page.locator('text=仕事タスク')).toBeVisible();
    await expect(page.locator('text=勉強タスク')).not.toBeVisible();
  });
});
