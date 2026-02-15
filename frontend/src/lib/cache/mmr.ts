import { type Writable, writable } from 'svelte/store';
import type { MMR, User } from '../../types/user';
import type { Game } from '../../types/game';

interface MMRCahce {
	MMRs: MMR[];
	games: Game[];
	users: User[];
	lastFetched: number;
}

const initialMMRCache: MMRCahce = {
	MMRs: [],
	games: [],
	users: [],
	lastFetched: 0
};

// Cache data for friends page
const { subscribe, set, update }: Writable<MMRCahce> = writable(initialMMRCache);

// 3. Export a custom object that includes the default methods + your new ones
export const mmrCache = {
	subscribe,
	set,
	update,
	clear: () => {
		console.log('Cleaning mmr cache...');
		set(initialMMRCache);
	}
};
