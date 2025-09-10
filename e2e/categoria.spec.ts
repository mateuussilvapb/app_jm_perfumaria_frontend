import { test, expect } from '@playwright/test';

test.use({ storageState: 'storageState.json' });

test('go to categoria', async ({ page }) => {
  await page.goto('/categoria');

  expect(page).toBeDefined();
});

test('categoria options', async ({ page }) => {
  await page.goto('/categoria');

  // find the row by cell text (e.g. category name)
  const row = page.locator('p-table').locator('tbody tr', { hasText: 'nova categoria correta' });
  await expect(row).toBeVisible();

  // Click on the button in the row
  await row.locator('button.p-button, button.p-menu-button, .actions button').click();

  // Verify if show options
  const visualizar = page.getByText("Visualizar");
  const editar = page.getByText("Editar");
  const desabilitar = page.getByText("Desabilitar");
  const excluir = page.getByText("Excluir");

  await expect(visualizar).toBeVisible();
  await expect(editar).toBeVisible();
  await expect(desabilitar).toBeVisible();
  await expect(excluir).toBeVisible();
});

test('categoria desabilitar', async ({ page }) => {
  await page.goto('/categoria');
  // wait until the data is loaded
  await page.waitForFunction(() => {
    const table = document.querySelector('p-table');
    const rows = table?.querySelectorAll('tbody tr');
    return rows?.length > 0;
  });
  

  // find the row by cell text (e.g. category name)
  const row = page.locator('p-table').locator('tbody tr', { hasText: 'nova categoria correta' });
  await expect(row).toBeVisible();

  // Click on the button in the row
  await row.locator('button.p-button, button.p-menu-button, .actions button').click();

  // Get the delete option and click
  const desabilitar = page.getByText("Desabilitar");
  await desabilitar.click();

  // Expect a modal to be visible
  const modal = page.getByText('Tem certeza que deseja DESABILITAR a categoria nova categoria correta?');
  await expect(modal).toBeVisible();
  
  // Click on confirm button
  const confirmButton = page.getByRole('button', { name: 'Sim' });
  await confirmButton.click();

  // Expect a modal to be visible
  const toast = page.getByText('Status da Categoria alterado com sucesso!');
  await expect(toast).toBeVisible();
});

test('categoria habilitar', async ({ page }) => {
  await page.goto('/categoria');
  // wait until the data is loaded
  await page.waitForFunction(() => {
    const table = document.querySelector('p-table');
    const rows = table?.querySelectorAll('tbody tr');
    return rows?.length > 0;
  });

  const lastBtn = page.locator('.p-paginator .p-paginator-last');
  await lastBtn.click();

  // find the row by cell text (e.g. category name)
  const row = page.locator('p-table').locator('tbody tr', { hasText: 'nova categoria correta' });
  await expect(row).toBeVisible();

  // Click on the button in the row
  await row.locator('button.p-button, button.p-menu-button, .actions button').click();

  // Get the delete option and click
  const desabilitar = page.getByText("Habilitar");
  await desabilitar.click();

  // Expect a modal to be visible
  const modal = page.getByText('Tem certeza que deseja HABILITAR a categoria nova categoria correta?');
  await expect(modal).toBeVisible();
  
  // Click on confirm button
  const confirmButton = page.getByRole('button', { name: 'Sim' });
  await confirmButton.click();

  // Expect a modal to be visible
  const toast = page.getByText('Status da Categoria alterado com sucesso!');
  await expect(toast).toBeVisible();
});

