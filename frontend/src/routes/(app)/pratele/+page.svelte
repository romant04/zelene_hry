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

	let searchTerm = $state('');
	let filter = $state('');
	let debounceTimeout: number | null = $state(null);

	let activeFriend: User | null = $state(null);
	let friendToBeRemoved: User | null = $state(null);

	let { data }: PageProps = $props();

	let friendRequests: FriendRequest[] = $state([]);
	let friendships: Friendship[] = $state([]);

	$effect(() => {
		if (data.data) {
			friendships = data.data.friendships;
			friendRequests = data.data.friendRequest;
		}
	});

	function handleSearch(event: Event & { currentTarget: EventTarget & HTMLInputElement }) {
		if (!event.target) {
			return;
		}

		searchTerm = (event.target as HTMLInputElement).value;
		if (debounceTimeout) {
			clearTimeout(debounceTimeout);
		}
		debounceTimeout = window.setTimeout(() => {
			filter = searchTerm;
			debounceTimeout = null;
		}, 750);
	}

	function updateAfterFriendRequest(
		gotAccepted: boolean,
		friendRequest: FriendRequest,
		newFriend?: Friendship
	) {
		if (!$auth.data || !data.data) {
			return;
		}

		friendRequests = friendRequests.filter(
			(request) => request.sender.id !== friendRequest.sender.id
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

	// TODO: Implement pagination instead of scrollbar where it looks better
</script>

<svelte:head>
	<title>Duelovky | Přátelé</title>
</svelte:head>

{#if friendToBeRemoved}
	<RemoveFriendModal bind:friend={friendToBeRemoved} {updateAfterFriendRemoved} />
{/if}
{#if activeFriend}
	<FriendRequestModal bind:friend={activeFriend} />
{/if}
<div class="container mt-16 grid grid-cols-1 lg:grid-cols-2 gap-10">
	<div>
		<h2 class="font-heading text-4xl font-semibold">Najít hráče</h2>
		<div
			class="mt-5 rounded-md bg-gradient-to-tr from-tertiary-700 to-tertiary-500 p-5 shadow-sm shadow-primary-600"
		>
			<div class="flex items-center gap-2">
				<label for="search" class="label text-sm font-bold">Vyhledat: </label>
				<input
					type="text"
					name="search"
					class="input !bg-surface-900 px-2 py-1"
					placeholder="Jméno hráče"
					oninput={handleSearch}
				/>
			</div>
			<div class="mt-5 flex h-[30rem] flex-col gap-2 overflow-auto">
				{#if data.data && $auth.data !== null}
					{@const userId = $auth.data.id}
					{#each data.data.suggestedFriends
						.filter((user) => user.id !== userId && friendships.find((friendship) => friendship.user1.id === user.id || friendship.user2.id === user.id) === undefined)
						.filter((x) => x.username
								.toLowerCase()
								.includes(filter.toLowerCase())) as player}
						<PlayerCard friend={player} isFriend={false} bind:activeFriend />
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
				{#each friendRequests as request}
					<FriendRequestTab friendRequest={request} {updateAfterFriendRequest} />
				{/each}
			</div>
		</div>
	</div>
</div>
