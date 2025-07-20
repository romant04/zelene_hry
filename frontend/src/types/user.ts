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
	playTime: number;
	mmr: MMR[];
}
export interface Admin {
	id: number;
	permissionLevel: number;
}
