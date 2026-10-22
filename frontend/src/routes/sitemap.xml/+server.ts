import { GAME_SLUGS, LOCALES, localizePath } from '$lib/i18n';
import { SITE_URL } from '../../constants/urls';

// Only public pages worth showing in search results (login, chat, profile, ... are left out on purpose)
const PAGES = ['/', ...Object.keys(GAME_SLUGS).map((gameId) => `/game-detail/${gameId}`)];

export const GET = async () => {
	const urls = PAGES.flatMap((page) => {
		// Every language version lists all of its alternates, including itself
		const alternates = [
			...LOCALES.map(
				(locale) =>
					`<xhtml:link rel="alternate" hreflang="${locale}" href="${SITE_URL}${localizePath(page, locale)}" />`
			),
			`<xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}${localizePath(page, 'en')}" />`
		].join('\n      ');

		return LOCALES.map(
			(locale) => `
    <url>
      <loc>${SITE_URL}${localizePath(page, locale)}</loc>
      ${alternates}
      <priority>${page === '/' ? '1.0' : '0.8'}</priority>
    </url>`
		);
	});

	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${urls.join('')}
</urlset>`;

	return new Response(sitemap, {
		headers: {
			'Content-Type': 'application/xml' // Tohle řekne prohlížeči, že jde o XML
		}
	});
};
