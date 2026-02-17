export const GET = async () => {
	const site = 'https://www.zelene-hry.com';
	const pages = [
		'',
		'chat/dms',
		'chat/rooms',
		'login',
		'register',
		'profil',
		'pratele',
		'game-detail/1',
		'game-detail/2',
		'game-detail/3'
	];

	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${pages
			.map(
				(page) => `
        <url>
          <loc>${site}/${page}</loc>
          <changefreq>daily</changefreq>
          <priority>${page === '' ? '1.0' : '0.8'}</priority>
        </url>
      `
			)
			.join('')}
    </urlset>`;

	return new Response(sitemap, {
		headers: {
			'Content-Type': 'application/xml' // Tohle řekne prohlížeči, že jde o XML
		}
	});
};
