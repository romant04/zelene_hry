<script lang="ts">
	import SlovniFotbalCanvas from '$lib/phaser/slovniFotbal/components/SlovniFotbalCanvas.svelte';
	import type { Socket } from 'socket.io-client';
	import { onDestroy, onMount } from 'svelte';
	import { addToast } from '../../../stores/toast.js';
	import { goto } from '$app/navigation';
	import { createSlovniFotbalSocket } from '$lib/socket.js';
	import type { PrsiGameState } from '$lib/phaser/prsi/types/prsi-game-state.js';

	let token = $state('');
	let gameId = $state('');

	let playerName = $state('');
	let enemyName = $state('');

	let fotbalSocket: Socket | null = $state(null);

	onMount(() => {
		const t = localStorage.getItem('playerToken');
		const g = localStorage.getItem('gameId');
		if (!t || !g) {
			addToast('Chyba: Token nebo ID hry není k dispozici.', 'error');
			setTimeout(() => {
				goto('/');
			}, 2000);
		}

		token = t as string;
		gameId = g as string;
	});

	$effect(() => {
		if (!token || !gameId || fotbalSocket) {
			return;
		}

		fotbalSocket = createSlovniFotbalSocket(token, gameId);

		fotbalSocket.on('gameState', (data: PrsiGameState) => {
			playerName = data.players.find((p) => p.token === token)?.name || '';
			enemyName = data.players.find((p) => p.token !== token)?.name || '';
		});

		fotbalSocket.on('end', () => {
			addToast('Hra do které se snažíte připojit, již není aktivní.', 'error', 3000);
			setTimeout(() => {
				goto('/');
			}, 3000);
		});
	});

	onDestroy(() => {
		if (fotbalSocket) {
			fotbalSocket.disconnect();
			fotbalSocket = null;
		}
	});
</script>

<svelte:head>
	<title>Duelovky 🕹️ | Slovní fotbal</title>
</svelte:head>

{#if fotbalSocket && token && playerName && enemyName}
	<SlovniFotbalCanvas socket={fotbalSocket} {token} {playerName} {enemyName} />
{:else}
	<div class="flex flex-col items-center justify-center h-full text-center">
		<h1 class="text-2xl font-bold mb-4">Slovní fotbal</h1>
		<p class="text-lg mb-8">Hra se připravuje…</p>
	</div>
{/if}
