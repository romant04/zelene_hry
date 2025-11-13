<script lang="ts">
	import { blur } from 'svelte/transition';
	import type { Socket } from 'socket.io-client';
	import { v4 as uuidv4 } from 'uuid';
	import { page } from '$app/state';
	import Icon from '@iconify/svelte';
	import { addToast } from '../../../../../stores/toast';
	import { createFriendChallengeSocket } from '$lib/socket';
	import { auth } from '../../../../../stores/auth';
	import { onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import { slugify } from '../../../../../utils/slugify';
	import type { Game } from '../../../../../types/game';

	let { isOpen = $bindable(), game }: { isOpen: boolean; game: Game } = $props();
	let matchId = $state('');
	let urlForMatch = $derived.by(() => {
		return matchId ? page.url.host + page.url.pathname + '/' + matchId : '';
	});

	let socket: Socket | null = $state(null);

	$effect(() => {
		if (isOpen && $auth.data && !matchId) {
			matchId = uuidv4();
			socket = createFriendChallengeSocket($auth.data, matchId, game.gameId);
			socket.on('gameStarted', (data: { gameId: string; playerToken: string }) => {
				localStorage.setItem('playerToken', data.playerToken);
				localStorage.setItem('gameId', data.gameId);
				socket?.emit('joinGame');
				goto(`/game/${slugify(game.name)}`);
			});
		}
	});

	function handleUrlCopy() {
		navigator.clipboard.writeText(urlForMatch).then(
			() => {
				// Successfully copied
				addToast('Odkaz zkopírován do schránky', 'success');
			},
			() => {
				// Failed to copy
				addToast('Nepodařilo se zkopírovat odkaz do schránky', 'error');
			}
		);
	}

	function handleCancel() {
		socket?.emit('cancel', {
			queueCode: matchId,
			username: $auth.data?.username
		});
		isOpen = false;
		matchId = '';
	}

	onDestroy(() => {
		if (socket) {
			socket.disconnect();
			socket = null;
		}
	});
</script>

{#if isOpen}
	<div in:blur={{ duration: 300 }} class="fixed z-50 top-0 left-0 bottom-0 right-0 bg-black/50">
		<div class="flex justify-center items-center h-full w-full p-6">
			<div
				class="bg-[#90CF74] text-black pl-5 pr-7 py-7 rounded-md flex flex-col items-center md:min-w-[40rem]"
			>
				<h1
					class="text-4xl flex sm:flex-row text-center flex-col items-center gap-7 mb-2 font-bold tracking-wider"
				>
					Vytvářím soukromé lobby <span class="block dot-elastic"></span>
				</h1>
				<p class="text-xl mb-1">Odkaz pro připojení do hry</p>
				<button onclick={handleUrlCopy} class="btn variant-filled-surface flex gap-2">
					<span class="text-sm">{urlForMatch}</span>
					<Icon icon="mdi:content-copy" class="w-5 h-5 ml-2" />
				</button>

				<button
					onclick={handleCancel}
					class="mt-8 button variant-filled-surface px-8 rounded-md text-lg font-semibold py-2"
					>Zrušit</button
				>
			</div>
		</div>
	</div>
{/if}
