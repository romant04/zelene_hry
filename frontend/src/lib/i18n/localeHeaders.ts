import type { Locale } from './types';

export function parseLocaleCookie(cookieValue: string | undefined | null): Locale | null {
	if (cookieValue === 'en' || cookieValue === 'cs') return cookieValue;
	return null;
}

/**
 * Picks the locale from the browser's Accept-Language header, e.g. "sk,en-US;q=0.8".
 * Czech (and Slovak, which reads Czech fine) maps to `cs`, English to `en`.
 * Any other language falls back to `en`, a missing header to `cs`.
 */
export function detectLocale(acceptLanguage: string | null): Locale {
	if (!acceptLanguage) return 'cs';

	const preferred = acceptLanguage
		.split(',')
		.map((part) => {
			const [tag, ...params] = part.trim().split(';');
			const q = params.find((p) => p.trim().startsWith('q='));
			return {
				lang: tag.trim().toLowerCase().split('-')[0],
				q: q ? Number(q.split('=')[1]) : 1
			};
		})
		.filter((entry) => entry.lang && !Number.isNaN(entry.q) && entry.q > 0)
		.sort((a, b) => b.q - a.q);

	for (const { lang } of preferred) {
		if (lang === 'cs' || lang === 'sk') return 'cs';
		if (lang === 'en') return 'en';
	}
	return 'en';
}

export function acceptLanguageHeaders(locale: Locale): Record<string, string> {
	return { 'Accept-Language': locale };
}
