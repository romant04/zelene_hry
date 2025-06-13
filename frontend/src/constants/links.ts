import type { Link } from '../types/link';

export const headerLinks: Link[] = [
	{
		href: '/#hry',
		text: 'Hry'
	},
	{
		href: '/chat',
		text: 'Chat',
		sublinks: [
			{
				href: '/chat/rooms',
				text: 'Chatovací místnosti'
			},
			{
				href: '/chat/dms',
				text: 'Soukromé zprávy'
			}
		]
	},
	{
		href: '/pratele',
		text: 'Přátelé'
	},
	{
		href: '/zebricek',
		text: 'Žebříček'
	}
];

export const userMenuLinks: Link[] = [
	{
		href: '/profil',
		text: 'Můj účet'
	},
	{
		href: '/pratele',
		text: 'Přátelé'
	}
];
