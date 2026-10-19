import type { PublicUser } from './user';
import type { Dm } from './dm';

export interface Chatroom {
	id: number;
	name: string;
	isPublic: boolean;
	users: PublicUser[];
}

export interface ChatMessage {
	messageId: number;
	message: string;
	sentAt: Date;
	chatId: number;
	sender: PublicUser;
}

export type Message = ChatMessage | Dm;
