<script lang="ts">
	import PlayerCard from './player-card.svelte';
	import { auth } from '../../../../stores/auth';
	import type { Friendship } from '../../../../types/friendship';
	import type { User } from '../../../../types/user';
	import { t } from '$lib/i18n';

	let {
		friendships,
		pageSize = 8,
		friendToBeRemoved = $bindable()
	}: {
		friendships: Friendship[];
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

<div class="flex min-h-0 flex-1 flex-col">
	<div class="min-h-0 flex-1 overflow-auto">
		{#if $auth.data !== null}
			{#if friends.length === 0}
				<div class="flex h-full min-h-[16rem] flex-col items-center justify-center gap-2 px-6 text-center">
					<p class="text-surface-200">{t('friends.noFriends')}</p>
				</div>
			{:else}
				{#each pagedFriends as friend (friend.id)}
					<PlayerCard {friend} isFriend={true} bind:friendToBeRemoved />
				{/each}
			{/if}
		{:else}
			<p class="px-4 py-6 text-surface-200">{t('common.loading')}</p>
		{/if}
	</div>

	{#if $auth.data !== null && totalPages > 1}
		<div class="flex h-12 shrink-0 items-center justify-center gap-4 border-t border-surface-600/60">
			<button
				type="button"
				class="rounded px-2 py-1 text-xl disabled:opacity-40"
				onclick={prevPage}
				disabled={page === 0}
			>
				←
			</button>
			<span class="text-sm tabular-nums">{page + 1} / {totalPages}</span>
			<button
				type="button"
				class="rounded px-2 py-1 text-xl disabled:opacity-40"
				onclick={nextPage}
				disabled={page === totalPages - 1}
			>
				→
			</button>
		</div>
	{/if}
</div>
