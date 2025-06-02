<script lang="ts">
	let { filter = $bindable() }: { filter: string } = $props();

	let searchTerm = $state('');
	let debounceTimeout: number | null = $state(null);
	function handleSearch(event: Event & { currentTarget: EventTarget & HTMLInputElement }) {
		if (!event.target) {
			return;
		}

		searchTerm = (event.target as HTMLInputElement).value;
		if (debounceTimeout) {
			clearTimeout(debounceTimeout);
		}
		debounceTimeout = window.setTimeout(() => {
			filter = searchTerm;
			debounceTimeout = null;
		}, 750);
	}
</script>

<div class="flex items-center gap-2">
	<label for="search" class="label text-sm font-bold">Vyhledat: </label>
	<input
		type="text"
		name="search"
		class="input !bg-surface-900 px-2 py-1"
		placeholder="Jméno hráče"
		oninput={handleSearch}
	/>
</div>
