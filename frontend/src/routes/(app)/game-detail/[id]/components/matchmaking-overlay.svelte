<script lang="ts">
	import { blur } from 'svelte/transition';
	import swordAnimation from '../../../../../assets/videos/sword_animation.gif';
	import type { Socket } from 'socket.io-client';

	let { isOpen = $bindable(), socket }: { isOpen: boolean; socket: Socket | null } = $props();
	let timeSearching = $state(0);

	// This will be used to track the time spent searching for a match
	$effect(() => {
		if (isOpen) {
			const startTime = Date.now();
			const interval = setInterval(() => {
				timeSearching = Math.floor((Date.now() - startTime) / 1000);
			}, 1000);
			return () => clearInterval(interval);
		}
	});

	function handleCancel() {
		isOpen = false;
		timeSearching = 0; // Reset the time when matchmaking is cancelled
		socket?.emit('cancelMatchmaking');
	}
</script>

{#if isOpen}
	<div in:blur={{ duration: 300 }} class="fixed z-50 top-0 left-0 bottom-0 right-0 bg-black/50">
		<div class="flex justify-center items-center h-full w-full p-6">
			<div
				class="bg-[#90CF74] text-black pl-5 pr-7 py-7 rounded-md flex flex-col items-center md:min-w-[40rem]"
			>
				<h1
					class="text-4xl flex sm:flex-row text-center flex-col items-center gap-7 mb-8 font-bold tracking-wider"
				>
					Hledám soupeře <span class="block dot-elastic"></span>
				</h1>
				<img src={swordAnimation} alt="sword animation" class="w-56" />
				<p class="mt-5 text-xl font-semibold">Hledání ({timeSearching}s)</p>
				<p class="mt-1 text-sm tracking-[0.03em] font-medium text-center">
					Snažíme se najít nejvhodnějšího protivníka <br /> k vaší úrovni
				</p>
				<button
					onclick={handleCancel}
					class="mt-8 button variant-filled-tertiary px-8 rounded-md text-lg font-semibold py-2 hover:!bg-tertiary-700"
					>Zrušit</button
				>
			</div>
		</div>
	</div>
{/if}

<style>
	.dot-elastic {
		position: relative;
		width: 10px;
		height: 10px;
		border-radius: 5px;
		background-color: #070707;
		color: #222222;
		animation: dot-elastic 1s infinite linear;
	}
	.dot-elastic::before,
	.dot-elastic::after {
		content: '';
		display: inline-block;
		position: absolute;
		top: 0;
	}
	.dot-elastic::before {
		left: -15px;
		width: 10px;
		height: 10px;
		border-radius: 5px;
		background-color: #070707;
		color: #222222;
		animation: dot-elastic-before 1s infinite linear;
	}
	.dot-elastic::after {
		left: 15px;
		width: 10px;
		height: 10px;
		border-radius: 5px;
		background-color: #070707;
		color: #222222;
		animation: dot-elastic-after 1s infinite linear;
	}

	@keyframes dot-elastic-before {
		0% {
			transform: scale(1, 1);
		}
		25% {
			transform: scale(1, 1.5);
		}
		50% {
			transform: scale(1, 0.67);
		}
		75% {
			transform: scale(1, 1);
		}
		100% {
			transform: scale(1, 1);
		}
	}
	@keyframes dot-elastic {
		0% {
			transform: scale(1, 1);
		}
		25% {
			transform: scale(1, 1);
		}
		50% {
			transform: scale(1, 1.5);
		}
		75% {
			transform: scale(1, 1);
		}
		100% {
			transform: scale(1, 1);
		}
	}
	@keyframes dot-elastic-after {
		0% {
			transform: scale(1, 1);
		}
		25% {
			transform: scale(1, 1);
		}
		50% {
			transform: scale(1, 0.67);
		}
		75% {
			transform: scale(1, 1.5);
		}
		100% {
			transform: scale(1, 1);
		}
	}
</style>
