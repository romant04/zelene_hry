<script lang="ts">
	import Icon from '@iconify/svelte';
	import type { User } from '../../../../types/user';
	import { setActiveChat } from '../../../../stores/active-chat';
	import { goto } from '$app/navigation';

	let {
		friend,
		isFriend,
		activeFriend = $bindable(),
		friendRequestSent,
		friendToBeRemoved = $bindable(),
		bgColor
	}: {
		friend: User;
		isFriend: boolean;
		activeFriend?: User | null;
		friendRequestSent?: boolean;
		friendToBeRemoved?: User | null;
		bgColor?: string;
	} = $props();

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
	class="{bgColor ??
		'bg-surface-900'} flex flex-col sm:flex-row gap-y-2 sm:items-center justify-between rounded-md p-3 sm:px-6 sm:py-3"
>
	<p class="font-semibold">{friend.username}</p>
	{#if isFriend}
		<div class="flex items-center gap-2">
			<button onclick={handleChatRedirect}>
				<Icon
					width="32"
					icon="mdi:chat"
					class="h-9 w-9 cursor-pointer rounded-full bg-primary-500 p-2 transition-all duration-150 hover:bg-primary-400"
				/>
			</button>
			<button onclick={handleRemoveFriend} class="variant-filled-error btn h-9 w-32 text-sm"
				>Odebrat z přátel</button
			>
		</div>
	{:else if friendRequestSent}
		<div class="variant-filled-surface pointer-events-none btn h-9 w-32 text-sm">
			Žádost odeslána
		</div>
	{:else}
		<button onclick={handleAddFriend} class="variant-filled-primary btn h-9 w-32 text-sm"
			>Přidat do přátel</button
		>
	{/if}
</div>
