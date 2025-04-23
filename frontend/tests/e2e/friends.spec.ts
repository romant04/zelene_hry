import { expect, test } from '@playwright/test';
import { FriendsPage } from '../pages/friendsPage';
import { LoginPage } from '../pages/loginPage';
import { API } from '../../src/constants/urls';

test.describe('Friend system test', () => {
	test.beforeEach(async ({ page }, testInfo) => {
		const loginPage = new LoginPage(page);
		await loginPage.goto();
		if (testInfo.title.includes('User can add friend')) {
			await loginPage.login('test@test.test', 'test1234');
		} else if (testInfo.title.includes('User can accept friend request')) {
			await loginPage.login('test.friend@gmail.com', 'test1234');
		}

		await page.waitForURL('/', { waitUntil: 'domcontentloaded', timeout: 5000 });
	});

	test.afterEach(async () => {
		await fetch(`${API}/test-api/reset`, {
			method: 'POST'
		});
	});

	test('User can add friend', async ({ page }) => {
		const friendPage = new FriendsPage(page);
		await friendPage.goto();

		await friendPage.sendFriendRequest('Test friend', 'This is a test message!');
		const successMessage = await friendPage.getSuccessMessage();
		expect(successMessage).toContain('Žádost o přátelství byla úspěšně odeslána');
	});

	test('User can accept friend request', async ({ page }) => {
		const friendPage = new FriendsPage(page);
		await friendPage.goto();

		await friendPage.acceptFriendRequest('Testosteron');
		const successMessage = await friendPage.getSuccessMessage();
		expect(successMessage).toContain('Úspěšne jste přijali jste žádost o přátelství');
	});
});
