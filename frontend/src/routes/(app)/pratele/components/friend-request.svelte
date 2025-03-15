<script lang="ts">
	import type { FriendRequest } from '../../../../types/friendRequest';
	import type { Friendship } from '../../../../types/friendship';
	import { addToast } from '../../../../stores/toast';

	let {
		friendRequest,
		updateAfterFriendRequest
	}: {
		friendRequest: FriendRequest;
		updateAfterFriendRequest: (
			gotAccepted: boolean,
			friendRequest: FriendRequest,
			newFriend?: Friendship
		) => void;
	} = $props();

	async function handleAccept() {
		const response = await fetch(`http://localhost:8080/api/secured/friendRequest/accept`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('token')}`
			},
			body: JSON.stringify(friendRequest.sender.id)
		});

		const data = await response.json();
		if (response.ok) {
			addToast('Úspěšne jste přijali jste žádost o přátelství', 'success');
			updateAfterFriendRequest(true, friendRequest, data);
			return;
		}

		addToast('Nepodařilo se přijmout žádost o přátelství', 'error');
	}

	async function handleReject() {
		const response = await fetch(`http://localhost:8080/api/secured/friendRequest`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('token')}`
			},
			body: JSON.stringify(friendRequest.sender.id)
		});

		if (response.ok) {
			addToast('Žádost o přátelství byla zamítnuta', 'success');
			updateAfterFriendRequest(false, friendRequest);
			return;
		}
	}
</script>

<div
	class="flex flex-col sm:flex-row sm:items-end justify-between gap-8 rounded-md bg-surface-600 px-6 py-3"
>
	<div class="flex flex-col gap-px">
		<p class="text-xl font-semibold">{friendRequest.sender.username}</p>
		<p class="line-clamp-5 text-sm">{friendRequest.message}</p>
		<small class="mt-2 text-[0.65rem] text-tertiary-100"
			>{new Date(friendRequest.sentAt).toLocaleDateString()}</small
		>
	</div>
	<div class="flex gap-1">
		<button onclick={handleAccept} class="variant-filled-primary btn text-sm">Přijmout</button>
		<button onclick={handleReject} class="variant-filled-error btn text-sm">Zamítnout</button>
	</div>
</div>
