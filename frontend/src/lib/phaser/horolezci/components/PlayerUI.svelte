<script lang="ts">
	import safetyPin from '../../../../assets/horolezci/safety_pin.svg';
	import { horolezciStats } from '../../../../stores/horolezci/stats';

	let { playerName, isEnemy }: { playerName: string; isEnemy: boolean } = $props();

	let distance = $state(0);
	let safetyPins = $state(3);

	$effect(() => {
		const stats = $horolezciStats;
		if (!stats) return;

		if (isEnemy) {
			distance = stats.enemy.distanceTraveled;
			safetyPins = stats.enemy.safetyPins;
		} else {
			distance = stats.player.distanceTraveled;
			safetyPins = stats.player.safetyPins;
		}
	});
</script>

<div
	class="bg-yellow-400 rounded-lg overflow-hidden flex flex-col border-[3px] lg:border-[5px] border-black w-[160px] lg:w-[240px]"
>
	<span
		class="text-black text-base lg:text-2xl font-bold px-2 lg:px-3 py-0.5 lg:py-1 truncate {isEnemy &&
			'bg-white'}">{playerName}</span
	>

	<div class="flex flex-row">
		<div
			class="flex flex-row justify-center items-center gap-2 lg:gap-3 px-3 lg:px-6 py-1 lg:py-2"
		>
			{#each Array(2) as _, i}
				<img
					src={safetyPin}
					alt={_}
					class={`w-[5px] ${i < safetyPins ? 'opacity-100' : 'opacity-30'}`}
				/>
			{/each}
		</div>

		<div class="bg-teal-300 w-full pr-2 lg:pr-3 flex items-center justify-end">
			<span class="text-black font-bold text-sm lg:text-xl">{distance} m</span>
		</div>
	</div>
</div>
