<script lang="ts">
	import Select from '../../components/select.svelte';
	import type { Game } from '../../../../types/game';
	import { calculateRank, rankImageMap } from '../../../../utils/rank';
	import type { MMR, PlayerStats } from '../../../../types/user';

	const { games, MMRs, playerStats }: { games: Game[]; MMRs: MMR[]; playerStats: PlayerStats[] } =
		$props();
	let activeGameId = $state(games.length > 0 ? games[0].gameId.toString() : '');

	let activeMMR = $derived.by(
		() => MMRs.find((mmr) => mmr.gameId.toString() === activeGameId)?.mmr || 0
	);
	let rank = $derived.by(() => calculateRank(activeMMR));
	let activePlayerStats = $derived.by(() =>
		playerStats.find((stat) => stat.gameId.toString() === activeGameId)
	);
</script>

<div class="flex flex-col">
	<div class="flex gap-3 lg:gap-6 items-center">
		<h2 class="text-2xl lg:text-3xl font-heading font-bold">Herní statistiky</h2>
		<Select
			options={games.map((game) => ({
				option: game.name,
				value: game.gameId.toString(),
				defaultOption: activeGameId === game.gameId.toString()
			}))}
			bind:value={activeGameId}
			styles="bg-tertiary-700 p-2 rounded-sm w-36 px-3 text-base lg:text-lg"
		></Select>
	</div>

	<div class="flex mt-6 justify-center items-center gap-8 lg:gap-16">
		<img src={rankImageMap(rank)} alt="rank" class="w-40" />

		<div class="flex flex-col gap-4 font-bold text-xl lg:text-2xl">
			{#if activePlayerStats}
				<p>
					{(activePlayerStats.winRatio * 100).toFixed(2)}% winrate
				</p>
				<p>
					{activePlayerStats.gamesPlayed} odehraných her
				</p>
			{/if}
			<p>{activeMMR} MMR</p>
		</div>
	</div>
</div>
