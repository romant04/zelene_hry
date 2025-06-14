<script lang="ts">
	import Icon from '@iconify/svelte';
	import { slide } from 'svelte/transition';

	let {
		options,
		value = $bindable(),
		asLinks = false,
		styles,
		optionsColors
	}: {
		options: { option: string; value: string; defaultOption?: boolean }[];
		asLinks?: boolean;
		value?: string;
		styles?: string;
		optionsColors?: { selected?: string; default?: string; hover?: string };
	} = $props();

	let selected = $state<{ option: string; value: string } | null>(null);
	let isOpen = $state(false);

	function clickOutside(node: HTMLElement, handler: () => void) {
		const onClick = (event: MouseEvent) => {
			if (!node.contains(event.target as Node)) {
				handler();
			}
		};

		document.addEventListener('click', onClick, true);

		return {
			destroy() {
				document.removeEventListener('click', onClick, true);
			}
		};
	}

	$effect(() => {
		if (selected && !asLinks) {
			value = selected.value;
		}
	});

	$effect(() => {
		if (options.length > 0) {
			const defaultOption = options.find((option) => option.defaultOption);
			if (defaultOption) {
				selected = defaultOption;
			}
		}
	});
</script>

<div class="relative {styles}" use:clickOutside={() => (isOpen = false)}>
	<button class="flex justify-between w-full" onclick={() => (isOpen = !isOpen)}>
		<span>{selected?.option}</span>
		<Icon
			icon="mdi:chevron-down"
			class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 {isOpen
				? 'rotate-180'
				: ''}"
		/>
	</button>

	{#if isOpen}
		<div transition:slide class="absolute left-0 top-full w-full z-10 flex flex-col">
			{#each options as option}
				{@const selectedColor = optionsColors?.selected || 'bg-primary-800'}
				{@const defaultColor = optionsColors?.default || 'bg-tertiary-800'}
				{@const hoverColor = optionsColors?.hover || 'hover:bg-tertiary-500'}
				{#if asLinks}
					<a
						class="w-full text-left px-4 py-2 {hoverColor} {selected?.value ===
						option.value
							? selectedColor
							: defaultColor}"
						href={option.value}
						onclick={() => {
							selected = option;
							isOpen = false;
						}}
					>
						{option.option}
					</a>
				{:else}
					<button
						class="w-full text-left px-4 py-2 {hoverColor} {selected?.value ===
						option.value
							? selectedColor
							: defaultColor}"
						onclick={() => {
							selected = option;
							isOpen = false;
						}}
					>
						{option.option}
					</button>
				{/if}
			{/each}
		</div>
	{/if}
</div>
