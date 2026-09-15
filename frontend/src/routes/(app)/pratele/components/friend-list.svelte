<script lang="ts">
	import PlayerCard from './player-card.svelte';
	import { auth } from '../../../../stores/auth';
	import type { Friendship } from '../../../../types/friendship';
	import type { User } from '../../../../types/user';

	let {
		title = 'Moji přátelé',
		friendships,
		bgColor = 'bg-surface-700',
		pageSize = 5,
		friendToBeRemoved = $bindable()
	}: {
		title?: string;
		friendships: Friendship[];
		bgColor?: string;
		pageSize?: number;
		friendToBeRemoved: User | null;
	} = $props();

	let page = $state(0);

	const friends = $derived(
		$auth.data !== null
			? friendships.map((friendship) => {
					const userId = $auth.data!.id;
					return userId === friendship.user1.id ? friendship.user2 : friendship.user1;
				})
			: []
	);

	const totalPages = $derived(Math.max(1, Math.ceil(friends.length / pageSize)));

	const pagedFriends = $derived(friends.slice(page * pageSize, page * pageSize + pageSize));

	// Clamp page if the list shrinks (e.g. after removing a friend)
	$effect(() => {
		if (page > totalPages - 1) {
			page = Math.max(0, totalPages - 1);
		}
	});

	function prevPage() {
		if (page > 0) page -= 1;
	}

	function nextPage() {
		if (page < totalPages - 1) page += 1;
	}
</script>

<div class="flex h-[380px] flex-col">
	<h2 class="font-heading text-3xl font-semibold shrink-0">{title}</h2>

	<div class="mt-5 flex min-h-0 flex-1 flex-col justify-start gap-2">
		{#if $auth.data !== null}
			{#if pagedFriends.length === 0}
				<p class="text-md text-surface-200">Nemáte žádné přátele.</p>
			{/if}

			{#each pagedFriends as friend}
				<PlayerCard {bgColor} {friend} isFriend={true} bind:friendToBeRemoved />
			{/each}
		{:else}
			<p>Loading...</p>
		{/if}
	</div>

	<div class="mt-3 flex h-10 shrink-0 items-center justify-center gap-3">
		{#if $auth.data !== null && totalPages > 1}
			<button
				class="rounded px-2 py-1 disabled:opacity-40 text-xl"
				onclick={prevPage}
				disabled={page === 0}
			>
				←
			</button>
			<span class="text-md">{page + 1} / {totalPages}</span>
			<button
				class="rounded px-2 py-1 disabled:opacity-40 text-xl"
				onclick={nextPage}
				disabled={page === totalPages - 1}
			>
				→
			</button>
		{/if}
	</div>
</div>
