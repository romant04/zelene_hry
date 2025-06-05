<script lang="ts">
	import PlayerCard from './components/player-card.svelte';
	import FriendRequestTab from './components/friend-request.svelte';
	import type { PageProps } from '../../../../.svelte-kit/types/src/routes/(app)/pratele/$types';
	import { auth } from '../../../stores/auth';
	import FriendRequestModal from './components/friend-request-modal.svelte';
	import type { User } from '../../../types/user';
	import type { FriendRequest } from '../../../types/friendRequest';
	import type { Friendship } from '../../../types/friendship';
	import RemoveFriendModal from './components/remove-friend-modal.svelte';
	import Search from './components/search.svelte';
	import { createFriendsSocket } from '$lib/socket';
	import type { Socket } from 'socket.io-client';
	import { addToast } from '../../../stores/toast';
	import { clearSocket } from '../../../utils/socket';
	import { onDestroy } from 'svelte';

	let friendSocket: Socket | null = $state(null);
	let { data }: PageProps = $props();

	let filter = $state('');
	let activeFriend: User | null = $state(null);

	let friendToBeRemoved: User | null = $state(null);

	let friendRequests: FriendRequest[] = $state([]);
	let friendships: Friendship[] = $state([]);

	$effect(() => {
		if (data.data) {
			friendships = data.data.friendships;
			friendRequests = data.data.friendRequest;
		}
	});

	function updateAfterFriendRequest(
		gotAccepted: boolean,
		friendRequest: FriendRequest,
		newFriend?: Friendship
	) {
		if (!$auth.data || !data.data) {
			return;
		}

		friendRequests = friendRequests.filter(
			(request) =>
				request.sender.id !== friendRequest.sender.id ||
				request.receiver.id !== friendRequest.receiver.id
		);

		if (gotAccepted && newFriend) {
			friendships = [...friendships, newFriend];
		}
	}

	function updateAfterFriendRemoved(friend: User) {
		if (!$auth.data || !data.data) {
			return;
		}

		friendships = friendships.filter(
			(friendship) => friendship.user1.id !== friend.id && friendship.user2.id !== friend.id
		);
	}

	$effect(() => {
		if (!$auth.data?.id) {
			return;
		}

		if (friendSocket === null) {
			friendSocket = createFriendsSocket($auth.data.id);

			friendSocket.on('friendRequestRejected', (friendRequest: FriendRequest) => {
				addToast(
					`Vaše žádost o přátelství uživateli ${friendRequest.receiver.username} byla zamítnuta`,
					'error',
					10000
				);
				updateAfterFriendRequest(false, friendRequest);
			});
			friendSocket.on(
				'friendRequestAccepted',
				(data: { friendRequest: FriendRequest; newFriend: Friendship }) => {
					updateAfterFriendRequest(true, data.friendRequest, data.newFriend);
				}
			);

			friendSocket.on('friendRequestSent', (friendRequest: FriendRequest) => {
				addToast(
					`Přišla vám nová žádost o přátelství od uživatele ${friendRequest.sender.username}`,
					'success'
				);
				friendRequests.push(friendRequest);
			});

			friendSocket.on('friendRemoved', (friend: User) => {
				addToast(`Uživatel ${friend.username} si vás odstranil z přátel`, 'error');
				updateAfterFriendRemoved(friend);
			});
		}
	});

	onDestroy(() => {
		if (friendSocket) {
			clearSocket(friendSocket);
			friendSocket = null;
		}
	});

	// TODO: Implement pagination instead of scrollbar where it looks better
</script>

<svelte:head>
	<title>Duelovky | Přátelé</title>
</svelte:head>

{#if friendToBeRemoved}
	<RemoveFriendModal bind:friend={friendToBeRemoved} {friendSocket} {updateAfterFriendRemoved} />
{/if}
{#if activeFriend}
	<FriendRequestModal bind:friend={activeFriend} bind:friendRequests bind:friendSocket />
{/if}
<div class="container mt-16 grid grid-cols-1 lg:grid-cols-2 gap-10">
	<div>
		<h2 class="font-heading text-4xl font-semibold">Najít hráče</h2>
		<div
			class="mt-5 rounded-md bg-gradient-to-tr from-tertiary-700 to-tertiary-500 p-5 shadow-sm shadow-primary-600"
		>
			<Search bind:filter />
			<div class="mt-5 flex h-[30rem] flex-col gap-2 overflow-auto">
				{#if data.data && $auth.data !== null}
					{@const userId = $auth.data.id}
					{#each data.data.suggestedFriends
						.filter((user) => user.id !== userId && friendships.find((friendship) => friendship.user1.id === user.id || friendship.user2.id === user.id) === undefined)
						.filter((x) => x.username
								.toLowerCase()
								.includes(filter.toLowerCase())) as player}
						<PlayerCard
							friend={player}
							isFriend={false}
							bind:activeFriend
							friendRequestSent={friendRequests.some(
								(fr) => fr.receiver.id === player.id
							)}
						/>
					{/each}
				{:else}
					<p>Loading...</p>
				{/if}
			</div>
		</div>
	</div>

	<div class="flex flex-col gap-10">
		<div>
			<h2 class="font-heading text-4xl font-semibold">Moji přátelé</h2>
			<div class="mt-5 flex max-h-[15rem] flex-col gap-2 overflow-auto">
				{#if $auth.data !== null}
					{@const userId = $auth.data.id}
					{#each friendships.map((friendship) => {
						if (userId === friendship.user1.id) {
							return friendship.user2;
						} else {
							return friendship.user1;
						}
					}) as friend}
						<PlayerCard
							bgColor="bg-surface-600"
							{friend}
							isFriend={true}
							bind:friendToBeRemoved
						/>
					{/each}
				{:else}
					<p>Loading...</p>
				{/if}
			</div>
		</div>
		<div>
			<h2 class="font-heading text-4xl font-semibold">Žádosti o přátelství</h2>
			<div class="mt-5 flex max-h-[15rem] flex-col gap-2 overflow-auto">
				{#if $auth.data?.id}
					{@const userId = $auth.data.id}
					{#each friendRequests.filter((fr) => fr.receiver.id === userId) as request}
						<FriendRequestTab
							friendRequest={request}
							{updateAfterFriendRequest}
							{friendSocket}
						/>
					{/each}
				{/if}
			</div>
		</div>
	</div>
</div>
