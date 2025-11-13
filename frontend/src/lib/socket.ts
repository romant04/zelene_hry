import { io } from 'socket.io-client';
import { WEBSOCKET } from '../constants/urls';
import type { User } from '../types/user';

export const createChatSocket = (userId: number, friendId: number) => {
	return io(`${WEBSOCKET}/chat`, {
		auth: { userId, friendId }
	});
};

export const createChatroomSocket = (user: User, chatId: number, users: User[]) => {
	return io(`${WEBSOCKET}/chatroom`, {
		auth: { user, chatId, users }
	});
};

export const createFriendsSocket = (userId: number) => {
	return io(`${WEBSOCKET}/friends`, {
		auth: { userId }
	});
};

export const createNotificationSocket = (userId: number) => {
	return io(`${WEBSOCKET}/notification`, {
		auth: { userId }
	});
};

export const createMatchmakingSocket = (user: User, gameId: number) => {
	return io(`${WEBSOCKET}/matchmaking`, {
		auth: { user, gameId }
	});
};

export const createFriendChallengeSocket = (user: User, queueCode: string, gameId: number) => {
	return io(`${WEBSOCKET}/friend-challenge`, {
		auth: { user, queueCode, gameId }
	});
};

export const createPrsiSocket = (token: string, gameId: string) => {
	return io(`${WEBSOCKET}/prsi`, {
		auth: { token, gameId }
	});
};
