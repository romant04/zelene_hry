<script lang="ts">
	import Icon from '@iconify/svelte';

	let { name, isFriend, bgColor }: { name: string; isFriend: boolean; bgColor?: string } =
		$props();
</script>

<div class="{bgColor ?? 'bg-surface-900'} flex items-center justify-between rounded-md px-6 py-3">
	<p class="font-semibold">{name}</p>
	{#if isFriend}
	<div class="flex items-center gap-2">
		<Icon
			width="32"
			icon="mdi:chat"
			class="h-9 w-9 cursor-pointer rounded-full bg-primary-500 p-2 transition-all duration-150 hover:bg-primary-400"
		/>
		<button class="variant-filled-error btn h-9 w-32 text-sm">Odebrat z přátel</button>
	</div>
	{:else}
	<button class="variant-filled-primary btn h-9 w-32 text-sm">Přidat do přátel</button>
	{/if}
</div>
