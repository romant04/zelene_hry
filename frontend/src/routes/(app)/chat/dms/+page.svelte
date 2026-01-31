<script lang="ts">
	import PrivateChat from '../components/private-chat.svelte';
	import { auth } from '../../../../stores/auth';
	import type { FetchedDmData } from './+page';

	let {
		data
	}: {
		data: {
			data: FetchedDmData;
		};
	} = $props();
</script>

<svelte:head>
	<title>Duelovky | Chat</title>
</svelte:head>

{#if $auth.data !== null && data.data}
	{@const userId = $auth.data.id}
	<PrivateChat
		friends={data.data.friendships.map((friendship) => {
			return friendship.user1.id === userId ? friendship.user2 : friendship.user1;
		})}
		chatRooms={data.data.chatRooms}
		chatType="dm"
		restrictions={[]}
	/>
{:else}
	<p>Loading...</p>
{/if}
