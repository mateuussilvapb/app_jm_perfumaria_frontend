import { test, expect } from '@playwright/test';

test.use({ storageState: 'storageState.json' });

test('go to create categoria', async ({ page }) => {
  await page.goto('/categoria/adicionar');
  
  expect(page).toBeDefined();
  await expect(page).toHaveURL('/categoria/adicionar');
});

test('create categoria', async ({ page }) => {
  await page.goto('/categoria/adicionar');

  const ta = await page.$('textarea');

  await page.fill('input', 'nova categoria teste');
  await ta?.fill('descricao nova categoria teste');
  await page.click('button[type="submit"]');

  const toast = page.getByText('Categoria criada com sucesso! Você será redirecionado.');
  await expect(toast).toBeVisible();
  await expect(page).toHaveURL('/categoria');
});

test('create error categoria', async ({ page }) => {
  await page.goto('/categoria/adicionar');

  const ta = await page.$('textarea');

  await page.fill('input', 'nova categoria teste');
  await ta?.fill('descricao nova categoria teste');
  await page.click('button[type="submit"]');

  const toast = page.getByText('Categoria com o nome: nova categoria teste já está cadastrada e ativa.');
  await expect(toast).toBeVisible();
});

test('categoria delete', async ({ page }) => {
  await page.goto('/categoria');
  // wait until the data is loaded
  await page.waitForFunction(() => {
    const table = document.querySelector('p-table');
    const rows = table?.querySelectorAll('tbody tr');
    return rows?.length > 0;
  });
  

  // find the row by cell text (e.g. category name)
  const row = page.locator('p-table').locator('tbody tr', { hasText: 'nova categoria teste' });
  await expect(row).toBeVisible();

  // Click on the button in the row
  await row.locator('button.p-button, button.p-menu-button, .actions button').click();

  // Get the delete option and click
  const excluir = page.getByText("Excluir");
  await excluir.click();

  // Expect a modal to be visible
  const modal = page.getByText('Tem certeza que deseja excluir esta categoria?A ação não poderá ser desfeita.');
  await expect(modal).toBeVisible();
  
  // Click on confirm button
  const confirmButton = page.getByRole('button', { name: 'Sim' });
  await confirmButton.click();

  // Expect a modal to be visible
  const toast = page.getByText('Categoria excluída com sucesso.');
  await expect(toast).toBeVisible();
});