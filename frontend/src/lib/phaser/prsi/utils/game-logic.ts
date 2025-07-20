import type { CardData } from '$lib/phaser/prsi/types/game-state';

function checkForSpecialCards(card: CardData, topCard: CardData): boolean | null {
	if (topCard.rank !== 'sedma' && card.rank === 'svrsek') {
		return true; // Svrsek can be played on any card except sedma
	}

	if (topCard.rank === 'eso' && card.rank !== 'eso') {
		return false;
	}

	if (topCard.rank === 'sedma' && card.rank !== 'sedma') {
		return false;
	}

	return null;
}

export function isCardPlayable(
	card: CardData,
	topCard: CardData,
	activeEffect: boolean,
	svrsek: string | null
): boolean {
	console.log(activeEffect, topCard, card, svrsek);
	if (activeEffect) {
		const res = checkForSpecialCards(card, topCard);
		if (res !== null) {
			return res;
		}
	}

	if (card.rank === 'svrsek') {
		return true; // Svrsek can always be played if sedma is not active
	}

	if (svrsek) {
		return card.suit === svrsek; // If svrsek is active, card must match the svrsek suit
	}

	// Check if the card is of the same suit or rank as the top card
	return card.suit === topCard.suit || card.rank === topCard.rank;
}
