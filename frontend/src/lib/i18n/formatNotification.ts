import type { Notification } from '../../types/notificationMessage';
import type { TranslateFn, TranslationKey } from './types';

export function formatNotificationMessage(
	notification: Notification,
	translateFn: TranslateFn
): string {
	if (notification.messageKey) {
		let params: Record<string, string | number> = {};
		if (notification.messageParams) {
			try {
				params = JSON.parse(notification.messageParams) as Record<string, string | number>;
			} catch {
				params = {};
			}
		}
		return translateFn(notification.messageKey as TranslationKey, params);
	}

	return notification.message ?? '';
}
