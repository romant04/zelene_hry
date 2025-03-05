import type { User } from './user';

export interface FriendRequest {
	sender: User;
	receiver: User;
	message: string;
	sentAt: Date;
}
