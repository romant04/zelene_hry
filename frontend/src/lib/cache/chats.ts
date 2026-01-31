import { type Writable, writable } from 'svelte/store';
import type { Friendship } from '../../types/friendship';
import type { Chatroom } from '../../types/chat';
import type { Restriction } from '../../types/restriction';

interface ChatsCache {
	friendships: Friendship[] | null;
	chatRooms: Chatroom[] | null;
	restrictions: Restriction[] | null;
	lastFetched: number;
}

// Cache data for friends page
export const chatsCache: Writable<ChatsCache> = writable({
	friendships: null,
	chatRooms: null,
	restrictions: null,
	lastFetched: 0
});
