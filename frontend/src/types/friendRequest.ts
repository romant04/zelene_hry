import type { PublicUser } from './user';

export interface FriendRequest {
	sender: PublicUser;
	receiver: PublicUser;
	message: string;
	sentAt: Date;
}
