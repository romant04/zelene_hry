import { PlayerStats } from "./user";

export type GameData = {
  roomKey: string; // Unique identifier for the game
  gameStartTime: number;
  isPrivate?: boolean; // If set to true the game won't update the MMR
  players: {
    id: number; // Unique identifier for the player
    name: string; // Name of the player
    token: string; // Token for the player (auth)
    mmr: number;
    playerStats: PlayerStats;
  }[];
};

// 1. Define the base player structure
interface BasePlayer {
  id: number;
  name: string;
  token: string;
  isConnected: boolean;
}

// 2. Make the General State generic, defaulting to the BasePlayer
interface GeneralGameState<P extends BasePlayer = BasePlayer> {
  players: P[];
}

// 3. Define your specific player
interface PrsiPlayer extends BasePlayer {
  cards: Card[];
}
export interface SlovniFotbalPlayer extends BasePlayer {
  score: number;
  goals: number;
  alreadyUsedWords: string[];
}

// We need a specific game state for each game
// Room prop is not needed here, we just combine the names of players
export interface PrsiGameState extends GeneralGameState<PrsiPlayer> {
  currentPlayerId: number;
  deck: Card[];
  centerCards: Card[] | null; // For refreshing the game state we might need all the cards in the center not just the top one
  svrsek: string | null;
}
export interface Card {
  suit: "c" | "e" | "z" | "k";
  rank:
    | "sedma"
    | "osma"
    | "devitka"
    | "desitka"
    | "eso"
    | "kral"
    | "spodek"
    | "svrsek"; // Rank of the card
}

export interface SlovniFotbalGameState
  extends GeneralGameState<SlovniFotbalPlayer> {}
