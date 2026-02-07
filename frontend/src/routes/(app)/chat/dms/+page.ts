import type { PageLoad } from './$types';
import type { Friendship } from '../../../../types/friendship';
import { API } from '../../../../constants/urls';
import type { Chatroom } from '../../../../types/chat';
import { chatsCache } from '$lib/cache/chats';
import { get } from 'svelte/store';
import { error, redirect } from '@sveltejs/kit';
import { browser } from '$app/environment';

export interface FetchedDmData {
	friendships: Friendship[];
	chatRooms: Chatroom[];
}

export const load: PageLoad = async ({ fetch, data }) => {
	const token = data?.token || (browser ? localStorage.getItem('token') : null);

	if (!token) {
		throw redirect(303, '/login');
	}

	if (browser) {
		const cache = get(chatsCache);
		const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

		if (cache.chatRooms && Date.now() - cache.lastFetched < CACHE_DURATION) {
			return { data: cache };
		}
	}

	try {
		const headers = { Authorization: `Bearer ${token}` };

		const [friendships, chatRooms] = await Promise.all([
			fetch(`${API}/api/secured/user/friends`, { headers }).then((res) => res.json()),
			fetch(`${API}/api/secured/chats`, { headers }).then((res) => res.json())
		]);

		const newData = {
			friendships: friendships as Friendship[],
			chatRooms: chatRooms as Chatroom[],
			restrictions: null,
			lastFetched: Date.now()
		};

		if (browser) {
			chatsCache.set(newData);
		}

		return { data: newData as FetchedDmData };
	} catch {
		return error(500, 'Failed to load chat data');
	}
};
