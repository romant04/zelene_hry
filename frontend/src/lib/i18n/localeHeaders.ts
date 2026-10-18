import type { Locale } from './types';

export function parseLocaleCookie(cookieValue: string | undefined | null): Locale {
	if (cookieValue === 'en' || cookieValue === 'cs') return cookieValue;
	return 'cs';
}

export function acceptLanguageHeaders(locale: Locale): Record<string, string> {
	return { 'Accept-Language': locale };
}
