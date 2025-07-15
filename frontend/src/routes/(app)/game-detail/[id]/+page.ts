import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { API } from '../../../../constants/urls';
import type { Game } from '../../../../types/game';

export const load: PageLoad = async ({ params }) => {
	if (params.id) {
		const game = await fetch(`${API}/api/games/${params.id}`).then((res) => res.json());

		return {
			game: game as Game
		};
	}

	error(404, 'Not found');
};
