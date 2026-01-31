import { get } from 'svelte/store';
import { socialCache } from '$lib/cache/socials';
import { API } from '../../../constants/urls';
import { error } from '@sveltejs/kit';
import type { Friendship } from '../../../types/friendship';
import type { FriendRequest } from '../../../types/friendRequest';
import type { User } from '../../../types/user';

export interface FetchedSocialData {
	friendships: Friendship[];
	friendRequests: FriendRequest[];
	suggestedFriends: User[];
	isCached: boolean;
}

export const load = async ({ fetch }) => {
	const cache = get(socialCache);
	const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

	console.log(cache);
	// 1. Check if we have fresh data in the store
	if (cache.friendships && Date.now() - cache.lastFetched < CACHE_DURATION) {
		return { data: cache };
	}

	try {
		// 2. If not, fetch it
		const token = localStorage.getItem('token');

		const res = await fetch(`${API}/api/secured/socialDashboard`, {
			headers: { Authorization: `Bearer ${token}` }
		});

		const newData = (await res.json()) as FetchedSocialData;

		// 3. Update the store for the NEXT time they click
		socialCache.set({ ...newData, lastFetched: Date.now() });

		return {
			data: newData
		};
	} catch {
		throw error(500, 'Failed to load social data');
	}
};
