import { writable } from 'svelte/store';
import type { Socket } from 'socket.io-client';

export const chatSocket = writable<{ chatSocket: Socket | null }>({
	chatSocket: null
});

export function setChatSocket(socket: Socket) {
	chatSocket.update(() => ({ chatSocket: socket }));
}

export function clearChatSocket() {
	chatSocket.update(() => ({ chatSocket: null }));
}
