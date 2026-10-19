<script lang="ts">
	import Icon from '@iconify/svelte';
	import type { PublicUser } from '../../../../types/user';
	import { setActiveChat } from '../../../../stores/active-chat';
	import { goto } from '$app/navigation';
	import { t } from '$lib/i18n';

	let {
		friend,
		isFriend,
		activeFriend = $bindable(),
		friendRequestSent,
		friendToBeRemoved = $bindable()
	}: {
		friend: PublicUser;
		isFriend: boolean;
		activeFriend?: PublicUser | null;
		friendRequestSent?: boolean;
		friendToBeRemoved?: PublicUser | null;
	} = $props();

	let initial = $derived(friend.username.charAt(0).toUpperCase());

	function handleAddFriend() {
		activeFriend = friend;
	}

	function handleRemoveFriend() {
		friendToBeRemoved = friend;
	}

	function handleChatRedirect() {
		setActiveChat(friend);
		goto('/chat/dms');
	}
</script>

<div
	class="group flex items-center justify-between gap-3 border-b border-surface-600/60 px-4 py-3 transition-colors last:border-b-0 hover:bg-surface-600/40"
>
	<div class="flex min-w-0 items-center gap-3">
		<div
			class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-600/80 font-heading text-lg font-semibold text-white"
			aria-hidden="true"
		>
			{initial}
		</div>
		<p class="truncate font-semibold tracking-wide">{friend.username}</p>
	</div>

	{#if isFriend}
		<div class="flex shrink-0 items-center gap-2">
			<button
				type="button"
				onclick={handleChatRedirect}
				class="flex h-9 w-9 items-center justify-center rounded-full bg-primary-500 transition-colors hover:bg-primary-400"
				title={t('nav.privateMessages')}
			>
				<Icon width="20" icon="mdi:chat" class="text-white" />
			</button>
			<button
				type="button"
				onclick={handleRemoveFriend}
				class="variant-filled-surface btn h-9 px-3 text-sm"
			>
				{t('friends.removeFriend')}
			</button>
		</div>
	{:else if friendRequestSent}
		<span class="pointer-events-none shrink-0 rounded-md bg-surface-600 px-3 py-2 text-sm text-surface-200">
			{t('friends.requestSent')}
		</span>
	{:else}
		<button
			type="button"
			onclick={handleAddFriend}
			class="variant-filled-primary btn h-9 shrink-0 px-4 text-sm"
		>
			{t('friends.addFriend')}
		</button>
	{/if}
</div>
