import type { User } from './user';
import type { Dm } from './dm';

export interface Chatroom {
	id: number;
	name: string;
	isPublic: boolean;
	users: User[];
}

export interface ChatMessage {
	messageId: number;
	message: string;
	sentAt: Date;
	chatId: number;
	sender: User;
}

export type Message = ChatMessage | Dm;
