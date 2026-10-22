import type { Locale } from './types';

/**
 * Public (SEO) URLs differ from the route folders in src/routes:
 *  - czech lives at the root, english under `/en`
 *  - game detail pages use readable, translated slugs instead of `/game-detail/{id}`
 *  - a few sections have translated names in english
 *
 * Internal path = the path of the route folder (what `reroute` resolves to).
 * Public path   = what the user and search engines see in the address bar.
 */

export const LOCALES: Locale[] = ['cs', 'en'];
export const DEFAULT_LOCALE: Locale = 'cs';

const LOCALE_PREFIX: Record<Locale, string> = { cs: '', en: '/en' };

const GAMES_SEGMENT: Record<Locale, string> = { cs: 'hry', en: 'games' };

/** gameId -> slug used in the public URL */
export const GAME_SLUGS: Record<number, Record<Locale, string>> = {
	1: { cs: 'prsi', en: 'prsi' },
	2: { cs: 'slovni-fotbal', en: 'word-football' },
	3: { cs: 'horolezci', en: 'climbers' }
};

/** Internal section -> translated section name (sections not listed keep their name) */
const SECTIONS: Record<string, Record<Locale, string>> = {
	zebricek: { cs: 'zebricek', en: 'leaderboard' },
	pratele: { cs: 'pratele', en: 'friends' },
	profil: { cs: 'profil', en: 'profile' }
};

function splitSuffix(href: string): [string, string] {
	const index = href.search(/[?#]/);
	return index === -1 ? [href, ''] : [href.slice(0, index), href.slice(index)];
}

export function localeFromPath(pathname: string): Locale {
	return pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'cs';
}

/** Internal path (e.g. `/game-detail/1?x#y`) -> public path for the given locale. */
export function localizePath(href: string, locale: Locale): string {
	if (!href.startsWith('/')) return href; // relative links, anchors, external urls

	const [path, suffix] = splitSuffix(href);
	const [first, second, ...rest] = path.split('/').filter(Boolean);
	let segments: string[] = [first, second, ...rest].filter((s) => s !== undefined);

	if (first === 'game-detail' && second && GAME_SLUGS[Number(second)]) {
		segments = [GAMES_SEGMENT[locale], GAME_SLUGS[Number(second)][locale], ...rest];
	} else if (first && SECTIONS[first]) {
		segments = [SECTIONS[first][locale], ...segments.slice(1)];
	}

	const localized = LOCALE_PREFIX[locale] + (segments.length ? '/' + segments.join('/') : '');
	return (localized || '/') + suffix;
}

/** Public path -> internal route path. Unknown paths are returned without the locale prefix. */
export function delocalizePath(pathname: string): string {
	const locale = localeFromPath(pathname);
	const withoutPrefix = locale === 'en' ? pathname.slice(3) || '/' : pathname;
	const [first, second, ...rest] = withoutPrefix.split('/').filter(Boolean);

	if (first === GAMES_SEGMENT[locale] && second) {
		const gameId = Object.keys(GAME_SLUGS).find(
			(id) => GAME_SLUGS[Number(id)][locale] === second
		);
		if (gameId) return ['', 'game-detail', gameId, ...rest].join('/');
	}

	const section = Object.keys(SECTIONS).find((key) => SECTIONS[key][locale] === first);
	if (section) return ['', section, second, ...rest].filter((s) => s !== undefined).join('/');

	return withoutPrefix;
}

/** Same page in another language, keeping query and hash. */
export function switchLocalePath(href: string, locale: Locale): string {
	const [path, suffix] = splitSuffix(href);
	return localizePath(delocalizePath(path) + suffix, locale);
}
