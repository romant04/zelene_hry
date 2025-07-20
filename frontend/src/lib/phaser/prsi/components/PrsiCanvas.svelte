<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { Socket } from 'socket.io-client';
	import { svrsek } from '../../../../stores/prsi/svrsek';
	import cerveny from '../../../../assets/prsi/icons/cerveny.png';
	import zaludy from '../../../../assets/prsi/icons/zaludy.png';
	import kule from '../../../../assets/prsi/icons/kule.png';
	import zeleny from '../../../../assets/prsi/icons/zeleny.png';
	import { gameOver } from '../../../../stores/prsi/game-over';
	import { goto } from '$app/navigation';
	import { disconnect } from '../../../../stores/prsi/disconnect';

	let {
		socket,
		token,
		playerName,
		enemyName
	}: { socket: Socket; token: string; playerName: string; enemyName: string } = $props();

	const suits = {
		c: cerveny,
		e: zeleny,
		z: zaludy,
		k: kule
	};

	// eslint-disable-next-line no-undef
	let game: Phaser.Game;

	let timer = $state<number | null>(null);
	let timeRemaining = $state(30);

	$effect(() => {
		if ($disconnect.disconnect && !timer) {
			timer = window.setInterval(() => {
				timeRemaining--;
				if (timeRemaining <= 0 && $disconnect.disconnect) {
					clearInterval(timer!);
					timer = null;
					$disconnect.disconnect = false;
					goto('/');
				}
			}, 1000);
		} else if (!$disconnect.disconnect && timer) {
			clearInterval(timer!);
			timer = null;
			timeRemaining = 30;
		}
	});

	function handleSuitChange(suit: string) {
		if (suit === 'c') {
			socket.emit('changeSuit', { suit: 'c', old: $svrsek.oldSuit });
		} else if (suit === 'e') {
			socket.emit('changeSuit', { suit: 'e', old: $svrsek.oldSuit });
		} else if (suit === 'z') {
			socket.emit('changeSuit', { suit: 'z', old: $svrsek.oldSuit });
		} else if (suit === 'k') {
			socket.emit('changeSuit', { suit: 'k', old: $svrsek.oldSuit });
		}
		$svrsek.svrsekOpen = false;
	}

	function handleRedirect() {
		$gameOver.gameOver = false;
		goto('/');
	}

	onMount(async () => {
		const Phaser = await import('phaser');
		const { default: MainScene } = await import('$lib/phaser/prsi/scene/MainScene');
		const { default: PreloadScene } = await import('$lib/phaser/prsi/scene/PreloadScene');
		const mainScene = new MainScene(socket, token);

		// eslint-disable-next-line no-undef
		const config: Phaser.Types.Core.GameConfig = {
			type: Phaser.AUTO,
			backgroundColor: '#0a0a0a',
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
	class="w-full h-full overflow-hidden flex justify-center items-center"
></div>
<p class="fixed top-10 left-32 text-3xl font-bold">{enemyName}</p>
<p class="fixed bottom-10 right-32 text-3xl font-bold">{playerName}</p>
{#if $svrsek.svrsekOpen}
	<div
		class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center px-5"
	>
		<div class="bg-tertiary-700 text-white text-center p-5 rounded-md">
			<h2 class="text-3xl font-bold mb-5">Na jakou měníš?</h2>
			<div class="flex flex-wrap items-center justify-center gap-5">
				{#each Object.keys(suits) as suit}
					{@const img =
						suit === 'k'
							? suits.k
							: suit === 'z'
								? suits.z
								: suit === 'e'
									? suits.e
									: suits.c}
					<button onclick={() => handleSuitChange(suit)}
						><img
							class="w-16 h-16 md:w-24 md:h-24 object-contain hover:bg-gray-400 rounded-full p-2"
							src={img}
							alt=""
						/></button
					>
				{/each}
			</div>
		</div>
	</div>
{/if}

{#if $gameOver.gameOver}
	<div
		class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center px-5"
	>
		<div
			class="bg-tertiary-700 text-white text-center px-5 pt-10 pb-7 min-w-[32rem] rounded-md"
		>
			<h2 class="text-5xl font-bold mb-5">Konec hry</h2>
			<p class="text-2xl mt-3 mb-5 font-semibold">Vyhrává {$gameOver.winner}</p>
			<button
				onclick={handleRedirect}
				class="button variant-filled-primary rounded-sm px-3 py-1 text-lg"
				>Vrátit se na hlavní stránku</button
			>
		</div>
	</div>
{/if}

{#if $disconnect.disconnect}
	<div
		class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center px-5"
	>
		<div
			class="bg-tertiary-700 text-white text-center px-5 pt-10 pb-7 w-[20rem] md:w-[32rem] rounded-md"
		>
			<h2 class="text-3xl font-semibold">
				Váš protihráč se odpojil, pokud se nepřipojí do 30s, hra bude ukončena.
			</h2>
			<p class="text-xl mt-8">Zbývá ještě {timeRemaining}s</p>
		</div>
	</div>
{/if}
