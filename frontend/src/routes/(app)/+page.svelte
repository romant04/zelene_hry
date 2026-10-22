<script lang="ts">
	import HpHero from './components/hp-hero.svelte';
	import GameCard from './components/game-card.svelte';
	import type { PageProps } from '../../../.svelte-kit/types/src/routes/(app)/$types';
	import type { GamePreview } from '../../types/game';
	import { i18n, localizeGamePreview, localizeHref, t } from '$lib/i18n';
	import { getGameImage } from '../../utils/gameAssets';
	import Seo from '$lib/seo/Seo.svelte';
	import { SITE_URL } from '../../constants/urls';

	let { data }: PageProps = $props();

	let games = $derived(
		(data.data?.games ?? []).map((game: GamePreview) => localizeGamePreview(game, i18n.locale))
	);

	let jsonLd = $derived([
		{
			'@context': 'https://schema.org',
			'@type': 'WebSite',
			name: 'Duelovky',
			url: SITE_URL + localizeHref('/'),
			inLanguage: i18n.locale
		},
		{
			'@context': 'https://schema.org',
			'@type': 'ItemList',
			itemListElement: games.map((game: GamePreview, index: number) => ({
				'@type': 'ListItem',
				position: index + 1,
				name: game.name,
				url: SITE_URL + localizeHref(`/game-detail/${game.gameId}`)
			}))
		}
	]);
</script>

<Seo
	title={t('seo.homeTitle')}
	description={t('seo.homeDescription')}
	image={getGameImage('slovnifotbal')}
	{jsonLd}
/>

<div class="h-full">
	<HpHero />
	<div class="container mx-auto pt-24" id="hry">
		<div class="flex flex-col gap-1">
			<h2 class="font-heading text-4xl md:text-5xl font-semibold tracking-wide">
				{t('home.onlineGames')}
			</h2>
			<p class="text-lg md:text-[24px] leading-tight md:leading-[32px] mt-2">
				{@html t('home.onlineGamesDescription')}
			</p>
		</div>

		<div
			class="mt-8 grid grid-cols-1 justify-items-center gap-10 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
		>
			{#each games as game}
				<GameCard
					image={getGameImage(game)}
					id={game.gameId}
					perex={game.perex}
					title={game.name}
					categories={game.gameCategories.map((category) => category.name)}
				/>
			{/each}
		</div>
	</div>
</div>
