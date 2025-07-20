export type GameData = {
    gameId: string; // Unique identifier for the game
    players: {
        id: number; // Unique identifier for the player
        name: string; // Name of the player
        token: string; // Token for the player (auth)
        mmr: number;
    }[];
};

// We need a specific game state for each game
// Room prop is not needed here, we just combine the names of players
export interface PrsiGameState {
    players: {
        id: number;
        name: string;
        token: string; // Token for the player (auth)
        cards: Card[]; // Players hand - empty until the game starts
        isConnected: boolean; // Whether the player is connected
    }[];
    currentPlayerId: number;
    deck: Card[];
    centerCards: Card[] | null; // For refreshing the game state we might need all the cards in the center not just the top one
    svrsek: string | null;
}
export interface Card {
    suit: 'c' | 'e' | 'z' | 'k';
    rank: 'sedma' | 'osma' | 'devitka' | 'desitka' | 'eso' | 'kral' | 'spodek' | 'svrsek'; // Rank of the card
}