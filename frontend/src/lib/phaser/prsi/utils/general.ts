import type { GameState } from '$lib/phaser/prsi/types/game-state';

export function rnd(min: number, max: number) {
	return Math.floor(Math.random() * (max - min)) + min;
}

export function isGameInProgress(state: GameState) {
	if (state.players.find((x) => x.cards.length === 0)) {
		return false; // at the start of the game, no player has cards
	}

	const playersWithChangedHandSize = state.players.filter((x) => x.cards.length !== 5);

	return state.deck.length < 31 || playersWithChangedHandSize.length > 0;
}
