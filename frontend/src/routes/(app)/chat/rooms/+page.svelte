<script lang="ts">
	import PrivateChat from '../components/private-chat.svelte';
	import { auth } from '../../../../stores/auth';
	import RestrictionOverlay from '../components/restriction-overlay.svelte';
	import type { FetchedChatData } from './+page';

	let {
		data
	}: {
		data: {
			data: FetchedChatData;
		};
	} = $props();

	$effect(() => {
		console.log(data);
	});
</script>

<svelte:head>
	<title>Duelovky | Chat</title>
</svelte:head>

{#if $auth.data !== null && data.data}
	<RestrictionOverlay />
	{@const userId = $auth.data.id}
	<PrivateChat
		chatRooms={data.data.chatRooms}
		friends={data.data.friendships.map((friendship) => {
			return friendship.user1.id === userId ? friendship.user2 : friendship.user1;
		})}
		restrictions={data.data.restrictions}
		chatType="group"
	/>
{:else}
	<p>Loading...</p>
{/if}
