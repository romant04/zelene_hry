import { browser } from '$app/environment';
import { error, redirect } from '@sveltejs/kit';
import { get } from 'svelte/store';
import { socialCache } from '$lib/cache/socials';
import { API } from '../../../constants/urls';
import type { Friendship } from '../../../types/friendship';
import type { FriendRequest } from '../../../types/friendRequest';

export interface FetchedSocialData {
	currentUserId: number;
	friendships: Friendship[];
	friendRequests: FriendRequest[];
	isCached?: boolean;
}

export const load = async ({ fetch, data }) => {
	const token = data?.token || (browser ? localStorage.getItem('token') : null);

	if (!token) {
		throw redirect(303, '/login');
	}

	if (browser) {
		const cache = get(socialCache);
		if (
			cache.friendships &&
			cache.friendRequests &&
			cache.currentUserId != null &&
			Date.now() - cache.lastFetched < 300000
		) {
			return {
				data: {
					currentUserId: cache.currentUserId,
					friendships: cache.friendships,
					friendRequests: cache.friendRequests,
					isCached: true
				} satisfies FetchedSocialData
			};
		}
	}

	const res = await fetch(`${API}/api/secured/socialDashboard`, {
		headers: { Authorization: `Bearer ${token}` }
	});

	if (!res.ok) {
		if (res.status === 401) throw redirect(303, '/login');
		throw error(res.status, 'Backend Error');
	}

	const newData = (await res.json()) as FetchedSocialData;

	if (browser) {
		socialCache.set({
			currentUserId: newData.currentUserId,
			friendships: newData.friendships,
			friendRequests: newData.friendRequests,
			lastFetched: Date.now()
		});
	}

	return { data: newData };
};
