<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { Socket } from 'socket.io-client';

	let game: Phaser.Game;

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
<div>
	<p>{playerName}</p>
</div>
