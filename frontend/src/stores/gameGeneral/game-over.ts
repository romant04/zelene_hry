import { writable } from 'svelte/store';

export const gameOver = writable<{ gameOver: boolean; winner: string }>({
	gameOver: false,
	winner: ''
});

export function toggleGameOverOn(winner: string) {
	gameOver.update(() => ({
		gameOver: true,
		winner: winner
	}));
}
export function toggleGameOverOff() {
	gameOver.update(() => ({
		gameOver: false,
		winner: ''
	}));
}
