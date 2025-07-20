<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { addToast } from '../../../stores/toast';
	import { goto } from '$app/navigation';
	import type { Socket } from 'socket.io-client';
	import { createPrsiSocket } from '$lib/socket';
	import PrsiCanvas from '$lib/phaser/prsi/components/PrsiCanvas.svelte';
	import type { GameState } from '$lib/phaser/prsi/types/game-state';
	import '../games.css';

	let token = $state('');
	let gameId = $state('');

	let playerName = $state('');
	let enemyName = $state('');

	let prsiSocket: Socket | null = $state(null);

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
		if (!token || !gameId || prsiSocket) {
			return;
		}

		prsiSocket = createPrsiSocket(token, gameId);

		prsiSocket.on('gameState', (data: GameState) => {
			playerName = data.players.find((p) => p.token === token)?.name || '';
			enemyName = data.players.find((p) => p.token !== token)?.name || '';
		});

		prsiSocket.on('end', () => {
			addToast('Hra do které se snažíte připojit, již není aktivní.', 'error', 3000);
			setTimeout(() => {
				goto('/');
			}, 3000);
		});
	});

	onDestroy(() => {
		if (prsiSocket) {
			prsiSocket.disconnect();
			prsiSocket = null;
		}
	});
</script>

{#if prsiSocket && token && playerName && enemyName}
	<PrsiCanvas socket={prsiSocket} {token} {playerName} {enemyName} />
{:else}
	<div class="flex flex-col items-center justify-center h-full text-center">
		<h1 class="text-2xl font-bold mb-4">Prší</h1>
		<p class="text-lg mb-8">Hra se připravuje…</p>
	</div>
{/if}
