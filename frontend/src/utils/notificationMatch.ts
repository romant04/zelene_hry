import type { Notification } from '../types/notificationMessage';

function getParam(notification: Notification, key: string): string | null {
	if (!notification.messageParams) return null;
	try {
		const params = JSON.parse(notification.messageParams) as Record<string, unknown>;
		const value = params[key];
		return typeof value === 'string' ? value : value != null ? String(value) : null;
	} catch {
		return null;
	}
}

export function isDmNotificationForUser(notification: Notification, username: string): boolean {
	if (notification.redirectUrl !== '/chat/dms') return false;

	const paramUsername = getParam(notification, 'username');
	if (paramUsername != null) {
		return paramUsername === username;
	}

	return notification.message?.includes(username) ?? false;
}

export function isChatroomNotificationForRoom(notification: Notification, roomName: string): boolean {
	if (notification.redirectUrl !== '/chat/rooms') return false;

	const paramRoom = getParam(notification, 'room');
	if (paramRoom != null) {
		return paramRoom === roomName;
	}

	return notification.message?.includes(roomName) ?? false;
}
