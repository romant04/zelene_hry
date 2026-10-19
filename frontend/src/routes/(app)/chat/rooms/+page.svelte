<script lang="ts">
	import PrivateChat from '../components/private-chat.svelte';
	import RestrictionOverlay from '../components/restriction-overlay.svelte';
	import type { FetchedChatData } from './+page';

	let {
		data
	}: {
		data: {
			data: FetchedChatData;
		};
	} = $props();
</script>

<svelte:head>
	<title>Duelovky | Chat</title>
</svelte:head>

{#if data.data}
	<RestrictionOverlay />
	<PrivateChat
		currentUserId={data.data.currentUserId}
		chatRooms={data.data.chatRooms}
		friends={[]}
		restrictions={data.data.restrictions}
		chatType="group"
	/>
{:else}
	<p>Loading...</p>
{/if}
