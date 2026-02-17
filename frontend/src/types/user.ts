export interface User {
	id: number;
	email: string;
	username: string;
	player: Player | null;
	admin: Admin | null;
}

export interface MMR {
	userId: number;
	gameId: number;
	mmr: number;
}
export interface Player {
	id: number;
	mmr: MMR[];
	playerStats: PlayerStats[];
}
export interface Admin {
	id: number;
	permissionLevel: number;
}

export interface PlayerStats {
	userId: number;
	gameId: number;

	playTimeMinutes: number;
	gamesPlayed: number;
	winRatio: number;
}
