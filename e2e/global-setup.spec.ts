// import { chromium, FullConfig } from '@playwright/test';

// async function globalSetup(config: FullConfig) {
//   const browser = await chromium.launch();
//   const context = await browser.newContext();
//   const page = await context.newPage();

//   // replace with your real login URL and selectors
//   await page.goto('');

//   // Fill the login form
//   await page.getByLabel('username').fill('miqueias');
//   // Full the password form with miqueias123
//   await page.fill('input[name="password"]', 'miqueias123');

//   await Promise.all([
//     page.waitForNavigation({ waitUntil: 'networkidle' }),
//     await page.click('button:has-text("Sign in")'),
//   ]);

//   // Save to disk (available via page.context())
//   await page.context().storageState({ path: 'storageState.json' });

//   await context.close();
//   await browser.close();
// }

// export default globalSetup;
