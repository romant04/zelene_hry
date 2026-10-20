<script lang="ts">
	import Icon from '@iconify/svelte';
	import { volume } from '../../../stores/gameGeneral/volume.js';

	function handleVolumeChange(event: Event) {
		const target = event.target as HTMLInputElement;
		const newVolume = parseInt(target.value);
		volume.set(newVolume);
	}

	// Touch screens have no hover, so the slider can also be toggled by tapping the icon
	let open = $state(false);
</script>

<div class="fixed bottom-4 left-4 lg:bottom-10 lg:left-10 flex flex-col items-center gap-2 group">
	<input
		class="volume-slider transition-all duration-200 group-hover:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-0 {open
			? 'opacity-100 pointer-events-auto translate-y-0'
			: 'opacity-0 pointer-events-none translate-y-2'}"
		oninput={handleVolumeChange}
		type="range"
		min="0"
		max="200"
		value="100"
	/>

	<button
		onclick={() => (open = !open)}
		class="flex justify-center items-center p-3 lg:p-4 bg-black/80 rounded-full"
		aria-label="Volume"
	>
		<Icon
			icon="material-symbols:volume-up"
			class="w-6 h-6 lg:w-8 lg:h-8 text-white cursor-pointer"
		/>
	</button>
</div>

<style>
	/* Volume Slider */
	.volume-slider {
		-webkit-appearance: none;
		appearance: none;
		height: 180px;
		width: 9px;
		border-radius: 999px;
		outline: none;
		cursor: pointer;
		writing-mode: vertical-rl;
		direction: rtl;

		background: linear-gradient(to bottom, #424242, #2c2c2c);

		border: none;
		box-shadow:
			inset 0 2px 4px rgba(0, 0, 0, 0.5),
			0 1px 1px rgba(255, 255, 255, 0.05);

		transition: all 0.2s ease;
	}

	.volume-slider:hover {
		filter: brightness(1.1);
	}

	/* Chrome / Edge / Safari */
	.volume-slider::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;

		width: 18px;
		height: 18px;
		border-radius: 50%;

		background: radial-gradient(circle at 30% 30%, #373737, #101010);
		border: 1px solid #fff;

		box-shadow:
			0 2px 6px rgba(0, 0, 0, 0.6),
			inset 0 1px 1px rgba(255, 255, 255, 0.25);

		transition:
			transform 0.15s ease,
			box-shadow 0.15s ease;
	}

	.volume-slider::-webkit-slider-thumb:hover {
		transform: scale(1.12);
		box-shadow:
			0 0 10px rgba(255, 255, 255, 0.25),
			0 2px 8px rgba(0, 0, 0, 0.6);
	}

	.volume-slider:active::-webkit-slider-thumb {
		transform: scale(0.95);
	}

	/* Firefox */
	.volume-slider::-moz-range-track {
		height: 8px;
		border-radius: 999px;
		background: linear-gradient(#555, #3d3d3d);
		border: 1px solid #5a5a5a;
	}

	.volume-slider::-moz-range-thumb {
		width: 18px;
		height: 18px;
		border-radius: 50%;
		border: 2px solid #666;
		background: radial-gradient(circle at 30% 30%, #d0d0d0, #888);
		box-shadow:
			0 2px 6px rgba(0, 0, 0, 0.6),
			inset 0 1px 1px rgba(255, 255, 255, 0.25);
		cursor: pointer;
	}
</style>
