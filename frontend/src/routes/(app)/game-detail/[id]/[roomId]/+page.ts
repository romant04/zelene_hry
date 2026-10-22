import type { PageLoad } from '../../../../../../.svelte-kit/types/src/routes/(app)/game-detail/[id]/[roomId]/$types';
import { error } from '@sveltejs/kit';
import { API } from '../../../../../constants/urls';
import type { Game } from '../../../../../types/game';
import { acceptLanguageHeaders } from '$lib/i18n';

export const load: PageLoad = async ({ params, fetch, parent }) => {
	const { locale } = await parent();

	if (params.roomId) {
		const game = await fetch(`${API}/api/games/${params.id}`, {
			headers: acceptLanguageHeaders(locale)
		}).then((res) => res.json());

		return {
			roomId: params.roomId,
			game: game as Game
		};
	}

	error(404, 'Not found');
};
