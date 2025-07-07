<script lang="ts">
	import { auth } from '../../../../stores/auth';
	import { slide } from 'svelte/transition';
	import type { Message } from '../../../../types/chat';
	import { isChatroomMessage } from '../../../../utils/isChatroomMessage';
	import { API } from '../../../../constants/urls';
	import { chatSocket } from '../../../../stores/chat-socket';
	import { restrictionOverlay } from '../../../../stores/restriction-overlay';

	let { message, messageType }: { message: Message; messageType: 'dm' | 'group' } = $props();

	let button: HTMLButtonElement | undefined = $state(undefined);
	let mine = $derived(message.sender.id === $auth.data?.id);

	function clickOutside(node: HTMLElement, handler: () => void) {
		const onClick = (event: MouseEvent) => {
			if (!button) {
				return;
			}

			if (!node.contains(event.target as Node) && !button.contains(event.target as Node)) {
				handler();
			}
		};

		document.addEventListener('click', onClick, true);

		return {
			destroy() {
				document.removeEventListener('click', onClick, true);
			}
		};
	}

	async function handleMessageDelete() {
		if (!isChatroomMessage(message)) {
			return;
		}

		const res = await fetch(`${API}/api/secured/chats/messages/${message.messageId}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('token')}`
			}
		});
		if (!res.ok) {
			const error = await res.json();
			console.error('Failed to delete message:', error);
			return;
		}

		isOpen = false;

		$chatSocket.chatSocket!.emit('messageDeleted', {
			messageId: message.messageId
		});
	}

	function openRestrictionOverlay() {
		$restrictionOverlay.user = message.sender;
		$restrictionOverlay.isOpen = true;
		isOpen = false;
	}

	let isOpen = $state(false);
</script>

<!-- If the message contains only emojis don't create the bubble -->
{#if RegExp(/^(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)+$/u).test(message.message)}
	<div
		class="text-3xl max-w-[min(420px,50%)] whitespace-normal break-all {mine
			? 'self-end'
			: 'self-start'}"
	>
		{#if !mine && messageType === 'group'}
			<p class="text-sm text-gray-400 mb-1">{message.sender.username}</p>
		{/if}
		{message.message}
	</div>
{:else}
	<div
		class="flex flex-col items-start max-w-[min(420px,70%)] {mine ? 'self-end' : 'self-start'}"
	>
		{#if !mine && messageType === 'group'}
			<p class="text-sm ml-1 text-gray-400">{message.sender.username}</p>
		{/if}
		<div class="flex relative justify-center items-center gap-1">
			<span
				class="rounded-[2rem] text-[0.9rem] py-2 px-4 whitespace-normal break-all {mine
					? 'bg-tertiary-700'
					: 'bg-primary-600'}">{message.message}</span
			>
			{#if messageType === 'group' && !mine && $auth.data?.admin}
				<button
					bind:this={button}
					onclick={() => (isOpen = !isOpen)}
					class="text-sm cursor-pointer whitespace-nowrap hover:bg-gray-700 px-2 py-1 rounded-full"
					>. . .</button
				>
				{#if isOpen}
					<div
						in:slide
						use:clickOutside={() => (isOpen = false)}
						class="absolute z-20 flex flex-col gap-2 w-max whitespace-nowrap top-10 left-3/4 px-2 py-3 bg-tertiary-600 rounded-md text-sm"
					>
						<button
							onclick={handleMessageDelete}
							class="hover:bg-tertiary-700 py-1 px-3 rounded-lg">Smazat zprávu</button
						>
						<button
							onclick={openRestrictionOverlay}
							class="hover:bg-tertiary-700 py-1 px-3 rounded-lg">Zabanovat</button
						>
					</div>
				{/if}
			{/if}
		</div>
	</div>
{/if}
