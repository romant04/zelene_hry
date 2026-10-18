<script lang="ts">
	import type { FriendRequest } from '../../../../types/friendRequest';
	import type { Friendship } from '../../../../types/friendship';
	import { addToast } from '../../../../stores/toast';
	import { API } from '../../../../constants/urls';
	import type { Socket } from 'socket.io-client';
	import { socialCache } from '$lib/cache/socials';
	import { t, tt } from '$lib/i18n';

	let {
		friendRequest,
		updateAfterFriendRequest,
		friendSocket
	}: {
		friendRequest: FriendRequest;
		updateAfterFriendRequest: (
			gotAccepted: boolean,
			friendRequest: FriendRequest,
			newFriend?: Friendship
		) => void;
		friendSocket: Socket | null;
	} = $props();

	let initial = $derived(friendRequest.sender.username.charAt(0).toUpperCase());
	let sentLabel = $derived(new Date(friendRequest.sentAt).toLocaleDateString());

	async function handleAccept() {
		const response = await fetch(`${API}/api/secured/friendRequest/accept`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('token')}`
			},
			body: JSON.stringify(friendRequest.sender.id)
		});

		const data = await response.json();
		if (response.ok) {
			addToast(tt('friends.acceptSuccess'), 'success');
			socialCache.clear();
			updateAfterFriendRequest(true, friendRequest, data);

			if (friendSocket) {
				friendSocket.emit('friendRequestAccepted', {
					friendRequest: friendRequest,
					newFriend: data
				});
			}
			return;
		}

		addToast(tt('friends.acceptError'), 'error');
	}

	async function handleReject() {
		const response = await fetch(`${API}/api/secured/friendRequest`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('token')}`
			},
			body: JSON.stringify(friendRequest.sender.id)
		});

		if (response.ok) {
			addToast(tt('friends.rejectSuccess'), 'success');
			socialCache.clear();
			updateAfterFriendRequest(false, friendRequest);

			if (friendSocket) {
				friendSocket.emit('friendRequestRejected', friendRequest);
			}
			return;
		}
	}
</script>

<div
	class="flex flex-col gap-3 border-b border-surface-600/60 px-4 py-3 transition-colors last:border-b-0 hover:bg-surface-600/40 sm:flex-row sm:items-center sm:justify-between"
>
	<div class="flex min-w-0 items-start gap-3">
		<div
			class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary-600/80 font-heading text-lg font-semibold text-white"
			aria-hidden="true"
		>
			{initial}
		</div>
		<div class="min-w-0 flex flex-col gap-0.5">
			<p class="truncate font-semibold tracking-wide">{friendRequest.sender.username}</p>
			{#if friendRequest.message}
				<p class="line-clamp-2 text-sm text-surface-200">{friendRequest.message}</p>
			{/if}
			<small class="text-[0.7rem] text-tertiary-200">{sentLabel}</small>
		</div>
	</div>
	<div class="flex shrink-0 gap-2 sm:pl-4">
		<button type="button" onclick={handleAccept} class="variant-filled-primary btn h-9 px-4 text-sm">
			{t('friends.accept')}
		</button>
		<button type="button" onclick={handleReject} class="variant-filled-error btn h-9 px-4 text-sm">
			{t('friends.reject')}
		</button>
	</div>
</div>
