import type { PublicUser } from './user';

export interface Friendship {
	user1: PublicUser;
	user2: PublicUser;
	startAt: Date;
}
