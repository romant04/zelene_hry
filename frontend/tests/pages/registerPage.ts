import type { Page } from '@playwright/test';

export class RegisterPage {
	constructor(private page: Page) {}

	async goto() {
		await this.page.goto('/register', { timeout: 5000 });
	}

	async register(email: string, password: string) {
		await this.page.fill('input[name="username"]', 'test2');
		await this.page.fill('input[name="email"]', email);
		await this.page.fill('input[name="pass"]', password);
		await this.page.fill('input[name="pass2"]', password);
		await this.page.click('button[type="submit"]');
	}

	async getErrorMessage() {
		const toasts = this.page.locator("[id^='error-']");
		await toasts.last().waitFor({ state: 'visible', timeout: 10000 });
		return await toasts.last().textContent();
	}
}
