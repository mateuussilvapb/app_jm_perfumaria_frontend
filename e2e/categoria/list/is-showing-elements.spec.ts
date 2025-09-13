import { test, expect } from '@playwright/test';

test('Test-visibility', async ({ page }) => {
  await page.goto('/categoria', { waitUntil: 'networkidle' });

  await expect(page.locator('app-topbar a')).toBeVisible();
  await expect(page.getByRole('button', { name: '' })).toBeVisible();
  await expect(
    page.locator('app-topbar-menu-options').getByRole('button').first()
  ).toBeVisible();
  await expect(
    page.locator('app-topbar-menu-options').getByRole('button').first()
  ).toBeVisible();
  await expect(
    page.locator('app-topbar-menu-options').getByRole('button').nth(2)
  ).toBeVisible();
  await expect(page.getByText('Categorias', { exact: true })).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Buscar por...' })
  ).toBeVisible();
  await expect(page.locator('div').filter({ hasText: /^Nome$/ })).toBeVisible();
  await expect(page.getByText('StatusAtivoInativo')).toBeVisible();
  await expect(page.getByText('LimparBuscar')).toBeVisible();
  await expect(
    page
      .locator('app-categoria-list div')
      .filter({ hasText: 'Cadastrar Categoria' })
      .nth(3)
  ).toBeVisible();
  await expect(
    page
      .locator('app-categoria-table div')
      .filter({ hasText: 'NomeDescriçãoStatusOpçõ' })
      .nth(1)
  ).toBeVisible();
  await expect(page.locator('app-footer')).toBeVisible();
});
