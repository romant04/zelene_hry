import { writable } from 'svelte/store';

export const gameOver = writable<{ gameOver: boolean; winner: string }>({
	gameOver: false,
	winner: ''
});

export function toggleGameOver(winner: string) {
	gameOver.update((state) => ({
		gameOver: !state.gameOver,
		winner: winner
	}));
}
