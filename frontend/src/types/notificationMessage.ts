import type { User } from './user';

export interface Notification {
	notificationId: string;
	type: string;
	message?: string | null;
	messageKey?: string | null;
	messageParams?: string | null;
	redirectUrl: string;
	user: User;
	isRead: boolean;
	createdAt: Date;
}
