<script lang="ts">
	import Icon from '@iconify/svelte';
	import type { User } from '../../../../types/user';

	let {
		friend,
		isFriend,
		activeFriend = $bindable(),
		friendToBeRemoved = $bindable(),
		bgColor
	}: {
		friend: User;
		isFriend: boolean;
		activeFriend?: User | null;
		friendToBeRemoved?: User | null;
		bgColor?: string;
	} = $props();

	function handleAddFriend() {
		activeFriend = friend;
	}

	function handleRemoveFriend() {
		friendToBeRemoved = friend;
	}

	// TODO: open modal to ask if you want to remove friend
</script>

<div
	class="{bgColor ??
		'bg-surface-900'} flex flex-col sm:flex-row gap-y-2 sm:items-center justify-between rounded-md p-3 sm:px-6 sm:py-3"
>
	<p class="font-semibold">{friend.username}</p>
	{#if isFriend}
		<div class="flex items-center gap-2">
			<Icon
				width="32"
				icon="mdi:chat"
				class="h-9 w-9 cursor-pointer rounded-full bg-primary-500 p-2 transition-all duration-150 hover:bg-primary-400"
			/>
			<button onclick={handleRemoveFriend} class="variant-filled-error btn h-9 w-32 text-sm"
				>Odebrat z přátel</button
			>
		</div>
	{:else}
		<button onclick={handleAddFriend} class="variant-filled-primary btn h-9 w-32 text-sm"
			>Přidat do přátel</button
		>
	{/if}
</div>
