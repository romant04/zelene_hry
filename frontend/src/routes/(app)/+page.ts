import type { PageLoad } from '../../../.svelte-kit/types/src/routes/(app)/$types';
import { API } from '../../constants/urls';
import type { GamePreview } from '../../types/game';
import { acceptLanguageHeaders } from '$lib/i18n';

export const load: PageLoad = async ({ fetch, parent }) => {
	const { locale } = await parent();

	try {
		const games = await fetch(`${API}/api/games`, {
			headers: acceptLanguageHeaders(locale)
		}).then((res) => res.json());

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
