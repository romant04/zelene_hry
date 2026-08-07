<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { Game } from 'phaser';
	import GameOver from '$lib/phaser/components/GameOver.svelte';
	import Disconnect from '$lib/phaser/components/Disconnect.svelte';
	import VolumeControl from '$lib/phaser/components/VolumeControl.svelte';
	import PlayerUI from '$lib/phaser/horolezci/components/PlayerUI.svelte';
	import type { Socket } from 'socket.io-client';
	import { horolezciStats } from '../../../../stores/horolezci/stats';

	let game: Game;

	let {
		socket,
		token,
		playerName,
		enemyName
	}: { socket: Socket; token: string; playerName: string; enemyName: string } = $props();

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

	let time = $state('30');
	$effect(() => {
		console.log(`horolezciStats changed:`, $horolezciStats);
		if (!$horolezciStats.endTime) {
			time = '30';
			return;
		}

		setInterval(() => {
			const now = Date.now();
			const remainingSeconds = Math.max(
				0,
				Math.floor(($horolezciStats.endTime! - now) / 1000)
			);
			time = remainingSeconds.toString();
		}, 1000);
	});

	onDestroy(() => {
		game?.destroy(true);
	});
</script>

<div
	id="phaser-container"
	class="w-full h-full overflow-hidden flex justify-center items-center bg-[#FEFFFF]"
></div>

<div class="fixed top-10 left-10">
	<PlayerUI {playerName} isEnemy={false} />
</div>
<div class="fixed top-36 left-10">
	<PlayerUI playerName={enemyName} isEnemy={true} />
</div>
<div class="fixed top-10 left-1/2">
	<span class="text-black text-xl font-bold">{time}</span>
</div>
<VolumeControl />
<GameOver />
<Disconnect />
