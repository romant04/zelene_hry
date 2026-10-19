import type { PageLoad } from './$types';
import { API } from '../../../../constants/urls';
import type { Chatroom } from '../../../../types/chat';
import type { Restriction } from '../../../../types/restriction';
import { chatsCache } from '$lib/cache/chats';
import { get } from 'svelte/store';
import { error, redirect } from '@sveltejs/kit';
import { browser } from '$app/environment';

interface ChatsDashboard {
	currentUserId: number;
	chats: Chatroom[];
}

export interface FetchedChatData {
	currentUserId: number;
	chatRooms: Chatroom[];
	restrictions: Restriction[];
}

const CACHE_DURATION = 5 * 60 * 1000;

export const load: PageLoad = async ({ fetch, data }) => {
	const token = data?.token || (browser ? localStorage.getItem('token') : null);

	if (!token) {
		throw redirect(303, '/login');
	}

	if (browser) {
		const cache = get(chatsCache);
		if (
			cache.chatRooms &&
			cache.restrictions &&
			cache.currentUserId != null &&
			Date.now() - cache.roomsFetched < CACHE_DURATION
		) {
			return {
				data: {
					currentUserId: cache.currentUserId,
					chatRooms: cache.chatRooms,
					restrictions: cache.restrictions
				} satisfies FetchedChatData
			};
		}
	}

	try {
		const headers = { Authorization: `Bearer ${token}` };

		const [dashboard, restrictions] = await Promise.all([
			fetch(`${API}/api/secured/chats`, { headers }).then(async (res) => {
				if (!res.ok) throw new Error('chats failed');
				return (await res.json()) as ChatsDashboard;
			}),
			fetch(`${API}/api/secured/chats/restrictions`, { headers }).then(async (res) => {
				if (!res.ok) throw new Error('restrictions failed');
				return (await res.json()) as Restriction[];
			})
		]);

		if (browser) {
			chatsCache.update((cache) => ({
				...cache,
				currentUserId: dashboard.currentUserId,
				chatRooms: dashboard.chats,
				restrictions,
				roomsFetched: Date.now()
			}));
		}

		return {
			data: {
				currentUserId: dashboard.currentUserId,
				chatRooms: dashboard.chats,
				restrictions
			} satisfies FetchedChatData
		};
	} catch {
		return error(500, 'Failed to load chat data');
	}
};
