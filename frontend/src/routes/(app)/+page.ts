import type { PageLoad } from '../../../.svelte-kit/types/src/routes/(app)/$types';
import { API } from '../../constants/urls';
import type { GamePreview } from '../../types/game';

export const load: PageLoad = async () => {
	try {
		const games = await fetch(`${API}/api/games`).then((res) => res.json());

		return {
			data: {
				games: games as GamePreview[]
			}
		};
	} catch {
		return {
			status: 404,
			error: new Error('Failed to load')
		};
	}
};
