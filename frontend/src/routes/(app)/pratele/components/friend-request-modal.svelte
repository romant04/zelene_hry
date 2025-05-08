<script lang="ts">
	import type { User } from '../../../../types/user';
	import { onMount } from 'svelte';
	import { addToast } from '../../../../stores/toast';
	import Spinner from '../../components/spinner.svelte';
	import { API } from '../../../../constants/urls';

	let { friend = $bindable() }: { friend: User | null } = $props();

	let modal: HTMLDivElement | null = $state(null);
	let message = $state('');
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

	async function handleAddFriend() {
		if (!friend) {
			return;
		}

		loading = true;

		const response = await fetch(`${API}/api/secured/friendRequest`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('token')}`
			},
			body: JSON.stringify({
				receiverId: friend.id,
				message: message
			})
		});

		loading = false;

		if (response.ok) {
			friend = null;
			addToast('Žádost o přátelství byla úspěšně odeslána', 'success');
			return;
		}

		addToast('Nepodařilo se odeslat žádost o přátelství', 'error');
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
		<h1 class="text-xl mb-5 font-semibold uppercase">Nová žádost o přátelství</h1>
		<p class="text-sm">Zpráva pro '{friend?.username}'</p>
		<textarea
			bind:value={message}
			class="input mt-1 !bg-tertiary-800 px-2 py-1 resize-none"
			rows="4"
			name="message"
			maxlength="300"
		></textarea>
		<button
			title="Odeslat žádost"
			onclick={handleAddFriend}
			class="btn variant-filled-primary mt-5 w-full"
		>
			{#if loading}
				<Spinner w="w-5" h="h-5" fill="fill-white" />
			{:else}
				Přidat do přátel
			{/if}
		</button>
	</div>
</div>
