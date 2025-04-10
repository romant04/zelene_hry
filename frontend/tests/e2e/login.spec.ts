import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';

test.describe('Login Tests', () => {
	test('User can login with valid credentials', async ({ page }) => {
		const loginPage = new LoginPage(page);
		await loginPage.goto();
		await loginPage.login('test@test.test', 'test1234');

		await page.waitForURL('/', { waitUntil: 'domcontentloaded', timeout: 5000 });
		await expect(page).toHaveURL('/', { timeout: 5000 });
	});

	test('Invalid login shows an error', async ({ page }) => {
		const loginPage = new LoginPage(page);
		await loginPage.goto();
		await loginPage.login('wronguser@email.cz', 'wrongpass1234');

		const errorMessage = await loginPage.getErrorMessage();
		expect(errorMessage).toContain('Špatné přihlašovací údaje');
	});
});
