import { io } from 'socket.io-client';
import { WEBSOCKET } from '../constants/urls';
import type { PublicUser, User } from '../types/user';
import type { Locale } from './i18n';

export const createChatSocket = (userId: number, friendId: number) => {
	return io(`${WEBSOCKET}/chat`, {
		auth: { userId, friendId }
	});
};

export const createChatroomSocket = (
	user: User | PublicUser,
	chatId: number,
	users: PublicUser[]
) => {
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

// Language decides the queue, players of different languages are never matched together
export const createMatchmakingSocket = (user: User, gameId: number, language: Locale) => {
	return io(`${WEBSOCKET}/matchmaking`, {
		auth: { user, gameId, language }
	});
};

export const createFriendChallengeSocket = (
	user: User,
	queueCode: string,
	gameId: number,
	language: Locale
) => {
	return io(`${WEBSOCKET}/friend-challenge`, {
		auth: { user, queueCode, gameId, language }
	});
};

export const createPrsiSocket = (token: string, gameId: string) => {
	return io(`${WEBSOCKET}/prsi`, {
		auth: { token, gameId }
	});
};
export const createSlovniFotbalSocket = (token: string, gameId: string) => {
	return io(`${WEBSOCKET}/slovniFotbal`, {
		auth: { token, gameId }
	});
};
export const createHorolezciSocket = (token: string, gameId: string) => {
	return io(`${WEBSOCKET}/horolezci`, {
		auth: { token, gameId }
	});
};
