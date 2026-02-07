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

const initialChatsCache: ChatsCache = {
	friendships: null,
	chatRooms: null,
	restrictions: null,
	lastFetched: 0
};

// Cache data for friends page
const { subscribe, set, update }: Writable<ChatsCache> = writable(initialChatsCache);

// 3. Export a custom object that includes the default methods + your new ones
export const chatsCache = {
	subscribe,
	set,
	update,
	clear: () => {
		console.log('Cleaning chats cache...');
		set(initialChatsCache);
	}
};
