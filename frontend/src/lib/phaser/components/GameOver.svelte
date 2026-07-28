<script lang="ts">
	import { gameOver, toggleGameOverOff } from '../../../stores/gameGeneral/game-over';
	import { profileCache } from '$lib/cache/profile.js';
	import { mmrCache } from '$lib/cache/mmr.js';
	import { goto } from '$app/navigation';

	$effect(() => {
		console.log('Game over state changed:', $gameOver);
	});

	function handleRedirect() {
		toggleGameOverOff();
		profileCache.clear();
		mmrCache.clear();
		goto('/');
	}
</script>

{#if $gameOver.gameOver}
	<div
		class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center px-5"
	>
		<div class="bg-black/70 text-white text-center px-8 py-12 min-w-[32rem] rounded-md">
			<h2 class="text-5xl font-bold mb-5">Konec hry</h2>
			{#if $gameOver.winner === 'Remíza'}
				<p class="text-2xl mt-3 mb-5 font-semibold">Remíza</p>
			{:else}
				<p class="text-2xl mt-3 mb-5 font-semibold">Vyhrává {$gameOver.winner}</p>
			{/if}
			<button
				onclick={handleRedirect}
				class="button variant-filled-primary rounded-sm px-3 py-1 text-lg"
				>Vrátit se na hlavní stránku</button
			>
		</div>
	</div>
{/if}
