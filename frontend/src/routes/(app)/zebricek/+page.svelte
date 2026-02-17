<script lang="ts">
	import type { FetchedMMRs } from './+page';
	import Select from '../components/select.svelte';
	import Winner from './components/winner.svelte';

	const { data }: { data: { data: FetchedMMRs } } = $props();

	let activeGameId = $state('all');

	function getTopPlayersByGame(gameId: string, amount: number) {
		if (gameId === 'all') {
			const summedMMRsOfPlayer = data.data.MMRs.reduce(
				(acc, mmr) => {
					if (!acc[mmr.userId]) {
						acc[mmr.userId] = 0;
					}
					acc[mmr.userId] += mmr.mmr;
					return acc;
				},
				{} as Record<number, number>
			);
			const sortedPlayers = Object.entries(summedMMRsOfPlayer)
				.sort(([, mmrA], [, mmrB]) => mmrB - mmrA)
				.slice(0, amount)
				.map(([userId, mmr]) => {
					const user = data.data.users.find(
						(user) => user.player?.id === parseInt(userId)
					);
					return { name: user ? user.username : 'Unknown', MMR: mmr };
				});
			return sortedPlayers;
		}

		const filteredMMRs =
			gameId === 'all'
				? data.data.MMRs
				: data.data.MMRs.filter((mmr) => mmr.gameId.toString() === gameId);
		const sortedMMRs = filteredMMRs.sort((a, b) => b.mmr - a.mmr);
		return sortedMMRs.slice(0, amount).map((mmr) => {
			const user = data.data.users.find((user) => user.player?.id === mmr.userId);
			return { name: user ? user.username : 'Unknown', MMR: mmr.mmr };
		});
	}
	let topPlayers = $derived.by(() => getTopPlayersByGame(activeGameId, 3));
	let playersToDisplay = $derived(getTopPlayersByGame(activeGameId, 10).slice(3));
</script>

<svelte:head>
	<title>Duelovky | Žebříček</title>
</svelte:head>

<div class="mt-12 flex flex-col justify-center items-center">
	<h1 class="text-3xl sm:text-4xl text-center font-bold font-heading">
		{activeGameId === 'all'
			? 'Žebříček celkově nejlepších hráčů'
			: `Žebříček nejlepších hráčů ${data.data.games.find((x) => x.gameId.toString() === activeGameId)?.name}`}
	</h1>
	<Select
		options={[
			{ option: 'Všechny hry', value: 'all', defaultOption: activeGameId === 'all' },
			...data.data.games.map((game) => ({
				option: game.name,
				value: game.gameId.toString(),
				defaultOption: game.gameId.toString() === activeGameId
			}))
		]}
		bind:value={activeGameId}
		styles="mt-5 bg-tertiary-700 py-2 px-4  w-[180px] rounded-sm"
	/>
	<div class="flex gap-x-16 gap-y-2 mt-10 md:mt-16 justify-center flex-wrap px-5">
		<Winner name={topPlayers[1].name} position={2} MMR={topPlayers[1].MMR} styles="md:mt-8" />
		<Winner name={topPlayers[0].name} position={1} MMR={topPlayers[0].MMR} />
		<Winner name={topPlayers[2].name} position={3} MMR={topPlayers[2].MMR} styles="md:mt-12" />
	</div>

	<table class="w-11/12 sm:w-4/5 lg:w-3/5 mt-12 rounded-md overflow-hidden">
		<thead class="bg-primary-500 text-lg">
			<tr>
				<th class="border-r-2 py-1 border-gray-200 w-fit px-2 lg:w-36">Pozice</th>
				<th class="border-r-2 border-gray-200 w-max">Jméno</th>
				<th class="w-fit lg:w-64 px-2">Skóre</th>
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
