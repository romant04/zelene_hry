import type { TranslateFn } from '$lib/i18n';
import type { Link } from '../types/link';

export function getHeaderLinks(t: TranslateFn): Link[] {
	return [
		{
			href: '/#hry',
			text: t('nav.games')
		},
		{
			href: '/chat',
			text: t('nav.chat'),
			sublinks: [
				{
					href: '/chat/rooms',
					text: t('nav.chatRooms')
				},
				{
					href: '/chat/dms',
					text: t('nav.privateMessages')
				}
			]
		},
		{
			href: '/pratele',
			text: t('nav.friends')
		},
		{
			href: '/zebricek',
			text: t('nav.leaderboard')
		}
	];
}

export function getUserMenuLinks(t: TranslateFn): Link[] {
	return [
		{
			href: '/profil',
			text: t('nav.myAccount')
		},
		{
			href: '/pratele',
			text: t('nav.friends')
		}
	];
}
