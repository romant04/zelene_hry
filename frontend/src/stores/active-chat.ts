import { writable } from 'svelte/store';
import type { User } from '../types/user';
import type { Chatroom } from '../types/chat';

// TODO: This needs to work for both private and public chats, so we need to store the active chat in a way that can handle both types.
export const activeChat = writable<{ activeChat: User | Chatroom | null }>({
	activeChat: null
});

export function setActiveChat(chat: User | Chatroom) {
	activeChat.update(() => ({ activeChat: chat }));
}

export function clearActiveChat() {
	activeChat.update(() => ({ activeChat: null }));
}
