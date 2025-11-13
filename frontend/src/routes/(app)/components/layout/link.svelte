<script lang="ts">
	import type { Link } from '../../../../types/link';
	import Icon from '@iconify/svelte';

	let { link }: { link: Link } = $props();
</script>

<li class="group relative cursor-pointer flex items-center gap-1">
	{#if link.sublinks}
		<p
			class="relative text-xl after:absolute after:-bottom-[2px] after:left-0 after:h-[2px] after:w-0 after:rounded-sm after:bg-success-500 after:transition-all after:duration-[200ms] after:ease-out group-hover:after:w-[105%]"
		>
			{link.text}
		</p>
	{:else}
		<a
			class="relative text-xl after:absolute after:-bottom-[2px] after:left-0 after:h-[2px] after:w-0 after:rounded-sm after:bg-success-500 after:transition-all after:duration-[200ms] after:ease-out group-hover:after:w-[105%]"
			href={link.href}>{link.text}</a
		>
	{/if}

	{#if link.sublinks}
		<Icon
			icon="mdi:chevron-down"
			width="24"
			class="group-hover:rotate-0 group-hover:text-success-500 rotate-180 transition-all duration-300"
		/>
	{/if}
	{#if link.sublinks}
		<div class="pt-2 hidden group-hover:block absolute left-1/2 -translate-x-1/2 top-full">
			<ul class="w-max bg-tertiary-700 flex flex-col gap-2 rounded-md p-3">
				{#each link.sublinks as sublink}
					<li>
						<a class="block px-4 py-2 hover:bg-tertiary-600 rounded" href={sublink.href}
							>{sublink.text}</a
						>
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</li>
