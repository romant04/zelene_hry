<script lang="ts">
	import Icon from '@iconify/svelte';
	import { t } from '$lib/i18n';

	let { filter = $bindable() }: { filter: string } = $props();

	let searchTerm = $state('');
	let debounceTimeout: number | null = $state(null);

	function handleSearch(event: Event & { currentTarget: EventTarget & HTMLInputElement }) {
		searchTerm = event.currentTarget.value;
		if (debounceTimeout) {
			clearTimeout(debounceTimeout);
		}
		debounceTimeout = window.setTimeout(() => {
			filter = searchTerm;
			debounceTimeout = null;
		}, 400);
	}
</script>

<label class="relative block w-full max-w-md">
	<span class="sr-only">{t('friends.searchLabel')}</span>
	<Icon
		icon="mdi:magnify"
		width="20"
		class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-surface-300"
	/>
	<input
		type="search"
		name="search"
		class="input w-full !bg-surface-800 py-2 pl-10 pr-3 text-sm"
		placeholder={t('friends.playerNamePlaceholder')}
		oninput={handleSearch}
	/>
</label>
