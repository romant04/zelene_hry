import { writable } from 'svelte/store';

export const disconnect = writable<{ disconnect: boolean }>({
	disconnect: false
});

export function setDisconnect(dis: boolean) {
	disconnect.update(() => ({
		disconnect: dis
	}));
}
