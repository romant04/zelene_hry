import { browser } from '$app/environment';
import { error, redirect } from '@sveltejs/kit';
import { get } from 'svelte/store';
import { API } from '../../../constants/urls';
import { mmrCache, type LeaderboardEntry } from '$lib/cache/mmr';
import type { Game } from '../../../types/game';
import { acceptLanguageHeaders, localizePath, type Locale } from '$lib/i18n';

const CACHE_DURATION = 300000;
const LEADERBOARD_LIMIT = 10;

export interface FetchedMMRs {
	games: Game[];
	entries: LeaderboardEntry[];
	gameKey: string;
}

async function fetchLeaderboard(
	fetchFn: typeof fetch,
	headers: HeadersInit,
	gameKey: string
): Promise<LeaderboardEntry[]> {
	const params = new URLSearchParams({ limit: String(LEADERBOARD_LIMIT) });
	if (gameKey !== 'all') {
		params.set('gameId', gameKey);
	}
	const res = await fetchFn(`${API}/api/secured/mmr/leaderboard?${params}`, { headers });
	if (!res.ok) {
		throw new Error('Failed to load leaderboard');
	}
	return (await res.json()) as LeaderboardEntry[];
}

export const load = async ({ fetch, data, parent, url }) => {
	const token = data?.token || (browser ? localStorage.getItem('token') : null);
	const { locale } = (await parent()) as { locale: Locale };

	if (!token) {
		throw redirect(303, localizePath('/login', locale));
	}

	const gameKey = url.searchParams.get('game') || 'all';
	const headers = {
		Authorization: `Bearer ${token}`,
		...acceptLanguageHeaders(locale)
	};

	if (browser) {
		const cache = get(mmrCache);
		const gamesFresh =
			cache.games.length > 0 && Date.now() - cache.gamesFetched < CACHE_DURATION;
		const boardFresh =
			cache.leaderboards[gameKey] &&
			Date.now() - (cache.leaderboardFetched[gameKey] ?? 0) < CACHE_DURATION;

		if (gamesFresh && boardFresh) {
			return {
				data: {
					games: cache.games,
					entries: cache.leaderboards[gameKey],
					gameKey
				} satisfies FetchedMMRs
			};
		}

		try {
			let games = cache.games;
			if (!gamesFresh) {
				games = (await fetch(`${API}/api/games`, { headers }).then((res) =>
					res.json()
				)) as Game[];
			}

			let entries = cache.leaderboards[gameKey];
			if (!boardFresh) {
				entries = await fetchLeaderboard(fetch, headers, gameKey);
			}

			mmrCache.update((current) => ({
				games,
				gamesFetched: gamesFresh ? current.gamesFetched : Date.now(),
				leaderboards: { ...current.leaderboards, [gameKey]: entries },
				leaderboardFetched: {
					...current.leaderboardFetched,
					[gameKey]: boardFresh ? current.leaderboardFetched[gameKey] : Date.now()
				}
			}));

			return { data: { games, entries, gameKey } satisfies FetchedMMRs };
		} catch (err) {
			console.error('Error fetching MMR data:', err);
			throw error(500, 'Failed to load MMR data');
		}
	}

	try {
		const [games, entries] = await Promise.all([
			fetch(`${API}/api/games`, { headers }).then((res) => res.json()) as Promise<Game[]>,
			fetchLeaderboard(fetch, headers, gameKey)
		]);

		return { data: { games, entries, gameKey } satisfies FetchedMMRs };
	} catch (err) {
		console.error('Error fetching MMR data:', err);
		throw error(500, 'Failed to load MMR data');
	}
};
