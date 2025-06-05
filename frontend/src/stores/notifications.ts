import { writable } from 'svelte/store';

import type { NotificationMessage } from '../types/notificationMessage';

export const notifications = writable<NotificationMessage[]>([]);

export function updateNotifications(newNotifications: NotificationMessage[]) {
	notifications.set(newNotifications);
}

export function removeNotification(id: string) {
	notifications.update((n) => n.filter((notification) => notification.id !== id));
}
