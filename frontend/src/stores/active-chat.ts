import { writable } from 'svelte/store';
import type { User } from '../types/user';
import type { Chatroom } from '../types/chat';

export const activeChat = writable<{ activeChat: User | Chatroom | null }>({
	activeChat: null
});

export function setActiveChat(chat: User | Chatroom) {
	activeChat.update(() => ({ activeChat: chat }));
}

export function clearActiveChat() {
	activeChat.update(() => ({ activeChat: null }));
}
