import type { User } from './user';

export interface Notification {
	notificationId: string;
	type: string;
	message: string;
	redirectUrl: string;
	user: User;
	isRead: boolean;
	createdAt: Date;
}
