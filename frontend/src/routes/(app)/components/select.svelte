<script lang="ts">
	import Icon from '@iconify/svelte';
	import { slide } from 'svelte/transition';

	let {
		options,
		value = $bindable(),
		styles,
		optionsColors
	}: {
		options: { option: string; value: string; defaultOption?: boolean }[];
		value: string;
		styles?: string;
		optionsColors?: { selected?: string; default?: string; hover?: string };
	} = $props();

	let selected = $state<{ option: string; value: string } | null>(null);
	let isOpen = $state(false);

	$effect(() => {
		if (selected) {
			value = selected.value;
		} else {
			value = '';
		}
	});

	$effect(() => {
		if (options.length > 0) {
			const defaultOption = options.find((option) => option.defaultOption);
			if (defaultOption) {
				selected = defaultOption;
			} else {
				selected = options[0];
			}
		}
	});
</script>

<div class="relative {styles}">
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
		<div transition:slide class="absolute left-0 top-full w-full z-10">
			{#each options as option}
				{@const selectedColor = optionsColors?.selected || 'bg-primary-800'}
				{@const defaultColor = optionsColors?.default || 'bg-tertiary-800'}
				{@const hoverColor = optionsColors?.hover || 'hover:bg-tertiary-500'}
				<button
					class="w-full text-left px-4 py-2 {hoverColor} {selected?.value === option.value
						? selectedColor
						: defaultColor}"
					onclick={() => {
						selected = option;
						isOpen = false;
					}}
				>
					{option.option}
				</button>
			{/each}
		</div>
	{/if}
</div>
