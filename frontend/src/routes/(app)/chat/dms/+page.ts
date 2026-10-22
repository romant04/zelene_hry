import type { PageLoad } from './$types';
import type { Friendship } from '../../../../types/friendship';
import { API } from '../../../../constants/urls';
import { chatsCache } from '$lib/cache/chats';
import { get } from 'svelte/store';
import { error, redirect } from '@sveltejs/kit';
import { localeFromPath, localizePath } from '$lib/i18n';
import { browser } from '$app/environment';

interface FriendsDashboard {
	currentUserId: number;
	friendships: Friendship[];
}

export interface FetchedDmData {
	currentUserId: number;
	friendships: Friendship[];
}

const CACHE_DURATION = 5 * 60 * 1000;

export const load: PageLoad = async ({ fetch, data, url }) => {
	const token = data?.token || (browser ? localStorage.getItem('token') : null);

	if (!token) {
		throw redirect(303, localizePath('/login', localeFromPath(url.pathname)));
	}

	if (browser) {
		const cache = get(chatsCache);
		if (
			cache.friendships &&
			cache.currentUserId != null &&
			Date.now() - cache.friendsFetched < CACHE_DURATION
		) {
			return {
				data: {
					currentUserId: cache.currentUserId,
					friendships: cache.friendships
				} satisfies FetchedDmData
			};
		}
	}

	try {
		const headers = { Authorization: `Bearer ${token}` };
		const dashboard = (await fetch(`${API}/api/secured/user/friends`, { headers }).then(
			(res) => {
				if (!res.ok) throw new Error('friends failed');
				return res.json();
			}
		)) as FriendsDashboard;

		if (browser) {
			chatsCache.update((cache) => ({
				...cache,
				currentUserId: dashboard.currentUserId,
				friendships: dashboard.friendships,
				friendsFetched: Date.now()
			}));
		}

		return {
			data: {
				currentUserId: dashboard.currentUserId,
				friendships: dashboard.friendships
			} satisfies FetchedDmData
		};
	} catch {
		return error(500, 'Failed to load chat data');
	}
};
