import { writable } from 'svelte/store';

import type { Notification } from '../types/notificationMessage';

export const notifications = writable<Notification[]>([]);

export function updateNotifications(newNotifications: Notification[]) {
	notifications.set(newNotifications);
}

export function removeNotification(id: string) {
	notifications.update((n) => n.filter((notification) => notification.notificationId !== id));
}
