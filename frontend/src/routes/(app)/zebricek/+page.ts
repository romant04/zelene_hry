import { browser } from '$app/environment';
import { error, redirect } from '@sveltejs/kit';
import { get } from 'svelte/store';
import { API } from '../../../constants/urls';
import type { MMR, User } from '../../../types/user';
import { mmrCache } from '$lib/cache/mmr';
import type { Game } from '../../../types/game';
import { acceptLanguageHeaders, getClientLocale, type Locale } from '$lib/i18n';

export interface FetchedMMRs {
	MMRs: MMR[];
	games: Game[];
	users: User[];
}

export const load = async ({ fetch, data, parent }) => {
	const token = data?.token || (browser ? localStorage.getItem('token') : null);
	const { locale: parentLocale } = (await parent()) as { locale: Locale };
	const locale = getClientLocale(parentLocale);

	if (!token) {
		throw redirect(303, '/login');
	}

	if (browser) {
		const cache = get(mmrCache);
		if (cache.MMRs && Date.now() - cache.lastFetched < 300000) {
			return { data: cache };
		}
	}

	// 3. Fetching
	try {
		const headers = {
			Authorization: `Bearer ${token}`,
			...acceptLanguageHeaders(locale)
		};
		const [mmrs, games, users] = await Promise.all([
			fetch(`${API}/api/secured/mmr`, { headers }).then((res) => res.json()),
			fetch(`${API}/api/games`, { headers }).then((res) => res.json()),
			fetch(`${API}/api/secured/users`, { headers }).then((res) => res.json())
		]);

		const newData = {
			MMRs: mmrs as MMR[],
			games: games as Game[],
			users: users as User[],
			lastFetched: Date.now()
		};

		// 4. Update Store (Browser Only)
		if (browser) {
			mmrCache.set({ ...newData, lastFetched: Date.now() });
		}

		return { data: newData };
	} catch (err) {
		console.error('Error fetching MMR data:', err);
		throw error(500, 'Failed to load MMR data');
	}
};
