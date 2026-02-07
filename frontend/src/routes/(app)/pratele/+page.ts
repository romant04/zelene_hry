import { browser } from '$app/environment';
import { error, redirect } from '@sveltejs/kit';
import { get } from 'svelte/store';
import { socialCache } from '$lib/cache/socials';
import { API } from '../../../constants/urls';
import type { Friendship } from '../../../types/friendship';
import type { FriendRequest } from '../../../types/friendRequest';
import type { User } from '../../../types/user';

export interface FetchedSocialData {
	friendships: Friendship[];
	friendRequests: FriendRequest[];
	suggestedFriends: User[];
	isCached: boolean;
}

export const load = async ({ fetch, data }) => {
	// 1. Priority: Token from Server Data, Fallback: LocalStorage
	const token = data?.token || (browser ? localStorage.getItem('token') : null);

	if (!token) {
		throw redirect(303, '/login');
	}

	// 2. Cache check (Browser Only)
	if (browser) {
		const cache = get(socialCache);
		if (cache.friendships && Date.now() - cache.lastFetched < 300000) {
			return { data: cache };
		}
	}

	// 3. Fetching
	const res = await fetch(`${API}/api/secured/socialDashboard`, {
		headers: { Authorization: `Bearer ${token}` }
	});

	if (!res.ok) {
		// If API says token is invalid, clear cookie/redirect
		if (res.status === 401) throw redirect(303, '/login');
		throw error(res.status, 'Backend Error');
	}

	const newData = (await res.json()) as FetchedSocialData;

	// 4. Update Store (Browser Only)
	if (browser) {
		socialCache.set({ ...newData, lastFetched: Date.now() });
	}

	return { data: newData };
};
