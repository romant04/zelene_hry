import { writable } from 'svelte/store';
import type { PublicUser } from '../types/user';

export const restrictionOverlay = writable<{
	isOpen: boolean;
	user: PublicUser | null;
}>({
	isOpen: false,
	user: null
});
