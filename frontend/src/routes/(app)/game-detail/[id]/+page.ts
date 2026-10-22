import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { API } from '../../../../constants/urls';
import type { Game } from '../../../../types/game';
import { acceptLanguageHeaders } from '$lib/i18n';

export const load: PageLoad = async ({ params, fetch, parent }) => {
	const { locale } = await parent();

	if (params.id) {
		const game = await fetch(`${API}/api/games/${params.id}`, {
			headers: acceptLanguageHeaders(locale)
		}).then((res) => res.json());

		return {
			game: game as Game
		};
	}

	error(404, 'Not found');
};
