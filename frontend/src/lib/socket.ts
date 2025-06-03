import { io } from 'socket.io-client';
import { WEBSOCKET } from '../constants/urls';

export const createChatSocket = (userId: number, friendId: number) => {
	return io(`${WEBSOCKET}/chat`, {
		auth: { userId, friendId }
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
