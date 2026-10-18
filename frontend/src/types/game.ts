export enum GameInfoType {
	CONTROL = 'CONTROL',
	GENERAL = 'GENERAL'
}

export interface GameCategory {
	gameCategoryId: number;
	name: string;
}
export interface GameInfo {
	gameInfoId: number;
	gameInfo: string;
	infoLabel: GameInfoType;
}
export interface Game {
	gameId: number;
	code?: string;
	name: string;
	perex: string;
	description: string;
	gameInfo: GameInfo[];
	gameCategories: GameCategory[];
}
export type GamePreview = Pick<Game, 'gameId' | 'code' | 'name' | 'perex' | 'gameCategories'>;
