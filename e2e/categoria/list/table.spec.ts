import { test, expect } from '@playwright/test';
import { randomUUID } from 'crypto';

// Get and check if environment variables are set
const username = process.env['APP_USERNAME'] || '';
const password = process.env['APP_PASSWORD'] || '';
const clientID = process.env['CLIENT_ID'] || '';
if (!username || !password || !clientID) {
  throw new Error('APP_USERNAME or APP_PASSWORD environment variable is not set');
}

let idCategoria: string;
let token: string;
let categoria = `nova-categoria-test-${Date.now()}-${randomUUID().slice(0,8)}`;

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
      nome: categoria,
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
  idCategoria = categoriaJson.idString;
  console.log(`Categoria criada com ID: ${idCategoria}`);
});

test.describe.serial('categoria table', () => {
  test('go to categoria', async ({ page }) => {
    await page.goto('/categoria');

    expect(page).toBeDefined();
  });

  test('categoria options', async ({ page }) => {
    await page.goto('/categoria', { waitUntil: 'networkidle' });

    // find the row by cell text (e.g. category name)
    const row = await page.getByRole('row', { name: categoria });
    await expect(row).toBeVisible();

    // Click on the button in the row
    await row.getByRole('button').click();

    // Verify if show options
    const visualizar = page.getByRole('menuitem', { name: 'Visualizar' });
    await expect(visualizar).toBeVisible();
    const editar = page.getByRole('menuitem', { name: 'Editar' });
    await expect(editar).toBeVisible();
    const desabilitar = page.getByRole('menuitem', { name: 'Desabilitar' });
    await expect(desabilitar).toBeVisible();
    const excluir = page.getByRole('menuitem', { name: 'Excluir' });
    await expect(excluir).toBeVisible();
  });
});

test.afterAll(async ({ request }) => {
  console.log('>>> afterAll', new Date().toISOString(), 'pid', process.pid);

  const res = await request.delete(
    `http://localhost:8081/categorias/command/${idCategoria}`,
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
