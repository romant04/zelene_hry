import { defineConfig } from '@playwright/test';

export default defineConfig({
	testDir: './tests',
	timeout: 30000,
	expect: {
		timeout: 5000
	},
	use: {
		headless: true,
		baseURL: 'http://localhost:5173',
		browserName: 'chromium',
		trace: 'on-first-retry'
	},
	reporter: [['html'], ['json', { outputFile: 'results.json' }]],
});
