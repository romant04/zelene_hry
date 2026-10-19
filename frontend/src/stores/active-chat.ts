import { writable } from 'svelte/store';
import type { PublicUser } from '../types/user';
import type { Chatroom } from '../types/chat';

export const activeChat = writable<{ activeChat: PublicUser | Chatroom | null }>({
	activeChat: null
});

export function setActiveChat(chat: PublicUser | Chatroom) {
	activeChat.update(() => ({ activeChat: chat }));
}

export function clearActiveChat() {
	activeChat.update(() => ({ activeChat: null }));
}
