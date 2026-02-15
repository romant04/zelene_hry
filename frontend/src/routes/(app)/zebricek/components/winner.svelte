<script lang="ts">
	import Icon from '@iconify/svelte';

	const {
		name,
		position,
		MMR,
		styles
	}: { name: string; position: number; MMR: number; styles?: string } = $props();

	let cupColor = $derived.by(() => {
		switch (position) {
			case 1:
				return 'text-yellow-400';
			case 2:
				return 'text-gray-300';
			case 3:
				return 'text-yellow-700';
			default:
				return 'text-gray-500';
		}
	});
</script>

<div class="{styles} flex flex-col items-center">
	<div
		class="w-28 h-28 relative bg-primary-400 rounded-full uppercase text-3xl flex justify-center items-center font-bold"
	>
		{name.slice(0, 2)}
		<Icon icon="solar:cup-bold" width="36" class="{cupColor} absolute bottom-0" />
	</div>
	<div
		class="bg-tertiary-500 w-44 relative -top-5 gap-2 -z-10 rounded-lg px-5 pt-6 pb-4 flex justify-center flex-col items-center"
	>
		<h2 class="text-md">{name}</h2>
		<p class="text-xl font-bold">{MMR} MMR</p>
	</div>
</div>
