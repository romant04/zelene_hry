import type { PageLoad } from './$types';
import type { Friendship } from '../../../../types/friendship';
import { API } from '../../../../constants/urls';
import type { Chatroom } from '../../../../types/chat';
import type { Restriction } from '../../../../types/restriction';
import { chatsCache } from '$lib/cache/chats';
import { get } from 'svelte/store';
import { error } from '@sveltejs/kit';

export interface FetchedChatData {
	friendships: Friendship[];
	chatRooms: Chatroom[];
	restrictions: Restriction[];
}

export const load: PageLoad = async () => {
	const cache = get(chatsCache);
	const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

	// 1. Check if we have fresh data in the store
	if (cache.chatRooms && Date.now() - cache.lastFetched < CACHE_DURATION) {
		return { data: cache };
	}

	// Additional check to ensure restrictions are also present (when we fetch from DMs page)
	if (!cache.restrictions && cache.chatRooms && Date.now() - cache.lastFetched < CACHE_DURATION) {
		const token = localStorage.getItem('token');
		const headers = { Authorization: `Bearer ${token}` };

		try {
			const restrictions = await fetch(`${API}/api/secured/chats/restrictions`, {
				headers
			}).then((res) => res.json());
			const newData = {
				...cache,
				restrictions: restrictions as Restriction[],
				lastFetched: Date.now()
			};
			chatsCache.set(newData);
			return { data: newData as FetchedChatData };
		} catch {
			return error(500, 'Failed to load chat restrictions');
		}
	}

	try {
		// 2. If not, fetch it
		const token = localStorage.getItem('token');
		const headers = { Authorization: `Bearer ${token}` };

		const [friendships, chatRooms, restrictions] = await Promise.all([
			fetch(`${API}/api/secured/user/friends`, { headers }).then((res) => res.json()),
			fetch(`${API}/api/secured/chats`, { headers }).then((res) => res.json()),
			fetch(`${API}/api/secured/chats/restrictions`, { headers }).then((res) => res.json())
		]);

		const newData = {
			friendships: friendships as Friendship[],
			chatRooms: chatRooms as Chatroom[],
			restrictions: restrictions as Restriction[],
			lastFetched: Date.now()
		};

		// 3. Update the store for the NEXT time they click
		chatsCache.set(newData);

		return { data: newData as FetchedChatData };
	} catch {
		return error(500, 'Failed to load chat data');
	}
};
