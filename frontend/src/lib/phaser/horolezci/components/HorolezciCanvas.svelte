<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { Game } from 'phaser';
	import GameOver from '$lib/phaser/components/GameOver.svelte';
	import Disconnect from '$lib/phaser/components/Disconnect.svelte';
	import VolumeControl from '$lib/phaser/components/VolumeControl.svelte';
	import safetyPin from '../../../../assets/horolezci/safety_pin.svg';
	import PlayerUI from '$lib/phaser/horolezci/components/PlayerUI.svelte';

	let game: Game;

	let { playerName, enemyName }: { playerName: string; enemyName: string } = $props();

	onMount(async () => {
		console.log(
			`Initializing Phaser game with playerName: ${playerName} and enemyName: ${enemyName}`
		);
		const Phaser = await import('phaser');
		const { default: MainScene } = await import('$lib/phaser/horolezci/scene/MainScene');
		const { default: PreloadScene } = await import('$lib/phaser/horolezci/scene/PreloadScene');
		const mainScene = new MainScene();

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

	onDestroy(() => {
		game?.destroy(true);
	});
</script>

<div
	id="phaser-container"
	class="w-full h-full overflow-hidden flex justify-center items-center bg-[#FEFFFF]"
></div>

<div class="fixed top-10 left-10">
	<PlayerUI {playerName} distance={120} safetyPins={2} isEnemy={false} />
</div>
<div class="fixed top-36 left-10">
	<PlayerUI playerName={enemyName} distance={35} safetyPins={3} isEnemy={true} />
</div>
<VolumeControl />
<GameOver />
<Disconnect />
