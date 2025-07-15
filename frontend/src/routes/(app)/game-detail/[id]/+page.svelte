<script lang="ts">
	import type { PageProps } from '../../../../../.svelte-kit/types/src/routes/(app)/game-detail/[id]/$types';
	import slovniFotbal from '../../../../assets/images/slovni-fotbal.webp';
	import prsi from '../../../../assets/images/prsi.webp';
	import horolezci from '../../../../assets/images/horolezci.webp';
	import GameInfo from './components/game-info.svelte';

	let { data }: PageProps = $props();

	const images = {
		slovniFotbal: slovniFotbal,
		prsi: prsi,
		horolezci: horolezci
	};
</script>

<svelte:head>
	<title>Duelovky | {data.game.name}</title>
</svelte:head>

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
					<p class="flex items-center gap-2 font-light tracking-[0.03em]">
						<span
							class="block bg-success-400 rounded-full w-3 h-3"
							style="box-shadow: 0px 0px 8px 1px #00bb00;"
						></span>0 hráčů ve frontě
					</p>
					<div class="flex md:flex-row flex-col gap-x-5 gap-y-3">
						<button
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
