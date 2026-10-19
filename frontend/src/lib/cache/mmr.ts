import { type Writable, writable } from 'svelte/store';
import type { Game } from '../../types/game';

export interface LeaderboardEntry {
	username: string;
	mmr: number;
}

interface MMRCache {
	games: Game[];
	/** keyed by 'all' or gameId string */
	leaderboards: Record<string, LeaderboardEntry[]>;
	leaderboardFetched: Record<string, number>;
	gamesFetched: number;
}

const initialMMRCache: MMRCache = {
	games: [],
	leaderboards: {},
	leaderboardFetched: {},
	gamesFetched: 0
};

const { subscribe, set, update }: Writable<MMRCache> = writable(initialMMRCache);

export const mmrCache = {
	subscribe,
	set,
	update,
	clear: () => {
		console.log('Cleaning mmr cache...');
		set(initialMMRCache);
	}
};
