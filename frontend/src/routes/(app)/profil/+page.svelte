<script lang="ts">
	import type { FetchedProfile } from './+page';
	import ProfileInfo from './components/profile-info.svelte';
	import PieChart from './components/pie-chart.svelte';
	import GameStats from './components/game-stats.svelte';

	const { data }: { data: { data: FetchedProfile } } = $props();

	const pieChartData = $derived.by(() => {
		if (!data.data.user.player) return [];
		return data.data.user.player.playerStats.map((stat) => ({
			label: data.data.games.find((game) => game.gameId === stat.gameId)?.name || 'Unknown',
			mins: stat.playTimeMinutes
		}));
	});
</script>

<div
	class="flex flex-col-reverse xl:flex-row justify-between items-center gap-16 xl:items-start mt-16 w-11/12 lg:w-4/5 m-auto"
>
	<div class="flex flex-col md:flex-row xl:flex-col gap-16">
		<ProfileInfo user={data.data.user} />
		{#if data.data.user.player}
			<GameStats
				games={data.data.games}
				MMRs={data.data.user.player.mmr}
				playerStats={data.data.user.player.playerStats}
			/>
		{/if}
	</div>
	{#if data.data.user.player}
		<PieChart data={pieChartData} />
	{/if}
</div>
