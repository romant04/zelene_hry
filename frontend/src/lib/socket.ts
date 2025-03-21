import { io } from 'socket.io-client';
import { WEBSOCKET } from "../constants/urls";

export const createChatSocket = (userId: number, friendId: number) => {
	return io(`${WEBSOCKET}/chat`, {
		auth: { userId, friendId }
	});
};
