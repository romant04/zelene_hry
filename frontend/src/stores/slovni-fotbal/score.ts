import { writable } from 'svelte/store';

export interface Score {
	player: {
		score: number;
		goals: number;
	};
	enemy: {
		score: number;
		goals: number;
	};
}

export const score = writable<Score>({
	player: {
		score: 0,
		goals: 0
	},
	enemy: {
		score: 0,
		goals: 0
	}
});

export function setScore(sc: Score) {
	score.update(() => ({
		player: sc.player,
		enemy: sc.enemy
	}));
}
