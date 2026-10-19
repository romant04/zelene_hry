<script lang="ts">
	import type { FetchedMMRs } from './+page';
	import Select from '../components/select.svelte';
	import Winner from './components/winner.svelte';
	import { goto } from '$app/navigation';
	import { i18n, localizeGamePreview, t } from '$lib/i18n';

	const { data }: { data: { data: FetchedMMRs } } = $props();

	let games = $derived(data.data.games.map((game) => localizeGamePreview(game, i18n.locale)));
	let activeGameId = $state(data.data.gameKey || 'all');

	$effect(() => {
		activeGameId = data.data.gameKey || 'all';
	});

	$effect(() => {
		const selected = activeGameId;
		const loaded = data.data.gameKey || 'all';
		if (selected === loaded) return;

		const params = new URLSearchParams();
		if (selected !== 'all') {
			params.set('game', selected);
		}
		const query = params.toString();
		goto(query ? `?${query}` : '?', { replaceState: true, keepFocus: true, noScroll: true });
	});

	let topPlayers = $derived(
		data.data.entries.slice(0, 3).map((entry) => ({
			name: entry.username,
			MMR: entry.mmr
		}))
	);
	let playersToDisplay = $derived(
		data.data.entries.slice(3).map((entry) => ({
			name: entry.username,
			MMR: entry.mmr
		}))
	);
</script>

<svelte:head>
	<title>{t('leaderboard.pageTitle')}</title>
</svelte:head>

<div class="mt-12 flex flex-col justify-center items-center">
	<h1 class="text-3xl sm:text-4xl text-center font-bold font-heading">
		{activeGameId === 'all'
			? t('leaderboard.overall')
			: t('leaderboard.forGame', {
					game: games.find((x) => x.gameId.toString() === activeGameId)?.name ?? ''
				})}
	</h1>
	<Select
		options={[
			{ option: t('leaderboard.allGames'), value: 'all', defaultOption: activeGameId === 'all' },
			...games.map((game) => ({
				option: game.name,
				value: game.gameId.toString(),
				defaultOption: game.gameId.toString() === activeGameId
			}))
		]}
		bind:value={activeGameId}
		styles="mt-5 bg-tertiary-700 py-2 px-4  w-[180px] rounded-sm"
	/>
	<div class="flex gap-x-16 gap-y-2 mt-10 md:mt-16 justify-center flex-wrap px-5">
		{#if topPlayers[1]}
			<Winner name={topPlayers[1].name} position={2} MMR={topPlayers[1].MMR} styles="md:mt-8" />
		{/if}
		{#if topPlayers[0]}
			<Winner name={topPlayers[0].name} position={1} MMR={topPlayers[0].MMR} />
		{/if}
		{#if topPlayers[2]}
			<Winner name={topPlayers[2].name} position={3} MMR={topPlayers[2].MMR} styles="md:mt-12" />
		{/if}
	</div>

	<table class="w-11/12 sm:w-4/5 lg:w-3/5 mt-12 rounded-md overflow-hidden">
		<thead class="bg-primary-500 text-lg">
			<tr>
				<th class="border-r-2 py-1 border-gray-200 w-fit px-2 lg:w-36">{t('leaderboard.position')}</th>
				<th class="border-r-2 border-gray-200 w-max">{t('leaderboard.name')}</th>
				<th class="w-fit lg:w-64 px-2">{t('leaderboard.score')}</th>
			</tr>
		</thead>
		<tbody>
			{#each playersToDisplay as player, index}
				<tr class="text-center bg-tertiary-600">
					<td class="border-r-2 text-lg border-gray-300 py-3 font-bold"
						>#{index + 1 + 3}</td
					>
					<td class="border-r-2 text-lg border-gray-300">{player.name}</td>
					<td class="font-bold">{player.MMR} MMR</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
