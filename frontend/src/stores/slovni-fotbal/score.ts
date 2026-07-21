import { writable } from 'svelte/store';

export interface Score {
	player: {
		wordsFound: number;
		score: number;
		goals: number;
	};
	enemy: {
		wordsFound: number;
		score: number;
		goals: number;
	};
}

export const score = writable<Score>({
	player: {
		wordsFound: 0,
		score: 0,
		goals: 0
	},
	enemy: {
		wordsFound: 0,
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
