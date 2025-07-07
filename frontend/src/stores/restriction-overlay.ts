import { writable } from 'svelte/store';
import type { User } from '../types/user';

export const restrictionOverlay = writable<{
	isOpen: boolean;
	user: User | null;
}>({
	isOpen: false,
	user: null
});
