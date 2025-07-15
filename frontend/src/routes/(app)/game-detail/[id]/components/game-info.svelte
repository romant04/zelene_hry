<script lang="ts">
	import { type Game, GameInfoType } from '../../../../../types/game';
	import { GameInfoTypeMap } from '../../../../../utils/GameInfoTypeMap';
	import { blur } from 'svelte/transition';

	let { game }: { game: Game } = $props();

	let activeTab = $state<GameInfoType>(GameInfoType.CONTROL);

	function swapTab(type: string) {
		activeTab = type as GameInfoType;
	}
</script>

<div class="flex flex-col gap-3 w-[min(50rem,100%)]">
	<h3 class="text-4xl font-semibold font-heading mb-2">Ovládání a princip hry</h3>
	<div class="flex gap-3 bg-tertiary-700 rounded-md px-4 py-3">
		{#each Object.keys(GameInfoType) as type}
			<button
				class="px-3 py-1 rounded-md font-semibold {activeTab === type
					? 'bg-primary-500'
					: 'bg-tertiary-500'}"
				onclick={() => swapTab(type)}
			>
				{GameInfoTypeMap[type]}
			</button>
		{/each}
	</div>

	<div class="bg-tertiary-700 rounded-md px-5 pb-4 pt-3 h-[21.25rem] overflow-auto">
		{#if activeTab === GameInfoType.CONTROL}
			<div in:blur>
				<h4 class="text-xl mb-2 font-semibold">Ovládání</h4>
				{#each game.gameInfo
					.filter((info) => info.infoLabel === 'CONTROL')
					.sort((a, b) => a.gameInfoId - b.gameInfoId) as info}
					{#each info.gameInfo.split('\n') as line}
						{#if line.includes('-')}
							<p class="flex items-center gap-4">
								<span class="block bg-white w-[5px] h-[5px] rounded-full"></span>
								{info.gameInfo.slice(1)}
							</p>
						{:else}
							<p class="mt-2 font-bold">{info.gameInfo}</p>
						{/if}
					{/each}
				{/each}
			</div>
		{:else if activeTab === GameInfoType.GENERAL}
			<div in:blur>
				<h4 class="text-xl mb-2 font-semibold">Princip hry</h4>
				{#each game.gameInfo
					.filter((info) => info.infoLabel === 'GENERAL')
					.sort((a, b) => a.gameInfoId - b.gameInfoId) as info}
					{#each info.gameInfo.split('\n') as line}
						{#if line.includes('-')}
							<p class="flex items-center gap-4">
								<span class="block bg-white w-[5px] h-[5px] rounded-full"></span>
								{info.gameInfo.slice(1)}
							</p>
						{/if}
					{/each}
				{/each}
			</div>
		{/if}
	</div>
</div>
