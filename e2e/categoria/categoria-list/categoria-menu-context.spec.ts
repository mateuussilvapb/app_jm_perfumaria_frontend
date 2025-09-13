import { test, expect } from '@playwright/test';
import { randomUUID } from 'crypto';

let categoriaId: string;
let token: string;
let serialCategoria = `nova-categoria-test-${Date.now()}-${randomUUID().slice(0,8)}`;

// Get and check if environment variables are set
const username = process.env['APP_USERNAME'] || '';
const password = process.env['APP_PASSWORD'] || '';
const clientID = process.env['CLIENT_ID'] || '';
if (!username || !password || !clientID) {
  throw new Error('APP_USERNAME or APP_PASSWORD environment variable is not set');
}

test.describe.serial('categoria flow', () => {
  test.beforeAll(async ({ request }) => {
    console.log('>>> beforeAll', new Date().toISOString(), 'pid', process.pid);

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
        nome: serialCategoria,
        descricao:
          'nova categoria teste.',
        status: 'ATIVO',
      },
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const categoriaJson = await res.json();
    console.log(categoriaJson);
    categoriaId = categoriaJson.idString;
    console.log(`Categoria criada com ID: ${categoriaId}`);
  });

  test('categoria desabilitar', async ({ page }) => {
    await page.goto('/categoria', { waitUntil: 'networkidle' });
    // wait until the data is loaded
    await page.waitForFunction(() => {
      const table = document.querySelector('p-table');
      const rows = table?.querySelectorAll('tbody tr');
      return rows?.length > 0;
    });
    

    // find the row by cell text (e.g. category name)
    const row = page.locator('p-table').locator('tbody tr', { hasText: serialCategoria });
    await expect(row).toBeVisible();

    // Click on the button in the row
    await row.locator('button.p-button, button.p-menu-button, .actions button').click();

    // Get the delete option and click
    const desabilitar = page.getByText("Desabilitar");
    await desabilitar.click();

    // Expect a modal to be visible
    const modal = page.getByText(`Tem certeza que deseja DESABILITAR a categoria ${serialCategoria}?`);
    await expect(modal).toBeVisible();
    
    // Click on confirm button
    const confirmButton = page.getByRole('button', { name: 'Sim' });
    await confirmButton.click();

    // Expect a modal to be visible
    const toast = page.getByText('Status da Categoria alterado com sucesso!');
    await expect(toast).toBeVisible();
  });

  test('categoria habilitar', async ({ page }) => {
    await page.goto('/categoria', { waitUntil: 'networkidle' });

    // Click on last page if necessary
    const lastBtn = page.locator('.p-paginator .p-paginator-last');
    if (await lastBtn.isEnabled()) {
      await lastBtn.click();
    } else {
      console.log('Button is disabled, skipping click');
    }

    // find the row by cell text (e.g. category name)
    const row = page.locator('p-table').locator('tbody tr', { hasText: serialCategoria });
    await expect(row).toBeVisible();

    // Click on the button in the row
    await row.locator('button.p-button, button.p-menu-button, .actions button').click();

    // Get the delete option and click
    const desabilitar = page.getByText("Habilitar");
    await desabilitar.click();

    // Expect a modal to be visible
    const modal = page.getByText(`Tem certeza que deseja HABILITAR a categoria ${serialCategoria}?`);
    await expect(modal).toBeVisible();
    
    // Click on confirm button
    const confirmButton = page.getByRole('button', { name: 'Sim' });
    await confirmButton.click();

    // Expect a modal to be visible
    const toast = page.getByText('Status da Categoria alterado com sucesso!');
    await expect(toast).toBeVisible();
  });

  test.afterAll(async ({ request }) => {
    console.log('>>> afterAll', new Date().toISOString(), 'pid', process.pid);

    const res = await request.delete(
      `http://localhost:8081/categorias/command/${categoriaId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(res.status());
    expect(res.ok()).toBeTruthy();
  });
});
