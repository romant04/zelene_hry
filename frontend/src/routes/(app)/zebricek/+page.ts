import { browser } from '$app/environment';
import { error, redirect } from '@sveltejs/kit';
import { get } from 'svelte/store';
import { API } from '../../../constants/urls';
import type { MMR, User } from '../../../types/user';
import { mmrCache } from '$lib/cache/mmr';
import type { Game } from '../../../types/game';

export interface FetchedMMRs {
	MMRs: MMR[];
	games: Game[];
	users: User[];
}

export const load = async ({ fetch, data }) => {
	const token = data?.token || (browser ? localStorage.getItem('token') : null);

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
	const res = await fetch(`${API}/api/secured/mmr`, {
		headers: { Authorization: `Bearer ${token}` }
	});

	const headers = { Authorization: `Bearer ${token}` };
	const [mmrs, games, users] = await Promise.all([
		fetch(`${API}/api/secured/mmr`, { headers }).then((res) => res.json()),
		fetch(`${API}/api/games`, { headers }).then((res) => res.json()),
		fetch(`${API}/api/secured/users`, { headers }).then((res) => res.json())
	]);

	if (!res.ok) {
		// If API says token is invalid, clear cookie/redirect
		if (res.status === 401) throw redirect(303, '/login');
		throw error(res.status, 'Backend Error');
	}

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
};
