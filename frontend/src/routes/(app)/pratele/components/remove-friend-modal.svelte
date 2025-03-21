<script lang="ts">
	import type { User } from '../../../../types/user';
	import { onMount } from 'svelte';
	import { addToast } from '../../../../stores/toast';
	import Spinner from '../../components/spinner.svelte';
	import {API} from "../../../../constants/urls";

	let {
		friend = $bindable(),
		updateAfterFriendRemoved
	}: { friend: User | null; updateAfterFriendRemoved: (friend: User) => void } = $props();

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
			updateAfterFriendRemoved(friend);
			addToast('Přítel byl úspěšně odstraněn', 'success');
			friend = null;
			return;
		}

		addToast('Nepodařilo se odstranit přítele', 'error');
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
			<button onclick={handleRemoveFriend} class="btn variant-filled-primary">
				{#if loading}
					<Spinner w="w-5" h="h-5" fill="fill-white" />
				{:else}
					Potvrdit
				{/if}
			</button>
			<button onclick={handleClose} class="btn variant-filled-error">Zrušit</button>
		</div>
	</div>
</div>
