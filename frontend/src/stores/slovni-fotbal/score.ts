import { writable } from 'svelte/store';

export interface Score {
	player: number;
	enemy: number;
}

export const score = writable<Score>({
	player: 0,
	enemy: 0
});

export function setScore(sc: Score) {
	score.update(() => ({
		player: sc.player,
		enemy: sc.enemy
	}));
}
