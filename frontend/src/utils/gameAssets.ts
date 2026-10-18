import slovniFotbal from '../assets/images/slovni-fotbal.webp';
import prsi from '../assets/images/prsi.webp';
import horolezci from '../assets/images/horolezci.webp';
import { resolveGameCode } from '$lib/i18n/catalog';

const imagesByCode: Record<string, string> = {
	slovnifotbal: slovniFotbal,
	prsi: prsi,
	horolezci: horolezci
};

export function getGameImage(gameOrCode: string | { gameId?: number; code?: string | null; name?: string | null }): string {
	const code = typeof gameOrCode === 'string' ? gameOrCode : resolveGameCode(gameOrCode);
	return imagesByCode[code] ?? slovniFotbal;
}
