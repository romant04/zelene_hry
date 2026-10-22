import { type Handle, redirect } from '@sveltejs/kit';
import { protectedRoutes } from './constants/protectedRoutes';
import {
	delocalizePath,
	detectLocale,
	localeFromPath,
	localizePath,
	parseLocaleCookie
} from '$lib/i18n';

const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

// Pages that are useless (or private) as search results
const NOINDEX_ROUTES = [
	'/login',
	'/register',
	'/chat',
	'/pratele',
	'/profil',
	'/zebricek',
	'/game/',
	'/error'
];
const CHALLENGE_ROOM = /^\/game-detail\/[^/]+\/[^/]+/;

const BOT_USER_AGENT = /bot|crawl|spider|slurp|seznam|facebookexternalhit|embedly|preview/i;

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get('token'); // 1. Read the token from cookies
	const { pathname, search } = event.url;
	const locale = localeFromPath(pathname); // The URL decides the language
	const routePath = delocalizePath(pathname); // Path of the route folder, without language

	// Old non-localized game URLs (/game-detail/1) -> /hry/prsi, /en/games/prsi
	const publicWithoutPrefix = locale === 'en' ? pathname.slice(3) : pathname;
	if (publicWithoutPrefix.startsWith('/game-detail/')) {
		throw redirect(301, localizePath(publicWithoutPrefix, locale) + search);
	}

	// First visit (no explicit language choice yet) from a browser set to english -> english version.
	// Crawlers are never redirected so both language versions stay indexable.
	const preferredLocale = parseLocaleCookie(event.cookies.get('locale'));
	if (
		event.request.method === 'GET' &&
		!event.isDataRequest &&
		locale === 'cs' &&
		event.request.headers.get('accept')?.includes('text/html') &&
		!BOT_USER_AGENT.test(event.request.headers.get('user-agent') ?? '')
	) {
		const isFirstVisit = !preferredLocale;
		const wantsEnglish = isFirstVisit
			? detectLocale(event.request.headers.get('accept-language')) === 'en'
			: preferredLocale === 'en' && pathname === '/';

		if (wantsEnglish) {
			event.cookies.set('locale', 'en', {
				path: '/',
				maxAge: COOKIE_MAX_AGE,
				sameSite: 'lax',
				httpOnly: false
			});
			throw redirect(307, localizePath(routePath, 'en') + search);
		}
	}

	// Check if the current URL starts with any of your protected paths
	const isProtected = protectedRoutes.some((route) => routePath.startsWith(route));
	if (isProtected && !token) {
		throw redirect(303, localizePath('/login', locale));
	}

	// 2. Pass it into "locals" so all load functions can see it
	event.locals.token = token || null;
	event.locals.locale = locale;

	// 3. Proceed with the request
	const response = await resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%lang%', locale)
	});

	if (
		NOINDEX_ROUTES.some((route) => routePath.startsWith(route)) ||
		CHALLENGE_ROOM.test(routePath)
	) {
		response.headers.set('X-Robots-Tag', 'noindex');
	}
	return response;
};
