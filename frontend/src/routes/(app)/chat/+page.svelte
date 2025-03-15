<script lang="ts">
	import PrivateChat from './components/private-chat.svelte';
	import type { PageProps } from '../../../../.svelte-kit/types/src/routes/(app)/chat/$types';
	import { auth } from '../../../stores/auth';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Duelovky | chat</title>
</svelte:head>

{#if $auth.data !== null && data.data}
	{@const userId = $auth.data.id}
	<PrivateChat
		friends={data.data.friendships.map((friendship) => {
			return friendship.user1.id === userId ? friendship.user2 : friendship.user1;
		})}
	/>
{:else}
	<p>Loading...</p>
{/if}
