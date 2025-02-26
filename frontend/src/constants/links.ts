import type { Link } from '../types/link';

export const headerLinks: Link[] = [
	{
		href: '/#hry',
		text: 'Hry',
		target: '_self'
	},
	{
		href: '#',
		text: 'Chat',
		target: '_self'
	},
	{
		href: '/pratele',
		text: 'Přátelé',
		target: '_self'
	},
	{
		href: '/zebricek',
		text: 'Žebříček',
		target: '_self'
	}
];

export const userMenuLinks: Link[] = [
	{
		href: '/profil',
		text: 'Můj účet',
		target: '_self'
	},
	{
		href: '/pratele',
		text: 'Přátelé',
		target: '_self'
	}
];
