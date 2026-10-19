import { type Writable, writable } from 'svelte/store';
import type { Friendship } from '../../types/friendship';
import type { Chatroom } from '../../types/chat';
import type { Restriction } from '../../types/restriction';

interface ChatsCache {
	currentUserId: number | null;
	friendships: Friendship[] | null;
	friendsFetched: number;
	chatRooms: Chatroom[] | null;
	restrictions: Restriction[] | null;
	roomsFetched: number;
}

const initialChatsCache: ChatsCache = {
	currentUserId: null,
	friendships: null,
	friendsFetched: 0,
	chatRooms: null,
	restrictions: null,
	roomsFetched: 0
};

const { subscribe, set, update }: Writable<ChatsCache> = writable(initialChatsCache);

export const chatsCache = {
	subscribe,
	set,
	update,
	clear: () => {
		console.log('Cleaning chats cache...');
		set(initialChatsCache);
	}
};
