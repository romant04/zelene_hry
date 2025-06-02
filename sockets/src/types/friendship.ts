import type { User } from './user';

export interface Friendship {
	user1: User;
	user2: User;
	startAt: Date;
}
