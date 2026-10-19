import type { PublicUser, User } from '../types/user';
import type { Chatroom } from '../types/chat';

export function isChatroom(chat: PublicUser | User | Chatroom): chat is Chatroom {
	return 'name' in chat;
}
