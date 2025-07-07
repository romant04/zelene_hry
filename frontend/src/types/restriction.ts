import type { User } from './user';

export interface Restriction {
	chatId: number;
	userId: number;
	reason: string;
	startAt: Date;
	endAt: Date;
	admin: User;
}
