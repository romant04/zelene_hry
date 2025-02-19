<script lang="ts">
	import Icon from '@iconify/svelte';

	let {
		isOpen = $bindable(false),
		links
	}: { isOpen: boolean; links: { href: string; text: string }[] } = $props();

	function handleClose() {
		isOpen = false;
	}
</script>

<div
	class="{isOpen ? 'opacity-50' : 'pointer-events-none opacity-0'} fixed top-0 z-40 h-full w-full bg-black transition-all duration-200"
></div>
<div
	class="{isOpen ? '-translate-x-[200%]' : 'translate-x-0'} fixed -right-full top-0 z-50 h-full w-full bg-tertiary-800 p-6 transition-all duration-500 sm:w-3/4 md:w-1/2"
>
	<div class="flex items-center justify-between">
		<a href="/" onclick="{handleClose}">
			<h2 class="font-heading text-3xl font-semibold">Duelovky</h2>
		</a>
		<Icon
			width="28"
			icon="system-uicons:cross"
			class="cursor-pointer"
			onclick="{handleClose}"
		/>
	</div>

	<div class="mt-10 flex flex-col gap-3">
		{#each links as link}
		<a
			onclick="{handleClose}"
			class="btn !justify-start rounded-md bg-surface-700 !p-4"
			href="{link.href}"
			>{link.text}</a
		>
		{/each}
	</div>
</div>
