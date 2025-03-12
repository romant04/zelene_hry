import type { Socket } from 'socket.io-client';

export function clearSocket(socket: Socket) {
	socket.disconnect();
	socket.removeAllListeners();
}
