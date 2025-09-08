import { test, expect } from '@playwright/test';

test('go to categoria', async ({ page }) => {
  await page.goto('http://localhost:4200/categoria');

  await expect(page).toBeDefined();
});

test('go to create categoria', async ({ page }) => {
  await page.goto('http://localhost:4200/categoria/adicionar');

  await expect(page).toBeDefined();
});

test('create categoria', async ({ page }) => {
  await page.goto('http://localhost:4200/categoria/adicionar');

  await page.fill('input[id="nome-categoria", type="text"]', 'nova categoria');
  await page.fill('textarea[id="descricao-categoria"]', 'descricao nova categoria');
  await page.click('button:has-text("Adicionar")');

  await expect(page).toHaveURL('http://localhost:4200/categoria');
});