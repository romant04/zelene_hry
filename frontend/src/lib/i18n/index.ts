import type { Locale, TranslateFn, TranslationKey, TranslationSchema } from './types';
import cs from './locales/cs';
import en from './locales/en';
import { i18n, rememberLocale } from './locale.svelte';
import { localizePath } from './routing';

export type { Locale, TranslateFn, TranslationKey, TranslationSchema };
export { acceptLanguageHeaders, detectLocale, parseLocaleCookie } from './localeHeaders';
export { formatNotificationMessage } from './formatNotification';
export { localizeGame, localizeGamePreview, resolveGameCode } from './catalog';
export {
	GAME_SLUGS,
	LOCALES,
	delocalizePath,
	localeFromPath,
	localizePath,
	switchLocalePath
} from './routing';
export { i18n, rememberLocale };

/** Internal path -> public URL in the current language: `href={localizeHref('/login')}` */
export function localizeHref(href: string, locale: Locale = i18n.locale): string {
	return localizePath(href, locale);
}

const dictionaries: Record<Locale, TranslationSchema> = { cs, en };

function getByPath(obj: unknown, path: string): string | undefined {
	const parts = path.split('.');
	let current: unknown = obj;

	for (const part of parts) {
		if (current == null || typeof current !== 'object') return undefined;
		current = (current as Record<string, unknown>)[part];
	}

	return typeof current === 'string' ? current : undefined;
}

function interpolate(text: string, params?: Record<string, string | number>): string {
	if (!params) return text;

	return Object.entries(params).reduce(
		(result, [key, value]) => result.replaceAll(`{${key}}`, String(value)),
		text
	);
}

export function translate(
	loc: Locale,
	key: TranslationKey,
	params?: Record<string, string | number>
): string {
	const text = getByPath(dictionaries[loc], key) ?? getByPath(dictionaries.cs, key) ?? key;
	return interpolate(text, params);
}

/**
 * Reactive translator for templates: `t('nav.login')`.
 * Reads `i18n.locale` so Svelte 5 tracks locale changes.
 */
export function t(key: TranslationKey, params?: Record<string, string | number>): string {
	return translate(i18n.locale, key, params);
}

/** Alias for callbacks / non-template code */
export const tt = t;

export function pluralKey(
	base:
		| 'notifications.daysAgo'
		| 'notifications.hoursAgo'
		| 'notifications.minutesAgo'
		| 'notifications.secondsAgo',
	count: number
): TranslationKey {
	return `${base}_${count === 1 ? 'one' : 'other'}` as TranslationKey;
}
