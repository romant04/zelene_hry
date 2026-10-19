<script lang="ts">
	import PrivateChat from '../components/private-chat.svelte';
	import type { FetchedDmData } from './+page';

	let {
		data
	}: {
		data: {
			data: FetchedDmData;
		};
	} = $props();

	let friends = $derived(
		data.data.friendships.map((friendship) =>
			friendship.user1.id === data.data.currentUserId ? friendship.user2 : friendship.user1
		)
	);
</script>

<svelte:head>
	<title>Duelovky | Chat</title>
</svelte:head>

{#if data.data}
	<PrivateChat
		currentUserId={data.data.currentUserId}
		{friends}
		chatRooms={[]}
		chatType="dm"
		restrictions={[]}
	/>
{:else}
	<p>Loading...</p>
{/if}
