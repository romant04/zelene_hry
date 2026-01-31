import type { PageLoad } from './$types';
import type { Friendship } from '../../../../types/friendship';
import { API } from '../../../../constants/urls';
import type { Chatroom } from '../../../../types/chat';
import { chatsCache } from '$lib/cache/chats';
import { get } from 'svelte/store';
import { error } from '@sveltejs/kit';

export interface FetchedDmData {
	friendships: Friendship[];
	chatRooms: Chatroom[];
}

export const load: PageLoad = async () => {
	const cache = get(chatsCache);
	const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

	// 1. Check if we have fresh data in the store
	if (cache.chatRooms && Date.now() - cache.lastFetched < CACHE_DURATION) {
		return { data: cache };
	}

	try {
		// 2. If not, fetch it
		const token = localStorage.getItem('token');
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

		// 3. Update the store for the NEXT time they click
		chatsCache.set(newData);

		return { data: newData as FetchedDmData };
	} catch {
		return error(500, 'Failed to load chat data');
	}
};
