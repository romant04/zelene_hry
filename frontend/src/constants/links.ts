import { localizeHref } from '$lib/i18n';
import type { TranslateFn } from '$lib/i18n';
import type { Link } from '../types/link';

export function getHeaderLinks(t: TranslateFn): Link[] {
	return [
		{
			href: localizeHref('/#hry'),
			text: t('nav.games')
		},
		{
			href: localizeHref('/chat'),
			text: t('nav.chat'),
			sublinks: [
				{
					href: localizeHref('/chat/rooms'),
					text: t('nav.chatRooms')
				},
				{
					href: localizeHref('/chat/dms'),
					text: t('nav.privateMessages')
				}
			]
		},
		{
			href: localizeHref('/pratele'),
			text: t('nav.friends')
		},
		{
			href: localizeHref('/zebricek'),
			text: t('nav.leaderboard')
		}
	];
}

export function getUserMenuLinks(t: TranslateFn): Link[] {
	return [
		{
			href: localizeHref('/profil'),
			text: t('nav.myAccount')
		},
		{
			href: localizeHref('/pratele'),
			text: t('nav.friends')
		}
	];
}
