<script lang="ts">
	import type { PageProps } from '../../../../../../.svelte-kit/types/src/routes/(app)/game-detail/[id]/[roomId]/$types';
	import type { Socket } from 'socket.io-client';
	import { createFriendChallengeSocket } from '$lib/socket';
	import { auth } from '../../../../../stores/auth';
	import { onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import { slugify } from '../../../../../utils/slugify';

	let { data }: PageProps = $props();
	let socket: Socket | null = $state(null);

	function connectToRoom() {
		if (!$auth.data) {
			goto('/login');
			return;
		}

		socket = createFriendChallengeSocket($auth.data, data.roomId, Number(data.game.gameId));
		socket.on('gameStarted', (x) => {
			localStorage.setItem('playerToken', x.playerToken);
			localStorage.setItem('gameId', x.gameId);
			socket?.emit('joinGame');
			goto(`/game/${slugify(data.game.name)}`);
		});
	}

	onDestroy(() => {
		if (socket) {
			socket.disconnect();
			socket = null;
		}
	});
</script>

<div class="bg-black/70 flex justify-center items-center fixed w-screen h-screen top-0 left-0 z-50">
	<div class="bg-surface-700 w-[42rem] p-5 rounded-md flex flex-col gap-10">
		<div>
			<h1 class="text-3xl">Chcete se připojit do hry?</h1>
			<p class="text-gray-300 text-sm">kód hry: {data.roomId}</p>
		</div>

		<div class="flex gap-3">
			<button onclick={connectToRoom} class="btn variant-filled-primary w-full"
				>Připojit</button
			>
			<a href="/" class="btn variant-filled-tertiary w-full">Zrušit</a>
		</div>
	</div>
</div>
