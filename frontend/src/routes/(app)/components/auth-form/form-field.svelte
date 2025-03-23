<script lang="ts">
	import type { HTMLInputTypeAttribute } from 'svelte/elements';

	let {
		signIn,
		value = $bindable(''),
		name,
		type,
		label
	}: {
		signIn: boolean;
		value: string;
		name: string;
		type: HTMLInputTypeAttribute;
		label: string;
	} = $props();
</script>

<div class="flex w-full flex-col sm:flex-row sm:items-center sm:gap-2 lg:gap-3">
	<label
		for="{name}"
		class="{signIn ? 'w-20' : 'w-32'} label text-xs sm:text-right md:text-sm lg:text-base"
		>{label}</label
	>
	<input
		bind:value="{value}"
		name="{name}"
		type="{type}"
		class="input w-full !bg-tertiary-800 p-2 text-sm"
	/>
</div>
