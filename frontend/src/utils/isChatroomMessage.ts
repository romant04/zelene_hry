import type { ChatMessage, Message } from '../types/chat';

export function isChatroomMessage(message: Message): message is ChatMessage {
	return 'chatId' in message;
}
