import { type Writable, writable } from 'svelte/store';
import type { User } from '../../types/user';
import type { Game } from '../../types/game';

interface ProfileCache {
	user: User | null;
	games: Game[];
	lastFetched: number;
}

const initialProfileCache: ProfileCache = {
	user: null,
	games: [],
	lastFetched: 0
};

// Cache data for friends page
const { subscribe, set, update }: Writable<ProfileCache> = writable(initialProfileCache);

// 3. Export a custom object that includes the default methods + your new ones
export const profileCache = {
	subscribe,
	set,
	update,
	clear: () => {
		console.log('Cleaning mmr cache...');
		set(initialProfileCache);
	}
};
