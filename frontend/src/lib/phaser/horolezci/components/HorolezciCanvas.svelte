<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { Game } from 'phaser';
	import GameOver from '$lib/phaser/components/GameOver.svelte';
	import Disconnect from '$lib/phaser/components/Disconnect.svelte';
	import VolumeControl from '$lib/phaser/components/VolumeControl.svelte';
	import PlayerUI from '$lib/phaser/horolezci/components/PlayerUI.svelte';
	import type { Socket } from 'socket.io-client';
	import { distanceToTravel, horolezciStats } from '../../../../stores/horolezci/stats';
	import { fly } from 'svelte/transition';

	let game: Game;

	let {
		socket,
		token,
		playerName,
		enemyName
	}: { socket: Socket; token: string; playerName: string; enemyName: string } = $props();

	const MAX_TIME = 20;

	onMount(async () => {
		console.log(
			`Initializing Phaser game with playerName: ${playerName} and enemyName: ${enemyName}`
		);
		const Phaser = await import('phaser');
		const { default: MainScene } = await import('$lib/phaser/horolezci/scene/MainScene');
		const { default: PreloadScene } = await import('$lib/phaser/horolezci/scene/PreloadScene');
		const mainScene = new MainScene(socket, token);

		// eslint-disable-next-line no-undef
		const config: Phaser.Types.Core.GameConfig = {
			type: Phaser.AUTO,
			physics: {
				default: 'arcade',
				arcade: {
					gravity: { y: 0, x: 0 },
					debug: false
				}
			},
			backgroundColor: '#FEFFFF',
			dom: {
				createContainer: true
			},
			parent: 'phaser-container',
			scene: [PreloadScene, mainScene],
			scale: {
				mode: Phaser.Scale.FIT,
				autoCenter: Phaser.Scale.CENTER_BOTH,
				width: 1280,
				height: 720
			},
			render: {
				pixelArt: false,
				antialias: true,
				roundPixels: true
			}
		};

		game = new Phaser.Game(config);
	});

	let time = $state(`${MAX_TIME}`);
	$effect(() => {
		if (!$horolezciStats.endTime) {
			time = `${MAX_TIME}`;
			return;
		}

		const interval = setInterval(() => {
			const now = Date.now();
			const remainingSeconds = Math.max(
				0,
				Math.floor(($horolezciStats.endTime! - now) / 1000)
			);
			time = remainingSeconds.toString();
		}, 1000);

		return () => clearInterval(interval);
	});

	onDestroy(() => {
		game?.destroy(true);
	});
</script>

<div
	id="phaser-container"
	class="w-full h-full overflow-hidden flex justify-center items-center bg-[#FEFFFF]"
></div>

<div class="fixed top-10 left-10 flex items-center gap-2">
	<PlayerUI {playerName} isEnemy={false} />
	{#if $distanceToTravel === null}
		<div
			class="timer rounded-full flex justify-center items-center border-[5px] border-black"
			style={`--progress: ${Number(time) / MAX_TIME};`}
		>
			<div class="timer-fill"></div>

			<span class="text-2xl font-bold text-black z-10">
				{time}
			</span>
		</div>
	{:else}
		<div
			in:fly={{ y: -20, duration: 500 }}
			class={`${$distanceToTravel.player === null ? 'text-[#ffd83d]' : $distanceToTravel.player > 0 ? 'text-[#1f9c14]' : 'text-[#ea6060]'}`}
		>
			<span class="text-2xl font-bold">
				{#if $distanceToTravel.player === null}
					Safety placed!
				{:else}
					{$distanceToTravel.player > 0 ? '+' : ''}{$distanceToTravel.player}m
				{/if}
			</span>
		</div>
	{/if}
</div>
<div class="fixed top-36 left-10 flex items-center gap-2">
	<PlayerUI playerName={enemyName} isEnemy={true} />
	{#if $distanceToTravel}
		<div
			in:fly={{ y: -20, duration: 500 }}
			class={`${$distanceToTravel.enemy === null ? 'text-[#ffd83d]' : $distanceToTravel.enemy > 0 ? 'text-[#1f9c14]' : 'text-[#ea6060]'}`}
		>
			<span class="text-2xl font-bold">
				{#if $distanceToTravel.enemy === null}
					Safety placed!
				{:else}
					{$distanceToTravel.enemy > 0 ? '+' : ''}{$distanceToTravel.enemy}m
				{/if}
			</span>
		</div>
	{/if}
</div>
<VolumeControl />
<GameOver />
<Disconnect />

<style>
	.timer {
		width: 80px;
		height: 80px;
		position: relative;
		overflow: hidden;
		background: white;
	}

	.timer-fill {
		position: absolute;
		inset: 0;

		background: conic-gradient(#7ce872 calc(var(--progress) * 360deg), transparent 0deg);

		transform: scaleX(-1);
	}
</style>
