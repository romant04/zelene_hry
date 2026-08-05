<script lang="ts">
	import safetyPin from '../../../../assets/horolezci/safety_pin.svg';

	let {
		playerName,
		distance,
		safetyPins,
		isEnemy
	}: { playerName: string; distance: number; safetyPins: number; isEnemy: boolean } = $props();
</script>

<div
	class="bg-yellow-400 rounded-lg overflow-hidden flex flex-col border-[5px] border-black w-[240px]"
>
	<span class="text-black text-2xl font-bold px-3 py-1 {isEnemy && 'bg-white'}">{playerName}</span
	>

	<div class="flex flex-row">
		<div class="flex flex-row justify-center items-center gap-3 px-6 py-2">
			{#each Array(3) as _, i}
				<img
					src={safetyPin}
					alt={_}
					class={`w-[5px] ${i < safetyPins ? 'opacity-100' : 'opacity-30'}`}
				/>
			{/each}
		</div>

		<div class="bg-teal-300 w-full pr-3 flex items-center justify-end">
			<span class="text-black font-bold text-xl">{distance} m</span>
		</div>
	</div>
</div>
