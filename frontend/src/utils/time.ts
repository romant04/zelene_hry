export function convertTimeToBestFormat(minutes: number) {
	const d = Math.floor(minutes / (60 * 24));
	const h = Math.floor((minutes % (60 * 24)) / 60);
	const m = minutes % 60;

	const parts = [d > 0 && `${d}d`, h > 0 && `${h}h`, m > 0 && `${m}m`];

	return parts.filter(Boolean).join(' ') || '';
}
