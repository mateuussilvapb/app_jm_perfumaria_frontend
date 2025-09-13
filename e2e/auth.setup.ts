import { test as setup, expect } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, '../playwright/.auth/user.json');

setup('Autenticação', async ({ page }) => {
  await page.goto('');

  // Get and check if environment variables are set
  const username = process.env['APP_USERNAME'] || '';
  const password = process.env['APP_PASSWORD'] || '';
  if (!username || !password) {
    throw new Error('APP_USERNAME or APP_PASSWORD environment variable is not set');
  }
  
  // Fill the login form and click
  await page.getByRole('textbox', { name: 'Username or email' }).fill(username);
  await page.getByRole('textbox', { name: 'Password' }).fill(password);
  
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle' }),
    await page.getByRole('button', { name: 'Sign In' }).click()
  ]);

  // Expect to be redirected to the dashboard
  await expect(page).toHaveURL('');
  // Save to disk (available via page.context())
  await page.context().storageState({ path: authFile });
});
