import type { Game, GameCategory, GameInfo, GamePreview } from '../../types/game';
import type { Locale } from './types';

type CatalogGame = {
	code: string;
	name: string;
	perex: string;
	description: string;
	categories: Record<number, string>;
	gameInfo: Record<number, string>;
};

/** English catalog keyed by stable gameId — used when API still returns Czech. */
const enCatalog: Record<number, CatalogGame> = {
	1: {
		code: 'prsi',
		name: 'Prší',
		perex:
			'Play the classic Czech card game Prší and battle your opponent with strategy and quick thinking! The first to get rid of all cards wins!',
		description:
			'Prší is a card game for 2 to 4 players. The goal is to get rid of all your cards as quickly as possible. Players take turns playing cards of the same suit or rank. Special cards like the seven, ace, or jack have unique effects that change the course of the game. The first player to empty their hand wins. The game mixes strategy, luck, and fast decisions.',
		categories: { 2: 'Logic', 3: 'Card' },
		gameInfo: {
			14: '-The main goal is to get rid of all cards in your hand',
			15: '-You can play cards to the center if they share the same suit or rank. Special cards can change this',
			16: '-An ace forces the opponent to also play an ace. If they do not have one, they must pass the turn',
			17: '-A jack (changer) lets you change the active suit. It can be played on any card except an ace or a seven',
			18: '-A seven forces the opponent to also play a seven, otherwise they draw 2 cards. Playing another seven passes the penalty back, stacking by 2 cards up to a maximum of 8 cards with 4 sevens.',
			19: 'There are 3 main elements: the draw pile, cards in hand, and the token',
			20: '-Clicking the draw pile draws a card into your hand',
			21: '-Dragging a card from your hand to the center plays it',
			22: '-If you must respond to an ace but have none, click the token to pass the turn',
			23: '-The token shows the active suit, which can be changed with a jack'
		}
	},
	2: {
		code: 'slovnifotbal',
		name: 'Word Football',
		perex:
			'Compete against your opponent in a game that tests your vocabulary and eyesight. Who can build more words before time runs out?',
		description:
			'Word Football is a one-on-one word game where you form words from random letters. Each word scores points based on its length. Words are checked against a specialized dictionary of Czech nouns in the nominative case. Words not in the dictionary are invalid. Whoever has more points when the timer ends wins.',
		categories: { 1: 'Word game', 2: 'Logic' },
		gameInfo: {
			1: '-The goal is to build as many words as possible before the timer runs out',
			2: '-The total time limit is 3 minutes',
			4: '-Players earn points based on the length of the words they build',
			8: '-The player builds words by connecting letters from the circle with a mouse drag',
			9: '-When the player stops dragging, the formed word is automatically submitted for validation'
		}
	},
	3: {
		code: 'horolezci',
		name: 'Climbers',
		perex:
			'Climbers tests your knowledge of sayings and proverbs. Will you risk it for more points or play it safe? That choice can decide who reaches the summit first.',
		description:
			'Climbers is a two-player word knowledge game. Players fill in a secret phrase by picking letters, each with a point value based on estimated risk. A correct guess moves you up; a wrong one sends you down. The first player to reach the mountain top wins.',
		categories: { 1: 'Word game', 4: 'Tactical' },
		gameInfo: {
			24: '-Players simultaneously try to fill letters from the pyramid into the secret phrase',
			25: '-Each letter is scored by how common it is and where it sits in the pyramid',
			26: '-A wrong letter moves the player down, at most to the ground or the nearest safety point',
			27: '-The first player to reach the summit wins',
			28: '-The player picks letters from the letter pyramid (higher letters are worth more points)',
			29: '-At any time, instead of guessing a letter, the player can place a safety point so they cannot fall below that level'
		}
	}
};

const categoryEnFallback: Record<number, string> = {
	1: 'Word game',
	2: 'Logic',
	3: 'Card',
	4: 'Tactical'
};

const codesById: Record<number, string> = {
	1: 'prsi',
	2: 'slovnifotbal',
	3: 'horolezci'
};

const codesByName: Record<string, string> = {
	prší: 'prsi',
	prsi: 'prsi',
	'slovní fotbal': 'slovnifotbal',
	'slovni fotbal': 'slovnifotbal',
	'word football': 'slovnifotbal',
	horolezci: 'horolezci',
	climbers: 'horolezci'
};

export function resolveGameCode(game: {
	gameId?: number;
	code?: string | null;
	name?: string | null;
}): string {
	if (game.code) {
		const normalized = game.code.toLowerCase();
		if (normalized === 'prsi' || normalized === 'slovnifotbal' || normalized === 'horolezci') {
			return normalized;
		}
	}
	if (game.gameId != null && codesById[game.gameId]) {
		return codesById[game.gameId];
	}
	if (game.name) {
		const byName = codesByName[game.name.trim().toLowerCase()];
		if (byName) return byName;
	}
	return 'slovnifotbal';
}

function localizeCategories(
	categories: GameCategory[],
	catalog: CatalogGame | undefined
): GameCategory[] {
	return categories.map((category) => ({
		...category,
		name:
			catalog?.categories[category.gameCategoryId] ??
			categoryEnFallback[category.gameCategoryId] ??
			category.name
	}));
}

function localizeGameInfo(gameInfo: GameInfo[], catalog: CatalogGame | undefined): GameInfo[] {
	if (!catalog) return gameInfo;
	return gameInfo.map((info) => ({
		...info,
		gameInfo: catalog.gameInfo[info.gameInfoId] ?? info.gameInfo
	}));
}

export function localizeGamePreview(game: GamePreview, locale: Locale): GamePreview {
	const code = resolveGameCode(game);
	if (locale !== 'en') {
		return { ...game, code };
	}

	const catalog = enCatalog[game.gameId];
	if (!catalog) {
		return { ...game, code };
	}

	return {
		...game,
		code: catalog.code,
		name: catalog.name,
		perex: catalog.perex,
		gameCategories: localizeCategories(game.gameCategories, catalog)
	};
}

export function localizeGame(game: Game, locale: Locale): Game {
	const code = resolveGameCode(game);
	if (locale !== 'en') {
		return { ...game, code };
	}

	const catalog = enCatalog[game.gameId];
	if (!catalog) {
		return { ...game, code };
	}

	return {
		...game,
		code: catalog.code,
		name: catalog.name,
		perex: catalog.perex,
		description: catalog.description,
		gameCategories: localizeCategories(game.gameCategories, catalog),
		gameInfo: localizeGameInfo(game.gameInfo ?? [], catalog)
	};
}
