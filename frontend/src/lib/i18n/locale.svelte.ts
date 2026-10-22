import { browser } from '$app/environment';
import type { Locale } from './types';

const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

/**
 * Class-based shared state (Svelte 5 recommended) so `i18n.locale` stays
 * reactive across components after hydration.
 * The locale always comes from the URL (`/en/...` = english), the root layout keeps it in sync.
 */
class I18nState {
	locale = $state<Locale>('cs');
}

export const i18n = new I18nState();

/**
 * Remembers an explicit language choice. The server uses the cookie to send
 * returning visitors from `/` to their language; the page itself is switched
 * by navigating to its URL in the other language.
 */
export function rememberLocale(value: Locale) {
	if (!browser) return;
	document.cookie = `locale=${value}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
}
