import type { PageLoad } from '../../../.svelte-kit/types/src/routes/(app)/$types';
import { API } from '../../constants/urls';
import type { GamePreview } from '../../types/game';
import { acceptLanguageHeaders, getClientLocale } from '$lib/i18n';

export const load: PageLoad = async ({ fetch, parent }) => {
	const { locale: parentLocale } = await parent();
	const locale = getClientLocale(parentLocale);

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
