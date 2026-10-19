<script lang="ts">
	import PlayerCard from './components/player-card.svelte';
	import FriendRequestTab from './components/friend-request.svelte';
	import { auth } from '../../../stores/auth';
	import FriendRequestModal from './components/friend-request-modal.svelte';
	import type { PublicUser } from '../../../types/user';
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
	import { API } from '../../../constants/urls';

	type HubTab = 'friends' | 'requests' | 'find';

	interface UserSearchPage {
		content: PublicUser[];
		totalPages: number;
		number: number;
		empty: boolean;
	}

	const FIND_PAGE_SIZE = 20;

	let friendSocket: Socket | null = $state(null);
	let { data }: { data: { data: FetchedSocialData } } = $props();

	let filter = $state('');
	let activeFriend: PublicUser | null = $state(null);
	let friendToBeRemoved: PublicUser | null = $state(null);
	let friendRequests: FriendRequest[] = $state([]);
	let friendships: Friendship[] = $state([]);
	let activeTab = $state<HubTab>('friends');
	let didPickInitialTab = $state(false);

	let findResults: PublicUser[] = $state([]);
	let findPage = $state(0);
	let findTotalPages = $state(1);
	let findLoading = $state(false);
	let findError = $state(false);
	let findRequestId = 0;

	let currentUserId = $derived(data.data?.currentUserId);

	let incomingRequests = $derived(
		currentUserId != null ? friendRequests.filter((fr) => fr.receiver.id === currentUserId) : []
	);

	$effect(() => {
		if (data.data) {
			friendships = data.data.friendships;
			friendRequests = data.data.friendRequests;
		}
	});

	// Land on Requests when there are incoming requests and no friends yet.
	$effect(() => {
		if (didPickInitialTab || !data.data || currentUserId == null) return;
		didPickInitialTab = true;
		if (friendships.length === 0 && incomingRequests.length > 0) {
			activeTab = 'requests';
		}
	});

	async function loadFindPage(page: number, query: string) {
		const token = localStorage.getItem('token');
		if (!token) return;

		const requestId = ++findRequestId;
		findLoading = true;
		findError = false;

		try {
			const params = new URLSearchParams({
				q: query,
				page: String(page),
				size: String(FIND_PAGE_SIZE)
			});
			const res = await fetch(`${API}/api/secured/users/search?${params}`, {
				headers: { Authorization: `Bearer ${token}` }
			});

			if (!res.ok) {
				throw new Error('search failed');
			}

			const body = (await res.json()) as UserSearchPage;
			if (requestId !== findRequestId) return;

			findResults = body.content ?? [];
			findTotalPages = Math.max(1, body.totalPages ?? 1);
			findPage = body.number ?? page;
		} catch {
			if (requestId !== findRequestId) return;
			findError = true;
			findResults = [];
			findTotalPages = 1;
			findPage = 0;
		} finally {
			if (requestId === findRequestId) {
				findLoading = false;
			}
		}
	}

	// Fetch Find results when tab is open; refetch on search filter changes.
	$effect(() => {
		if (activeTab !== 'find') return;
		const query = filter;
		void loadFindPage(0, query);
	});

	function prevFindPage() {
		if (findPage > 0) void loadFindPage(findPage - 1, filter);
	}

	function nextFindPage() {
		if (findPage < findTotalPages - 1) void loadFindPage(findPage + 1, filter);
	}

	function updateAfterFriendRequest(
		gotAccepted: boolean,
		friendRequest: FriendRequest,
		newFriend?: Friendship
	) {
		if (currentUserId == null || !data.data) {
			return;
		}

		friendRequests = friendRequests.filter(
			(request) =>
				request.sender.id !== friendRequest.sender.id ||
				request.receiver.id !== friendRequest.receiver.id
		);

		if (gotAccepted && newFriend) {
			friendships = [...friendships, newFriend];
			findResults = findResults.filter(
				(user) =>
					user.id !== friendRequest.sender.id && user.id !== friendRequest.receiver.id
			);
		}
	}

	function updateAfterFriendRemoved(friend: PublicUser) {
		if (currentUserId == null || !data.data) {
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

			friendSocket.on('friendRemoved', (friend: PublicUser) => {
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

	const tabs: {
		id: HubTab;
		labelKey: 'friends.myFriends' | 'friends.friendRequests' | 'friends.findPlayers';
	}[] = [
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

		<section class="flex h-[28rem] flex-col" role="tabpanel">
			{#if activeTab === 'find'}
				<div class="shrink-0 border-b border-surface-600/60 px-4 py-3">
					<Search bind:filter />
				</div>
			{/if}

			{#if activeTab === 'friends'}
				{#if currentUserId != null}
					<FriendList {friendships} {currentUserId} bind:friendToBeRemoved pageSize={8} />
				{:else}
					<p class="px-4 py-6 text-surface-200">{t('common.loading')}</p>
				{/if}
			{:else if activeTab === 'requests'}
				<div class="min-h-0 flex-1 overflow-auto">
					{#if currentUserId == null}
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
				<div class="flex min-h-0 flex-1 flex-col">
					<div class="min-h-0 flex-1 overflow-auto">
						{#if findLoading && findResults.length === 0}
							<p class="px-4 py-6 text-surface-200">{t('common.loading')}</p>
						{:else if findError}
							<div
								class="flex h-full min-h-[16rem] flex-col items-center justify-center gap-2 px-6 text-center"
							>
								<p class="text-surface-200">{t('friends.noPlayersFound')}</p>
							</div>
						{:else if findResults.length === 0}
							<div
								class="flex h-full min-h-[16rem] flex-col items-center justify-center gap-2 px-6 text-center"
							>
								<p class="text-surface-200">{t('friends.noPlayersFound')}</p>
							</div>
						{:else}
							{#each findResults as player (player.id)}
								<PlayerCard
									friend={player}
									isFriend={false}
									bind:activeFriend
									friendRequestSent={friendRequests.some(
										(fr) => fr.receiver.id === player.id
									)}
								/>
							{/each}
						{/if}
					</div>

					{#if findTotalPages > 1}
						<div
							class="flex h-12 shrink-0 items-center justify-center gap-4 border-t border-surface-600/60"
						>
							<button
								type="button"
								class="rounded px-2 py-1 text-xl disabled:opacity-40"
								onclick={prevFindPage}
								disabled={findPage === 0 || findLoading}
							>
								←
							</button>
							<span class="text-sm tabular-nums"
								>{findPage + 1} / {findTotalPages}</span
							>
							<button
								type="button"
								class="rounded px-2 py-1 text-xl disabled:opacity-40"
								onclick={nextFindPage}
								disabled={findPage >= findTotalPages - 1 || findLoading}
							>
								→
							</button>
						</div>
					{/if}
				</div>
			{/if}
		</section>
	</div>
</div>
