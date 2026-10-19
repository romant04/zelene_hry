<script lang="ts">
	import type { PublicUser } from '../../../../types/user';
	import { onMount } from 'svelte';
	import { addToast } from '../../../../stores/toast';
	import Spinner from '../../components/spinner.svelte';
	import { API } from '../../../../constants/urls';
	import type { Socket } from 'socket.io-client';
	import { auth } from '../../../../stores/auth';
	import { socialCache } from '$lib/cache/socials';
	import { t, tt } from '$lib/i18n';

	let {
		friend = $bindable(),
		friendSocket = $bindable(),
		updateAfterFriendRemoved
	}: {
		friend: PublicUser | null;
		friendSocket: Socket | null;
		updateAfterFriendRemoved: (friend: PublicUser) => void;
	} = $props();

	let modal: HTMLDivElement | null = $state(null);
	let loading = $state(false);

	onMount(() => {
		if (!modal) {
			return;
		}

		modal.focus();
	});

	function handleClose(event: KeyboardEvent | MouseEvent) {
		if (event instanceof KeyboardEvent && event.key === 'Escape') {
			friend = null;
		}

		if (event instanceof MouseEvent && event.target === event.currentTarget) {
			friend = null;
		}
	}

	async function handleRemoveFriend() {
		if (!friend) {
			return;
		}

		loading = true;

		// TODO: Až se budeš nudit tak to sjednoť friendShip -> friendship
		const response = await fetch(`${API}/api/secured/friendShip`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('token')}`
			},
			body: JSON.stringify(friend.id)
		});

		loading = false;

		if (response.ok) {
			socialCache.clear();
			updateAfterFriendRemoved(friend);
			addToast(tt('friends.friendRemovedSuccess'), 'success');
			friendSocket?.emit('friendRemoved', { user: $auth.data, friend: friend.id }); // We use $auth.data?.id, because the other user needs to know who ended friendship with him
			friend = null;
			return;
		}

		addToast(tt('friends.friendRemovedError'), 'error');
	}
</script>

<div
	bind:this={modal}
	role="button"
	aria-label="Close modal"
	tabindex="0"
	onkeydown={handleClose}
	class="fixed z-50 inset-0 cursor-default flex justify-center items-center bg-black/60"
	onclick={handleClose}
>
	<div class="bg-tertiary-600 rounded-md p-5 w-[max(280px,50%)]">
		<h1 class="text-xl mb-5 font-semibold uppercase">
			{t('friends.removeFriendTitle', { username: friend?.username ?? '' })}
		</h1>
		<p>{t('friends.removeFriendConfirm', { username: friend?.username ?? '' })}</p>
		<div class="mt-5 w-full flex gap-1">
			<button onclick={handleRemoveFriend} class="btn variant-filled-primary">
				{#if loading}
					<Spinner w="w-5" h="h-5" fill="fill-white" />
				{:else}
					{t('friends.confirm')}
				{/if}
			</button>
			<button onclick={handleClose} class="btn variant-filled-error">{t('friends.cancel')}</button>
		</div>
	</div>
</div>
