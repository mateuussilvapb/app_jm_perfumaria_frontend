import { test, expect } from '@playwright/test';

test.use({ storageState: 'playwright/.auth/user.json' });

const categoria = `nova-categoria-test-${Date.now()}`;

// Get and check if environment variables are set
const username = process.env['APP_USERNAME'] || '';
const password = process.env['APP_PASSWORD'] || '';
const clientID = process.env['CLIENT_ID'] || '';
if (!username || !password || !clientID) {
  throw new Error('APP_USERNAME or APP_PASSWORD environment variable is not set');
}

test('go to create categoria', async ({ page }) => {
  await page.goto('/categoria/adicionar', { waitUntil: 'networkidle' });
  
  expect(page).toBeDefined();
  await expect(page).toHaveURL('/categoria/adicionar');
});

test('back button categoria', async ({ page }) => {
  
  await page.goto('/categoria/adicionar', { waitUntil: 'networkidle' });

  await page.getByRole('button', { name: 'Voltar' }).click();
  await expect(page).toHaveURL('/categoria');
});

test.describe.serial('crud_categoria_flow', () => {
  test('create categoria', async ({ page }) => {
    await page.goto('/categoria/adicionar', { waitUntil: 'networkidle' });
    
    await page.getByRole('textbox', { name: 'Nome' }).fill(categoria);
    await page.getByRole('textbox', { name: 'Descrição' }).fill(categoria);
    await page.getByRole('button', { name: 'Adicionar' }).click();

    await expect(page.getByRole('alert')).toContainText('Categoria criada com sucesso! Você será redirecionado.');
    await expect(page).toHaveURL('/categoria');

    const row = await page.getByRole('row', { name: categoria });
    await expect(row).toBeVisible();
  });

  test('create error categoria', async ({ page }) => {
    await page.goto('/categoria/adicionar', { waitUntil: 'networkidle' });
    
    await page.getByRole('textbox', { name: 'Nome' }).fill(categoria);
    await page.getByRole('textbox', { name: 'Descrição' }).fill(categoria);
    await page.getByRole('button', { name: 'Adicionar' }).click();

    await expect(page.getByRole('alert')).toContainText('Categoria com o nome: nova categoria teste já está cadastrada e ativa.');
    await expect(page).toHaveURL('/categoria');
  });

  test('categoria delete', async ({ page }) => {
    await page.goto('/categoria', { waitUntil: 'networkidle' });

    // find the row by cell name
    const row = await page.getByRole('row', { name: categoria });
    await expect(row).toBeVisible();

    // Click on the button in the row
    await row.getByRole('button').click();

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

  let categoriaId: string;
  let token: string;

  test.beforeAll(async ({ request }) => {
    // get validation token
    const tokenResponse = await request.post('http://localhost:8081/token', {
      data: {
        username: username,
        password: password,
        clientID: clientID,
        grantType: 'password',
      },
    });
    const tokenJson = await tokenResponse.json();
    token = tokenJson.access_token;

    // create a categoria via API
    const res = await request.post('http://localhost:8081/categorias/command', {
      data: {
        nome: categoria,
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
      .locator('tbody tr', { hasText: categoria });
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
  })
});
