import { writable } from 'svelte/store';

export const svrsek = writable<{ svrsekOpen: boolean; oldSuit: string | null }>({
	svrsekOpen: false,
	oldSuit: null
});

export function toggleSvrsek(oldSuit: string) {
	svrsek.update((state) => ({
		svrsekOpen: !state.svrsekOpen,
		oldSuit: oldSuit
	}));
}
