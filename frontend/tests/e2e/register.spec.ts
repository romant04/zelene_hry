import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { RegisterPage } from '../pages/registerPage';

test.describe('Register Tests', () => {
	test('User can register with valid credentials', async ({ page }) => {
		const registerPage = new RegisterPage(page);
		await registerPage.goto();
		await registerPage.register('test2@test.test', 'test1234');

		await page.waitForURL('/', { waitUntil: 'domcontentloaded', timeout: 5000 });
		await expect(page).toHaveURL('/', { timeout: 5000 });
	});

	test('Invalid register shows an error', async ({ page }) => {
		const registerPage = new RegisterPage(page);
		await registerPage.goto();
		await registerPage.register('test@test.test', 'wrongpass1234'); // already taken

		const errorMessage = await registerPage.getErrorMessage();
		expect(errorMessage).toContain('Registrace se nezdařila');
	});
});
