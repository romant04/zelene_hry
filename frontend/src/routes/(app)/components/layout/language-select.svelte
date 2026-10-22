<script lang="ts">
	import { slide } from 'svelte/transition';
	import flagCs from '../../../../assets/images/flag-czechia.png';
	import flagEn from '../../../../assets/images/flag-uk.png';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { i18n, rememberLocale, switchLocalePath, t, type Locale } from '$lib/i18n';

	let {
		onChange
	}: {
		onChange?: (locale: Locale) => void;
	} = $props();

	let isOpen = $state(false);

	const options: { locale: Locale; flag: string; labelKey: 'language.cs' | 'language.en' }[] = [
		{ locale: 'cs', flag: flagCs, labelKey: 'language.cs' },
		{ locale: 'en', flag: flagEn, labelKey: 'language.en' }
	];

	let selected = $derived.by(() => {
		const current = i18n.locale;
		return options.find((option) => option.locale === current) ?? options[0];
	});

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

	function selectLocale(next: Locale) {
		isOpen = false;
		if (next === i18n.locale) return;
		rememberLocale(next);
		onChange?.(next);
		// Each language has its own URL, so switching = going to this page in the other language
		const { pathname, search, hash } = page.url;
		void goto(switchLocalePath(pathname + search + hash, next));
	}
</script>

<div class="relative" use:clickOutside={() => (isOpen = false)}>
	<button
		type="button"
		class="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-tertiary-700 transition-transform hover:scale-105"
		aria-label={t(selected.labelKey)}
		aria-expanded={isOpen}
		onclick={() => (isOpen = !isOpen)}
	>
		<img src={selected.flag} alt="" class="h-full w-full object-cover" />
	</button>

	{#if isOpen}
		<div
			transition:slide={{ duration: 150 }}
			class="absolute right-0 top-full z-20 mt-2 flex flex-col gap-1 rounded-full bg-tertiary-700 p-1 shadow-lg"
		>
			{#each options as option}
				<button
					type="button"
					class="h-9 w-9 overflow-hidden rounded-full border transition-transform hover:scale-105 {option.locale ===
					i18n.locale
						? 'border-primary-400 ring-2 ring-primary-500'
						: 'border-transparent hover:border-tertiary-300'}"
					aria-label={t(option.labelKey)}
					aria-pressed={option.locale === i18n.locale}
					onclick={() => selectLocale(option.locale)}
				>
					<img src={option.flag} alt="" class="h-full w-full object-cover" />
				</button>
			{/each}
		</div>
	{/if}
</div>
