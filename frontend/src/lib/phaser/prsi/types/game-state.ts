export interface GameState {
	players: {
		id: number;
		name: string;
		cards: CardData[]; // Array of card IDs
		token: string;
	}[];
	currentPlayerId: number; // ID of the player whose turn it is
	deck: CardData[]; // Array of card IDs in the deck
	centerCards: CardData[];
	svrsek: string | null; // The suit of the svrsek card, if any
}
export interface CardData {
	suit: 'c' | 'e' | 'z' | 'k';
	rank: 'sedma' | 'osma' | 'devitka' | 'desitka' | 'eso' | 'kral' | 'spodek' | 'svrsek'; // Rank of the card
}
