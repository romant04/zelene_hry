<script lang="ts">
	export let image: string;
	export let title: string;
	export let perex: string;

	export let categories: string[];

	let card: HTMLElement | undefined;
	function handleAnimation(e: MouseEvent) {
		if (!card) {
			return;
		}

		const cardRect = card.getBoundingClientRect();

		const x = e.clientX - cardRect.left;
		const y = e.clientY - cardRect.top;

		const centerX = cardRect.width / 2;
		const centerY = cardRect.height / 2;

		const rotateX = -((y - centerY) / centerY) * 10;
		const rotateY = -((centerX - x) / centerX) * 10;

		card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
	}
	function handleAnimationEnd() {
		if (!card) {
			return;
		}
		card.style.transform = 'rotateX(0deg) rotateY(0deg)';
	}
</script>

<div style="perspective: 1200px" class="flex w-full max-w-[22.5rem] items-center justify-center">
	<a
		bind:this={card}
		onmousemove={handleAnimation}
		onmouseleave={handleAnimationEnd}
		href="game-detail.html"
	>
		<img
			loading="lazy"
			class="h-[15rem] w-full object-cover rounded-t-md object-top"
			src={image}
			alt=""
		/>
		<div class="flex h-[12.5rem] flex-col rounded-b-md bg-tertiary-600 p-4">
			<h3 class="text-4xl font-semibold mb-1">{title}</h3>
			<p class="line-clamp-5 text-sm tracking-tight">{perex}</p>
			<p class="mt-auto flex gap-1">
				{#each categories as category, i}
					<span
						class="{i % 2 === 0
							? 'text-success-500'
							: 'text-secondary-400'} text-[0.85rem]">#{category}</span
					>
				{/each}
			</p>
		</div>
	</a>
</div>
