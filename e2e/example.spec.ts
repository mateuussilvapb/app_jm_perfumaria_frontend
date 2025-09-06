import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('http://localhost:4200');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Sign in to JMPERFUMARIA/);
});

test('login form', async ({ page }) => {
  await page.goto('http://localhost:4200');

  // Fill the login form
  await page.getByLabel('username').fill('miqueias');
  await page.getByTestId('password').fill('miqueias123');
  await page.getByRole('button', { name: 'login' }).click();

  // Expect to be redirected to the dashboard
  await expect(page).toHaveURL('http://localhost:4200/');
});