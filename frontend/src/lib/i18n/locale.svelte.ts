import { browser } from '$app/environment';
import type { Locale } from './types';

const STORAGE_KEY = 'locale';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

function readCookieLocale(): Locale | null {
	if (!browser) return null;
	const match = document.cookie.match(/(?:^|;\s*)locale=(cs|en)/);
	return match ? (match[1] as Locale) : null;
}

function persistLocaleCookie(value: Locale) {
	if (!browser) return;
	document.cookie = `locale=${value}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
}

function readStoredLocale(): Locale | null {
	if (!browser) return null;
	const stored = localStorage.getItem(STORAGE_KEY);
	if (stored === 'cs' || stored === 'en') return stored;
	return readCookieLocale();
}

/**
 * Class-based shared state (Svelte 5 recommended) so `i18n.locale` stays
 * reactive across components after hydration.
 */
class I18nState {
	/** SSR always starts as `cs`; client is aligned in layout via sync. */
	locale = $state<Locale>('cs');
}

export const i18n = new I18nState();

export function setLocale(next: Locale) {
	i18n.locale = next;
	if (browser) {
		localStorage.setItem(STORAGE_KEY, next);
		persistLocaleCookie(next);
		document.documentElement.lang = next === 'cs' ? 'cs' : 'en';
	}
}

/**
 * Apply localStorage after hydration. Always ends on the stored locale and
 * guarantees a locale transition when SSR HTML was Czech but storage is `en`
 * (client module may already have been nudged — force a change so hero/flag update).
 */
export function syncLocaleFromStorage() {
	if (!browser) return;

	const stored = readStoredLocale();
	if (!stored) {
		persistLocaleCookie(i18n.locale);
		document.documentElement.lang = i18n.locale === 'cs' ? 'cs' : 'en';
		return;
	}

	if (i18n.locale === stored) {
		// Same value as current state, but DOM may still be SSR (cs). Nudge first.
		i18n.locale = stored === 'en' ? 'cs' : 'en';
	}
	setLocale(stored);
}

/** Align with the locale used during SSR so hydration matches. */
export function alignLocaleWithServer(serverLocale: Locale) {
	i18n.locale = serverLocale;
}
