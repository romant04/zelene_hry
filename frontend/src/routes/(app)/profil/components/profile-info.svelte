<script lang="ts">
	import type { MMR, PlayerStats, User } from '../../../../types/user';
	import { convertTimeToBestFormat } from '../../../../utils/time';

	const { user }: { user: User } = $props();

	function getSumOfPlayedTime(playerStats: PlayerStats[]) {
		return convertTimeToBestFormat(
			playerStats.reduce((sum, stat) => sum + stat.playTimeMinutes, 0)
		);
	}

	function getSumOfMMR(mmrs: MMR[]) {
		return mmrs.reduce((sum, mmr) => sum + mmr.mmr, 0);
	}
</script>

<svelte:head>
	<title>Duelovky | Můj profil</title>
</svelte:head>

<div class="flex gap-10">
	<div
		class="rounded-full w-28 h-28 lg:w-32 lg:h-32 bg-primary-400 uppercase font-bold text-4xl lg:text-5xl flex justify-center items-center"
	>
		{user.username.slice(0, 2)}
	</div>

	<div class="flex flex-col gap-3">
		<h2 class="text-3xl lg:text-4xl font-bold">{user.username}</h2>
		<div class="flex flex-col gap-1">
			<p>Role: <span class="font-semibold">{user.player ? 'Player' : 'Admin'}</span></p>
			{#if user.player}
				<p>
					Odehraný čas: <span class="font-semibold"
						>{getSumOfPlayedTime(user.player.playerStats) === ''
							? '0m'
							: getSumOfPlayedTime(user.player.playerStats)}</span
					>
				</p>
				<p>
					Celkové MMR: <span class="font-semibold"
						>{getSumOfMMR(user.player.mmr)} MMR</span
					>
				</p>
			{/if}

			{#if user.admin}
				<p>Level oprávnění: <span class="font-bold">{user.admin.permissionLevel}</span></p>
			{/if}
		</div>
	</div>
</div>
