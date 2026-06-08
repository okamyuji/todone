import { test, expect } from '@playwright/test';

test.describe('Task CRUD', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('adds a new task', async ({ page }) => {
    await page.click('[aria-label="タスクを追加"]');
    await page.fill('#task-title', 'テスト追加タスク');
    await page.click('button:has-text("保存")');
    await expect(page.locator('text=テスト追加タスク')).toBeVisible();
  });

  test('edits an existing task', async ({ page }) => {
    await page.click('[aria-label="タスクを追加"]');
    await page.fill('#task-title', '編集対象');
    await page.click('button:has-text("保存")');

    await page.click('[aria-label="編集対象を編集"]');
    await page.fill('#task-title', '編集済みタスク');
    await page.click('button:has-text("保存")');

    await expect(page.locator('text=編集済みタスク')).toBeVisible();
    await expect(page.locator('text=編集対象')).not.toBeVisible();
  });

  test('completes a task via checkbox', async ({ page }) => {
    await page.click('[aria-label="タスクを追加"]');
    await page.fill('#task-title', '完了テスト');
    await page.click('button:has-text("保存")');

    const checkbox = page.locator(
      'input[type="checkbox"][aria-label="完了テストを完了にする"]',
    );
    await checkbox.click({ force: true });
    // After clicking, aria-label changes to "未完了にする" since the task is now completed
    const checkedCheckbox = page.locator(
      'input[type="checkbox"][aria-label="完了テストを未完了にする"]',
    );
    await expect(checkedCheckbox).toBeChecked();
  });

  test('deletes a task', async ({ page }) => {
    await page.click('[aria-label="タスクを追加"]');
    await page.fill('#task-title', '削除対象');
    await page.click('button:has-text("保存")');

    await page.click('[aria-label="削除対象を編集"]');
    // First click on 削除 reveals the confirmation
    await page.locator('dialog button:has-text("削除")').click();
    await expect(page.locator('text=このタスクを削除しますか？')).toBeVisible();
    // Click the confirmation 削除 button (the one inside the confirmation area)
    await page.locator('dialog button:has-text("削除")').last().click();

    await expect(page.locator('text=削除対象')).not.toBeVisible();
  });

  test('validates empty task title', async ({ page }) => {
    await page.click('[aria-label="タスクを追加"]');
    await page.click('button:has-text("保存")');
    await expect(page.locator('text=タスク名を入力してください')).toBeVisible();
  });
});
