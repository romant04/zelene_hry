import { writable } from 'svelte/store';

export interface HorolezciStats {
	distanceTraveled: number;
	safetyPins: number;
}
export interface HorolezciStatsGlobal {
	player: HorolezciStats;
	enemy: HorolezciStats;
	endTime: number | null;
}

export const horolezciStats = writable<HorolezciStatsGlobal>({
	player: {
		distanceTraveled: 0,
		safetyPins: 2
	},
	enemy: {
		distanceTraveled: 0,
		safetyPins: 2
	},
	endTime: null
});

export const distanceToTravel = writable<{ player: number | null; enemy: number | null } | null>(
	null
);
