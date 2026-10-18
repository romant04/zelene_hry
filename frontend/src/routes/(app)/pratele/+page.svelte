<script lang="ts">
	import PlayerCard from './components/player-card.svelte';
	import FriendRequestTab from './components/friend-request.svelte';
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
	import type { FetchedSocialData } from './+page';
	import FriendList from './components/friend-list.svelte';
	import { t, tt } from '$lib/i18n';

	type HubTab = 'friends' | 'requests' | 'find';

	let friendSocket: Socket | null = $state(null);
	let { data }: { data: { data: FetchedSocialData } } = $props();

	let filter = $state('');
	let activeFriend: User | null = $state(null);
	let friendToBeRemoved: User | null = $state(null);
	let friendRequests: FriendRequest[] = $state([]);
	let friendships: Friendship[] = $state([]);
	let activeTab = $state<HubTab>('friends');
	let didPickInitialTab = $state(false);

	let incomingRequests = $derived(
		$auth.data?.id
			? friendRequests.filter((fr) => fr.receiver.id === $auth.data!.id)
			: []
	);

	let suggestedPlayers = $derived.by(() => {
		if (!data.data || !$auth.data) return [];
		const userId = $auth.data.id;
		return data.data.suggestedFriends
			.filter(
				(user) =>
					user.id !== userId &&
					!friendships.some(
						(friendship) =>
							friendship.user1.id === user.id || friendship.user2.id === user.id
					)
			)
			.filter((user) => user.username.toLowerCase().includes(filter.toLowerCase()));
	});

	$effect(() => {
		if (data.data) {
			friendships = data.data.friendships;
			friendRequests = data.data.friendRequests;
		}
	});

	// Land on Requests when there are incoming requests and no friends yet.
	$effect(() => {
		if (didPickInitialTab || !data.data || !$auth.data) return;
		didPickInitialTab = true;
		if (friendships.length === 0 && incomingRequests.length > 0) {
			activeTab = 'requests';
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
					tt('friends.requestRejected', { username: friendRequest.receiver.username }),
					'error',
					10000
				);
				updateAfterFriendRequest(false, friendRequest);
			});
			friendSocket.on(
				'friendRequestAccepted',
				(payload: { friendRequest: FriendRequest; newFriend: Friendship }) => {
					updateAfterFriendRequest(true, payload.friendRequest, payload.newFriend);
				}
			);

			friendSocket.on('friendRequestSent', (friendRequest: FriendRequest) => {
				addToast(
					tt('friends.newRequest', { username: friendRequest.sender.username }),
					'success'
				);
				friendRequests.push(friendRequest);
			});

			friendSocket.on('friendRemoved', (friend: User) => {
				addToast(tt('friends.removedYou', { username: friend.username }), 'error');
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

	const tabs: { id: HubTab; labelKey: 'friends.myFriends' | 'friends.friendRequests' | 'friends.findPlayers' }[] =
		[
			{ id: 'friends', labelKey: 'friends.myFriends' },
			{ id: 'requests', labelKey: 'friends.friendRequests' },
			{ id: 'find', labelKey: 'friends.findPlayers' }
		];
</script>

<svelte:head>
	<title>{t('friends.pageTitle')}</title>
</svelte:head>

{#if friendToBeRemoved}
	<RemoveFriendModal bind:friend={friendToBeRemoved} {friendSocket} {updateAfterFriendRemoved} />
{/if}
{#if activeFriend}
	<FriendRequestModal bind:friend={activeFriend} bind:friendRequests bind:friendSocket />
{/if}

<div class="container mx-auto mt-14 max-w-5xl px-4 pb-16">
	<header class="mb-8">
		<h1 class="font-heading text-4xl font-semibold tracking-wide md:text-5xl">
			{t('friends.hubTitle')}
		</h1>
		<p class="mt-2 max-w-xl text-base text-surface-200 md:text-lg">
			{t('friends.hubSubtitle')}
		</p>
	</header>

	<div class="overflow-hidden rounded-xl bg-surface-700/80">
		<div
			class="flex flex-wrap gap-1 border-b border-surface-600/60 bg-surface-800/50 p-1.5 sm:flex-nowrap"
			role="tablist"
			aria-label={t('friends.hubTitle')}
		>
			{#each tabs as tab}
				<button
					type="button"
					role="tab"
					aria-selected={activeTab === tab.id}
					onclick={() => (activeTab = tab.id)}
					class="relative flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-3 text-sm font-semibold tracking-wide transition-colors sm:text-base
						{activeTab === tab.id
						? 'bg-primary-500 text-white shadow-sm'
						: 'text-surface-200 hover:bg-surface-700/80 hover:text-white'}"
				>
					{t(tab.labelKey)}
					{#if tab.id === 'requests' && incomingRequests.length > 0}
						<span
							class="min-w-[1.25rem] rounded-full px-1.5 py-0.5 text-center text-xs font-bold
								{activeTab === 'requests' ? 'bg-white/20 text-white' : 'bg-primary-500 text-white'}"
						>
							{incomingRequests.length}
						</span>
					{/if}
				</button>
			{/each}
		</div>

		<section class="flex min-h-[28rem] max-h-[34rem] flex-col" role="tabpanel">
		{#if activeTab === 'find'}
			<div class="shrink-0 border-b border-surface-600/60 px-4 py-3">
				<Search bind:filter />
			</div>
		{/if}

		{#if activeTab === 'friends'}
			<FriendList {friendships} bind:friendToBeRemoved pageSize={8} />
		{:else if activeTab === 'requests'}
			<div class="min-h-0 flex-1 overflow-auto">
				{#if !$auth.data}
					<p class="px-4 py-6 text-surface-200">{t('common.loading')}</p>
				{:else if incomingRequests.length === 0}
					<div
						class="flex h-full min-h-[16rem] flex-col items-center justify-center gap-2 px-6 text-center"
					>
						<p class="text-surface-200">{t('friends.noRequests')}</p>
					</div>
				{:else}
					{#each incomingRequests as request (request.sender.id + '-' + request.receiver.id)}
						<FriendRequestTab
							friendRequest={request}
							{updateAfterFriendRequest}
							{friendSocket}
						/>
					{/each}
				{/if}
			</div>
		{:else if activeTab === 'find'}
			<div class="min-h-0 flex-1 overflow-auto">
				{#if !data.data || !$auth.data}
					<p class="px-4 py-6 text-surface-200">{t('common.loading')}</p>
				{:else if suggestedPlayers.length === 0}
					<div
						class="flex h-full min-h-[16rem] flex-col items-center justify-center gap-2 px-6 text-center"
					>
						<p class="text-surface-200">{t('friends.noPlayersFound')}</p>
					</div>
				{:else}
					{#each suggestedPlayers as player (player.id)}
						<PlayerCard
							friend={player}
							isFriend={false}
							bind:activeFriend
							friendRequestSent={friendRequests.some((fr) => fr.receiver.id === player.id)}
						/>
					{/each}
				{/if}
			</div>
		{/if}
		</section>
	</div>
</div>
