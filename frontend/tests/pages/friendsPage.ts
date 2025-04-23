import type { Page } from '@playwright/test';

export class FriendsPage {
	constructor(private page: Page) {}

	async goto() {
		await this.page.goto('/pratele', { timeout: 5000 });
	}

	async sendFriendRequest(friend: string, message: string) {
		await this.page.locator(`text=${friend}`).waitFor({ state: 'visible', timeout: 10000 });
		await this.page.click('div:has(p:has-text("Test friend")) >> text=Přidat do přátel');

		await this.page
			.locator('textarea[name="message"]')
			.waitFor({ state: 'visible', timeout: 2000 });
		await this.page.fill('textarea[name="message"]', message);
		await this.page.getByTitle('Odeslat žádost').click();
	}

	async acceptFriendRequest(friend: string) {
		await this.page
			.locator(`text=${friend}`)
			.first()
			.waitFor({ state: 'visible', timeout: 10000 });
		const card = this.page.locator(`div:has(div > p:has-text("${friend}"))`);
		await card.locator('text=Přijmout').click();
	}

	async getErrorMessage() {
		const toasts = this.page.locator("[id^='error-']");
		await toasts.last().waitFor({ state: 'visible', timeout: 10000 });
		return await toasts.last().textContent();
	}

	async getSuccessMessage() {
		const toasts = this.page.locator("[id^='success-']");
		await toasts.last().waitFor({ state: 'visible', timeout: 10000 });
		return await toasts.last().textContent();
	}
}
