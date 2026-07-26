<script lang="ts">
	import { disconnect } from '../../../stores/gameGeneral/disconnect.js';
	import { goto } from '$app/navigation';

	let timer = $state<number | null>(null);
	let timeRemaining = $state(30);

	$effect(() => {
		if ($disconnect.disconnect && !timer) {
			timer = window.setInterval(() => {
				timeRemaining--;
				if (timeRemaining <= 0 && $disconnect.disconnect) {
					clearInterval(timer!);
					timer = null;
					$disconnect.disconnect = false;
					goto('/');
				}
			}, 1000);
		} else if (!$disconnect.disconnect && timer) {
			clearInterval(timer!);
			timer = null;
			timeRemaining = 30;
		}
	});
</script>

{#if $disconnect.disconnect}
	<div
		class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center px-5"
	>
		<div
			class="bg-tertiary-700 text-white text-center px-5 pt-10 pb-7 w-[20rem] md:w-[32rem] rounded-md"
		>
			<h2 class="text-3xl font-semibold">
				Váš protihráč se odpojil, pokud se nepřipojí do 30s, hra bude ukončena.
			</h2>
			<p class="text-xl mt-8">Zbývá ještě {timeRemaining}s</p>
		</div>
	</div>
{/if}
