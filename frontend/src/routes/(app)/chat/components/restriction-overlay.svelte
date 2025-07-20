<script lang="ts">
	import { restrictionOverlay } from '../../../../stores/restriction-overlay';
	import { blur } from 'svelte/transition';
	import { addToast } from '../../../../stores/toast';
	import { activeChat } from '../../../../stores/active-chat';
	import { API } from '../../../../constants/urls';
	import { clickOutside } from '../../../../utils/clickOutside';

	let reason = $state('');
	let duration = $state('');

	async function handleAddRestriction() {
		if (!$restrictionOverlay.user) {
			return;
		}

		const res = await fetch(
			`${API}/api/secured/chats/${$activeChat.activeChat?.id}/restrictUser`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${localStorage.getItem('token')}`
				},
				body: JSON.stringify({
					userId: $restrictionOverlay.user.id,
					reason,
					endDate: duration
				})
			}
		);

		if (!res.ok) {
			const error = await res.json();
			console.error('Failed to create restriction:', error);
			return;
		}

		addToast('Restrikce byla úspěšně vytvořena.', 'success');

		$restrictionOverlay.isOpen = false;
		reason = '';
		duration = '';
	}
</script>

{#if $restrictionOverlay.isOpen}
	<div in:blur={{ duration: 300 }} class="fixed z-50 top-0 left-0 bottom-0 right-0 bg-black/50">
		<div class="flex justify-center items-center h-full w-full p-6">
			<div
				class="bg-tertiary-600 p-5 rounded-md flex flex-col"
				use:clickOutside={() => ($restrictionOverlay.isOpen = false)}
			>
				<h4 class="text-3xl font-semibold mb-1">Nová restrikce</h4>
				<p>
					Zadejte potřebné informoce pro vytvoření restrikce uživatele <span
						class="text-lg font-semibold">{$restrictionOverlay.user?.username}</span
					>
				</p>

				<form onsubmit={handleAddRestriction} class="mt-5 flex flex-col gap-3">
					<div>
						<label class="mb-1 font-semibold" for="reason">Důvod restrikce</label>
						<input
							bind:value={reason}
							id="reason"
							type="text"
							class="input p-2"
							placeholder="Zadejte důvod restrikce"
							maxlength="100"
							required
						/>
					</div>

					<div>
						<label class="mb-1 font-semibold" for="duration"
							>Konec restrikce (prázdné = trvalá restikce)</label
						>
						<input
							bind:value={duration}
							type="datetime-local"
							style="color-scheme: dark"
							class="input p-2"
						/>
					</div>

					<button type="submit" class="btn variant-filled-primary mt-3">
						Vytvořit restrikci
					</button>
				</form>
			</div>
		</div>
	</div>
{/if}
