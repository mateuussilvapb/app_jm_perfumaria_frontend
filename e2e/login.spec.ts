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
  // Full the password form with miqueias123
  await page.fill('input[name="password"]', 'miqueias123');
  await page.click('button:has-text("Sign in")');

  // Expect to be redirected to the dashboard
  await expect(page).toHaveURL('http://localhost:4200/');
});
