<script lang="ts">
	import type { User } from '../../../../types/user';
	import { onMount } from 'svelte';

	let {
		friend = $bindable(),
		updateAfterFriendRemoved
	}: { friend: User | null; updateAfterFriendRemoved: (friend: User) => void } = $props();

	let modal: HTMLDivElement | null = $state(null);

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

		// TODO: Až se budeš nudit tak to sjednoť friendShip -> friendship
		const response = await fetch(`http://localhost:8080/api/secured/friendShip`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('token')}`
			},
			body: JSON.stringify(friend.id)
		});
		if (response.ok) {
			updateAfterFriendRemoved(friend);
			friend = null;
			return;
		}

		console.log('Failed to remove friend');
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
		<h1 class="text-xl mb-5 font-semibold uppercase">Odstranit přítele '{friend?.username}'</h1>
		<p>Opravdu si přejete smazat {friend?.username} z vašeho seznamu přátel ?</p>
		<div class="mt-5 w-full flex gap-1">
			<button onclick={handleRemoveFriend} class="btn variant-filled-primary">Potvrdit</button
			>
			<button onclick={handleClose} class="btn variant-filled-error">Zrušit</button>
		</div>
	</div>
</div>
