<script lang="ts">
	import HpHero from './components/hp-hero.svelte';
	import slovniFotbal from '../../assets/images/slovni-fotbal.webp';
	import prsi from '../../assets/images/prsi.webp';
	import horolezci from '../../assets/images/horolezci.webp';
	import GameCard from './components/game-card.svelte';
	import type { PageProps } from '../../../.svelte-kit/types/src/routes/(app)/$types';
	import type { GamePreview } from '../../types/game';

	let { data }: PageProps = $props();

	let games = $state<GamePreview[]>([]);
	const images = {
		slovniFotbal: slovniFotbal,
		prsi: prsi,
		horolezci: horolezci
	};

	$effect(() => {
		if (!data.data) {
			return;
		}

		games = data.data.games;
	});
</script>

<svelte:head>
	<title>Duelovky</title>
	<meta
		name="description"
		content="Chceš si zahrát klasícké 1v1 online hry jako Horolezci, Prší nebo Slovní fotbal. Tady je najdeš všechny na jednom místě"
	/>
</svelte:head>

<div class="h-full">
	<HpHero />
	<div class="container mx-auto pt-24" id="hry">
		<div class="flex flex-col gap-1">
			<h2 class="font-heading text-4xl md:text-5xl font-semibold tracking-wide">
				Online hry
			</h2>
			<p class="text-lg md:text-[24px] leading-tight md:leading-[32px]">
				Hrej online proti ostatním lidem a nebo vyzvi své <br />
				kamarády na duel
			</p>
		</div>

		<div
			class="mt-8 grid grid-cols-1 justify-items-center gap-10 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
		>
			{#each games as game}
				<!-- TODO: This is not ideal solution, change after setting up saving images in db -->
				{@const image =
					game.name === 'Horolezci'
						? images.horolezci
						: game.name === 'Prší'
							? images.prsi
							: images.slovniFotbal}
				<GameCard
					{image}
					id={game.gameId}
					perex={game.perex}
					title={game.name}
					categories={game.gameCategories.map((category) => category.name)}
				/>
			{/each}
		</div>
	</div>
</div>
