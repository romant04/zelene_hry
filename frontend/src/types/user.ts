export interface User {
	id: number;
	email: string;
	username: string;
	player: Player | null;
	admin: Admin | null;
}

export interface Player {
	id: number;
	playTime: number;
}
export interface Admin {
	id: number;
	permissionLevel: number;
}
