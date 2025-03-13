import { writable } from 'svelte/store';
import type { User } from '../types/user';

export const activeChat = writable<{ activeChat: User | null }>({
	activeChat: null
});

export function setActiveChat(user: User) {
	activeChat.update((ac) => ({ activeChat: user }));
}

export function clearActiveChat() {
	activeChat.update((ac) => ({ activeChat: null }));
}
