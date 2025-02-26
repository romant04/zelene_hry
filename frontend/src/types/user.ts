export interface User {
	id: string;
	email: string;
	username: string;
	player: Player | null;
	admin: Admin | null;
}

export interface Player {
	id: string;
	playTime: number;
}
export interface Admin {
	id: string;
	permissionLevel: number;
}
