<script lang="ts">
	import type { PageProps } from '../../../../../.svelte-kit/types/src/routes/(app)/game-detail/[id]/$types';
	import slovniFotbal from '../../../../assets/images/slovni-fotbal.webp';
	import prsi from '../../../../assets/images/prsi.webp';
	import horolezci from '../../../../assets/images/horolezci.webp';
	import GameInfo from './components/game-info.svelte';
	import { auth } from '../../../../stores/auth';
	import { goto } from '$app/navigation';
	import type { Socket } from 'socket.io-client';
	import { createMatchmakingSocket } from '$lib/socket';
	import { addToast } from '../../../../stores/toast';
	import type { MMR } from '../../../../types/user';
	import { API } from '../../../../constants/urls';
	import MatchmakingOverlay from './components/matchmaking-overlay.svelte';
	import { onDestroy } from 'svelte';
	import { slugify } from '../../../../utils/slugify';

	let { data }: PageProps = $props();
	let socket: Socket | null = $state(null);
	let isMatchmakingOpen = $state(false);

	const images = {
		slovniFotbal: slovniFotbal,
		prsi: prsi,
		horolezci: horolezci
	};

	async function initializeMMR(): Promise<void> {
		console.log("Player doesn't have MMR, initializing...");
		const res = await fetch(`${API}/api/secured/mmr`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('token')}`
			},
			body: JSON.stringify({
				gameId: data.game.gameId,
				userId: $auth.data!.id
			})
		});

		console.log(res);

		const mmr: MMR = await res.json();
		$auth.data!.player!.mmr.push(mmr);
	}

	let playersInQueue = $state(0);

	$effect(() => {
		if (!socket && $auth.data?.player) {
			// If player doesn't have MMR yet, we will need to assign a default MMR value for him
			if (
				!$auth.data.player.mmr.find(
					(mmr: MMR) =>
						mmr.gameId === data.game.gameId && mmr.userId === $auth.data?.player?.id
				)
			) {
				initializeMMR();
			}
		}
	});
	$effect(() => {
		if (
			$auth.data?.player?.mmr.find((mmr: MMR) => mmr.gameId === data.game.gameId) &&
			!socket
		) {
			console.log('Player has MMR, no need to initialize');

			console.log('Creating matchmaking socket');
			socket = createMatchmakingSocket($auth.data, data.game.gameId);

			socket.on('usersInQueue', (count: number) => {
				playersInQueue = count;
			});

			socket.on('matchFound', (x: { gameId: string; playerToken: string }) => {
				console.log(x);
				localStorage.setItem('playerToken', x.playerToken);
				localStorage.setItem('gameId', x.gameId);
				socket?.emit('joinGame');
				goto(`/game/${slugify(data.game.name)}`);
			});
		}
	});

	async function handleJoiningMatchmaking() {
		if (!$auth.data) {
			goto('/login');
			return;
		}
		if ($auth.data.player === null) {
			addToast('Pouze hráčské účty mohou hrát hry.', 'warning');
			return;
		}

		isMatchmakingOpen = true;
		socket?.emit('startMatchmaking');
	}

	onDestroy(() => {
		if (socket) {
			socket.disconnect();
			socket = null;
		}
	});
</script>

<svelte:head>
	<title>Duelovky | {data.game.name}</title>
</svelte:head>

<MatchmakingOverlay bind:isOpen={isMatchmakingOpen} {socket} />
{#if data.game}
	<div class="container flex flex-col gap-20 mt-10 w-[min(64rem,100%)]">
		<div
			class="flex lg:flex-row flex-col w-full justify-center items-center lg:items-stretch gap-12"
		>
			<img
				class="max-w-[30rem] w-full object-cover rounded-t-md object-top"
				src={data.game.name === 'Horolezci'
					? images.horolezci
					: data.game.name === 'Prší'
						? images.prsi
						: images.slovniFotbal}
				alt=""
			/>
			<div class="flex flex-col max-w-[32.5rem]">
				<h1 class="text-4xl font-heading font-semibold mb-2">{data.game.name}</h1>
				<p class="font-light tracking-[0.03em] md:text-base text-sm mb-5">
					{data.game.description}
				</p>

				<div class="flex flex-col gap-3 mt-auto">
					{#if $auth.data?.player}
						<p class="flex items-center gap-2 font-light tracking-[0.03em]">
							<span
								class="block bg-success-400 rounded-full w-3 h-3"
								style="box-shadow: 0px 0px 8px 1px #00bb00;"
							></span>{playersInQueue} hráčů ve frontě
						</p>
					{/if}
					<div class="flex md:flex-row flex-col gap-x-5 gap-y-3">
						<button
							onclick={handleJoiningMatchmaking}
							class="button px-8 py-[6px] rounded-sm font-bold variant-filled-primary uppercase hover:!bg-success-800"
							>Hrát hned</button
						>
						<button
							class="button px-8 py-[6px] rounded-sm font-bold variant-filled-secondary !bg-secondary-600 !text-white uppercase hover:!bg-secondary-500"
							>Vyzvat kamaráda</button
						>
					</div>
				</div>
			</div>
		</div>
		<GameInfo game={data.game} />
	</div>
{:else}
	<p>Loading...</p>
{/if}
