export interface SlovniFotbalPlayer {
	id: number;
	name: string;
	token: string;
	isConnected: boolean;
	score: number;
	goals: number;
	alreadyUsedWords: string[];
}
export interface SlovniFotbalGameState {
	players: SlovniFotbalPlayer[];
	endTime: number;
	letters: string[];
}
