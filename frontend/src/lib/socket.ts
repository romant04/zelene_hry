import { io } from 'socket.io-client';

const SERVER_URL = 'http://localhost:3000';

export const createChatSocket = (userId: number, friendId: number) => {
	return io(`${SERVER_URL}/chat`, {
		auth: { userId, friendId }
	});
};
