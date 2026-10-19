import type { PublicUser } from './user';

export interface Restriction {
	chatId: number;
	userId: number;
	reason: string;
	startAt: Date;
	endAt: Date;
	admin: PublicUser | null;
}
