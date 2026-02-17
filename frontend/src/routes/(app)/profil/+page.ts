import { browser } from '$app/environment';
import { error, redirect } from '@sveltejs/kit';
import { get } from 'svelte/store';
import { API } from '../../../constants/urls';
import type { User } from '../../../types/user';
import type { Game } from '../../../types/game';
import { profileCache } from '$lib/cache/profile';

export interface FetchedProfile {
	user: User;
	games: Game[];
}

export const load = async ({ fetch, data }) => {
	const token = data?.token || (browser ? localStorage.getItem('token') : null);

	if (!token) {
		throw redirect(303, '/login');
	}

	if (browser) {
		const cache = get(profileCache);
		if (cache.user && Date.now() - cache.lastFetched < 300000) {
			return { data: cache };
		}
	}

	// 3. Fetching
	try {
		const headers = { Authorization: `Bearer ${token}` };
		const [user, games] = await Promise.all([
			fetch(`${API}/api/secured/user`, { headers }).then((res) => res.json()),
			fetch(`${API}/api/games`, { headers }).then((res) => res.json())
		]);

		const newData = {
			user: user as User,
			games: games as Game[],
			lastFetched: Date.now()
		};

		// 4. Update Store (Browser Only)
		if (browser) {
			profileCache.set({ ...newData, lastFetched: Date.now() });
		}

		return { data: newData };
	} catch (err) {
		console.error('Error fetching profile data:', err);
		throw error(500, 'Failed to load profile data');
	}
};
