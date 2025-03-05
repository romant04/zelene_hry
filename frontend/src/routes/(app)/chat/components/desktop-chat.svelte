<script lang="ts">
	import type { User } from '../../../../types/user';
	import ChatOption from './chat-option.svelte';

	let { friends }: { friends: User[] } = $props();

	let activeChat = $state(null);

	let filter = $state('');
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
		}, 500);
	}
</script>

<div class="grid grid-cols-[auto,1fr] h-[calc(100vh-72px)]">
	<div class="bg-tertiary-600 py-5 px-4 w-80">
		<h2 class="text-3xl font-semibold">Chaty</h2>
		<input
			placeholder="Vyhledat kamaráda..."
			class="input !bg-tertiary-800 py-2 text-sm font-semibold px-2 mt-3"
			type="text"
			oninput={handleSearch}
		/>
		<div class="flex flex-col gap-[2px] mt-5">
			{#each friends.filter((friend) => friend.username.includes(filter)) as friend}
				<ChatOption name={friend.username} bind:active={activeChat} />
			{/each}
		</div>
	</div>
	<div class=""></div>
</div>
