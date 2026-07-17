<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { Socket } from 'socket.io-client';
	import type { Game } from 'phaser';

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
		const mainScene = new MainScene();

		// eslint-disable-next-line no-undef
		const config: Phaser.Types.Core.GameConfig = {
			type: Phaser.AUTO,
			backgroundColor: '#377723',
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
			}
		};

		game = new Phaser.Game(config);
	});

	onDestroy(() => {
		game?.destroy(true);
	});
</script>

<div
	id="phaser-container"
	class="w-full h-full overflow-hidden flex justify-center items-center bg-[#377723]"
></div>
<div class="fixed top-10 left-10 z-[999] flex flex-col">
	<p class="text-3xl font-bold uppercase">{playerName}</p>
	<p class="text-xl">GOALS: 2</p>
	<p class="text-md">WORDS FOUND: 5</p>
</div>
<div class="fixed top-10 right-10 z-[999] flex flex-col">
	<p class="text-3xl font-bold uppercase">{enemyName}</p>
	<p class="text-xl">GOALS: 2</p>
	<p class="text-md">WORDS FOUND: 5</p>
</div>
