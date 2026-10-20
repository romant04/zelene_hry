<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { Socket } from 'socket.io-client';
	import type { Game } from 'phaser';
	import { score } from '../../../../stores/slovni-fotbal/score';
	import { endTime } from '../../../../stores/slovni-fotbal/timer';
	import GameOver from '$lib/phaser/components/GameOver.svelte';
	import Disconnect from '$lib/phaser/components/Disconnect.svelte';
	import VolumeControl from '$lib/phaser/components/VolumeControl.svelte';
	import { getGameSize, reloadOnOrientationChange } from '$lib/phaser/utils/responsive';

	let game: Game;

	let {
		socket,
		token,
		playerName,
		enemyName
	}: { socket: Socket; token: string; playerName: string; enemyName: string } = $props();

	let stopOrientationWatch: (() => void) | undefined;

	onMount(async () => {
		stopOrientationWatch = reloadOnOrientationChange();
		const Phaser = await import('phaser');
		const { default: MainScene } = await import('$lib/phaser/slovniFotbal/scene/MainScene');
		const { default: PreloadScene } = await import(
			'$lib/phaser/slovniFotbal/scene/PreloadScene'
		);
		const mainScene = new MainScene(socket, token);

		// eslint-disable-next-line no-undef
		const config: Phaser.Types.Core.GameConfig = {
			type: Phaser.AUTO,
			backgroundColor: '#008D00', // same green as the pitch image
			dom: {
				createContainer: true
			},
			parent: 'phaser-container',
			scene: [PreloadScene, mainScene],
			scale: {
				mode: Phaser.Scale.FIT,
				autoCenter: Phaser.Scale.CENTER_BOTH,
				...getGameSize(1280, 720, document.getElementById('phaser-container'))
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
		stopOrientationWatch?.();
		game?.destroy(true);
	});
</script>

<div class="w-full h-full flex flex-col">
	<div class="bg-tertiary-600 flex justify-between items-center">
		<div class="flex items-center gap-2 lg:gap-4 bg-tertiary-800 lg:w-[200px] pl-3 lg:pl-5">
			<p
				class="text-base lg:text-2xl font-bold uppercase truncate max-w-[7rem] lg:max-w-none"
			>
				{playerName}
			</p>
			<p class="text-xl lg:text-3xl bg-tertiary-900 p-3 lg:p-5 ml-auto">
				{$score.player.goals}
			</p>
		</div>

		<div class="bg-tertiary-800 py-3 px-4 lg:py-5 lg:px-8">
			<p class="text-xl lg:text-3xl font-bold uppercase">{time}</p>
		</div>

		<div class="flex items-center gap-2 lg:gap-4 bg-tertiary-800 lg:w-[200px] pr-3 lg:pr-5">
			<p class="text-xl lg:text-3xl bg-tertiary-900 p-3 lg:p-5">{$score.enemy.goals}</p>
			<p
				class="text-base lg:text-2xl font-bold uppercase truncate max-w-[7rem] lg:max-w-none"
			>
				{enemyName}
			</p>
		</div>
	</div>
	<div
		id="phaser-container"
		class="flex-1 min-h-0 w-full overflow-hidden flex justify-center items-center bg-[#008D00]"
	></div>
</div>
<VolumeControl />
<GameOver />
<Disconnect />
