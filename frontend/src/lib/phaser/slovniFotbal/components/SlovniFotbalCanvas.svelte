<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { Socket } from 'socket.io-client';
	import type { Game } from 'phaser';
	import { score } from '../../../../stores/slovni-fotbal/score';
	import { endTime } from '../../../../stores/slovni-fotbal/timer';
	import Icon from '@iconify/svelte';
	import GameOver from '$lib/phaser/components/GameOver.svelte';
	import Disconnect from '$lib/phaser/components/Disconnect.svelte';
	import { volume } from '../../../../stores/gameGeneral/volume';

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

	function handleVolumeChange(event: Event) {
		const target = event.target as HTMLInputElement;
		const newVolume = parseInt(target.value);
		volume.set(newVolume);
	}

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

<div class="fixed bottom-10 left-10 flex flex-col items-center gap-2 group">
	<input
		class="volume-slider opacity-0 pointer-events-none translate-y-2 transition-all duration-200 group-hover:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-0"
		oninput={handleVolumeChange}
		type="range"
		min="0"
		max="200"
		value="100"
	/>

	<div class="flex justify-center items-center p-4 bg-black/80 rounded-full">
		<Icon icon="material-symbols:volume-up" class="w-8 h-8 text-white cursor-pointer" />
	</div>
</div>

<GameOver />
<Disconnect />

<style>
	/* Volume Slider */
	.volume-slider {
		-webkit-appearance: none;
		appearance: none;
		height: 180px;
		width: 9px;
		border-radius: 999px;
		outline: none;
		cursor: pointer;
		writing-mode: vertical-rl;
		direction: rtl;

		background: linear-gradient(to bottom, #424242, #2c2c2c);

		border: none;
		box-shadow:
			inset 0 2px 4px rgba(0, 0, 0, 0.5),
			0 1px 1px rgba(255, 255, 255, 0.05);

		transition: all 0.2s ease;
	}

	.volume-slider:hover {
		filter: brightness(1.1);
	}

	/* Chrome / Edge / Safari */
	.volume-slider::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;

		width: 18px;
		height: 18px;
		border-radius: 50%;

		background: radial-gradient(circle at 30% 30%, #373737, #101010);
		border: 1px solid #fff;

		box-shadow:
			0 2px 6px rgba(0, 0, 0, 0.6),
			inset 0 1px 1px rgba(255, 255, 255, 0.25);

		transition:
			transform 0.15s ease,
			box-shadow 0.15s ease;
	}

	.volume-slider::-webkit-slider-thumb:hover {
		transform: scale(1.12);
		box-shadow:
			0 0 10px rgba(255, 255, 255, 0.25),
			0 2px 8px rgba(0, 0, 0, 0.6);
	}

	.volume-slider:active::-webkit-slider-thumb {
		transform: scale(0.95);
	}

	/* Firefox */
	.volume-slider::-moz-range-track {
		height: 8px;
		border-radius: 999px;
		background: linear-gradient(#555, #3d3d3d);
		border: 1px solid #5a5a5a;
	}

	.volume-slider::-moz-range-thumb {
		width: 18px;
		height: 18px;
		border-radius: 50%;
		border: 2px solid #666;
		background: radial-gradient(circle at 30% 30%, #d0d0d0, #888);
		box-shadow:
			0 2px 6px rgba(0, 0, 0, 0.6),
			inset 0 1px 1px rgba(255, 255, 255, 0.25);
		cursor: pointer;
	}
</style>
