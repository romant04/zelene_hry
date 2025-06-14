import type { User } from '../types/user';
import type { Chatroom } from '../types/chat';

export function isChatroom(chat: User | Chatroom): chat is Chatroom {
	return 'name' in chat;
}
