<script lang="ts">
	import Icon from '@iconify/svelte';
	import LanguageSelect from './language-select.svelte';
	import { t, type Locale, localizeHref } from '$lib/i18n';

	let {
		isOpen = $bindable(false),
		links,
		isAuthenticated,
		onLocaleChange
	}: {
		isOpen: boolean;
		links: { href: string; text: string }[];
		isAuthenticated: number;
		onLocaleChange?: (locale: Locale) => void;
	} = $props();

	function handleClose() {
		isOpen = false;
	}
</script>

<div
	class="{isOpen
		? 'opacity-50'
		: 'pointer-events-none opacity-0'} fixed top-0 z-40 h-full w-full bg-black transition-all duration-200"
></div>
<div
	class="{isOpen
		? '-translate-x-[100%] md:-translate-x-[200%]'
		: 'translate-x-0'} fixed -right-full top-0 z-50 h-full w-full bg-tertiary-800 p-6 transition-all duration-500 md:w-1/2"
>
	<div class="flex items-center justify-between">
		<a href={localizeHref('/')} onclick={handleClose}>
			<h2 class="font-heading text-3xl font-semibold">Duelovky</h2>
		</a>
		<div class="flex items-center gap-3">
			<LanguageSelect onChange={onLocaleChange} />
			<Icon
				width="28"
				icon="system-uicons:cross"
				class="cursor-pointer"
				onclick={handleClose}
			/>
		</div>
	</div>

	<div class="mt-10 flex flex-col gap-3">
		{#each links as link}
			<a
				onclick={handleClose}
				class="btn !justify-start rounded-md bg-surface-700 !p-4"
				href={link.href}>{link.text}</a
			>
		{/each}
	</div>

	{#if isAuthenticated !== 1}
		<a
			onclick={handleClose}
			href={localizeHref('/login')}
			class="flex variant-filled-primary absolute bottom-10 left-1/2 -translate-x-1/2 btn h-10 w-[90%] items-center justify-center text-sm font-bold uppercase tracking-wide"
		>
			{t('nav.login')}
		</a>
	{/if}
</div>
