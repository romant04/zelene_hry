import type { TranslateFn } from '$lib/i18n';

export function getGameInfoTypeLabel(type: string, t: TranslateFn): string {
	const map: Record<string, string> = {
		CONTROL: t('gameDetail.controls'),
		GENERAL: t('gameDetail.principle')
	};

	return map[type] ?? type;
}
