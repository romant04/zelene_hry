import { browser } from '$app/environment';
import type { Locale } from './types';

/** Prefer browser-stored locale over SSR cookie when available. */
export function getClientLocale(fallback: Locale = 'cs'): Locale {
	if (browser) {
		const stored = localStorage.getItem('locale');
		if (stored === 'cs' || stored === 'en') return stored;
	}
	return fallback;
}
