import { test, expect } from '@playwright/test';

test.use({ storageState: 'storageState.json' });

let categoriaId: string;
let token: string;

test.beforeAll(async ({ request }) => {
  // get validation token
  const tokenResponse = await request.post('http://localhost:8081/token', {
    data: {
      username: 'miqueias',
      password: 'miqueias123',
      clientID: 'app_jm_perfumaria',
      grantType: 'password',
    },
  });
  const tokenJson = await tokenResponse.json();
  token = tokenJson.access_token;

  // create a categoria via API
  const res = await request.post('http://localhost:8081/categorias/command', {
    data: {
      nome: 'nova categoria teste',
      descricao:
        'Fragrâncias suaves e seguras, desenvolvidas especialmente para crianças e bebês.',
      status: 'ATIVO',
    },
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  categoriaId = (await res.json()).id;
});

test('categoria editar', async ({ page }) => {
  await page.goto('/categoria');
  // wait until the data is loaded
  await page.waitForFunction(() => {
    const table = document.querySelector('p-table');
    const rows = table?.querySelectorAll('tbody tr');
    return rows?.length > 0;
  });

  // find the row by cell text (e.g. category name)
  const row = page
    .locator('p-table')
    .locator('tbody tr', { hasText: 'nova categoria teste' });
  await expect(row).toBeVisible();

  // Click on the button in the row
  await row
    .locator('button.p-button, button.p-menu-button, .actions button')
    .click();

  // Get the delete option and click
  const desabilitar = page.getByText('Editar');
  await desabilitar.click();

  await expect(page).toHaveURL(/\/categoria\/\d+\/editar$/);

  const ta = await page.$('textarea');

  await page.fill('input', 'nova categoria teste 2');
  await ta?.fill('descricao nova categoria teste 2');
  await page.click('button[type="submit"]');

  // Expect a toast to be visible
  const toast = page.getByText(
    'Categoria alterada com sucesso! Você será redirecionado.'
  );
  await expect(toast).toBeVisible();
  await expect(page).toHaveURL('/categoria');
});

test('can delete categoria', async ({ request }) => {
  const res = await request.delete(
    `http://localhost:8081/categorias/command/${categoriaId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  expect(res.ok()).toBeTruthy();
});
