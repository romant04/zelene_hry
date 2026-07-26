<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { Socket } from 'socket.io-client';
	import type { Game } from 'phaser';
	import { score } from '../../../../stores/slovni-fotbal/score';
	import { endTime } from '../../../../stores/slovni-fotbal/timer';
	import GameOver from '$lib/phaser/components/GameOver.svelte';
	import Disconnect from '$lib/phaser/components/Disconnect.svelte';

	let game: Game;

	let {
		socket,
		token,
		playerName,
		enemyName
	}: { socket: Socket; token: string; playerName: string; enemyName: string } = $props();

	onMount(async () => {
		const Phaser = await import('phaser');
		const { default: MainScene } = await import('$lib/phaser/slovniFotbal/scene/MainScene');
		const { default: PreloadScene } = await import(
			'$lib/phaser/slovniFotbal/scene/PreloadScene'
		);
		const mainScene = new MainScene(socket, token);

		// eslint-disable-next-line no-undef
		const config: Phaser.Types.Core.GameConfig = {
			type: Phaser.AUTO,
			backgroundColor: '#17840F',
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

	let time = $state('03:00');
	function updateTime() {
		if (!$endTime) {
			time = '03:00';
			return;
		}

		const now = new Date();
		const remainingSeconds = Math.max(0, Math.floor(($endTime - now.getTime()) / 1000));
		const remainingMinutes = Math.floor(remainingSeconds / 60);

		const formattedTime = `${remainingMinutes.toString().padStart(2, '0')}:${(
			remainingSeconds % 60
		)
			.toString()
			.padStart(2, '0')}`;
		time = formattedTime;
	}

	$effect(() => {
		console.log('End time changed:', $endTime);
		if ($endTime) {
			const interval = setInterval(() => {
				updateTime();
				if (time === '00:00') {
					clearInterval(interval);
				}
			}, 1000);

			return () => clearInterval(interval);
		}
	});

	onDestroy(() => {
		game?.destroy(true);
	});
</script>

<div
	id="phaser-container"
	class="w-full h-full overflow-hidden flex justify-center items-center bg-[#17840F]"
></div>

<div class="top-0 left-0 w-full fixed bg-tertiary-600 flex justify-between items-center">
	<div class="flex items-center gap-4 bg-tertiary-800 pl-5">
		<p class="text-2xl font-bold uppercase">{playerName}</p>
		<p class="text-3xl bg-tertiary-900 p-5">{$score.player.goals}</p>
	</div>

	<div class="bg-tertiary-800 py-5 px-8">
		<p class="text-3xl font-bold uppercase">{time}</p>
	</div>

	<div class="flex items-center gap-4 bg-tertiary-800 pr-5">
		<p class="text-3xl bg-tertiary-900 p-5">{$score.enemy.goals}</p>
		<p class="text-2xl font-bold uppercase">{enemyName}</p>
	</div>
</div>
<GameOver />
<Disconnect />
