<script lang="ts">
	import { clearActiveChat } from '../../../../stores/active-chat.js';
	import { auth } from '../../../../stores/auth.js';
	import Icon from '@iconify/svelte';
	import ChatBubble from './chat-bubble.svelte';
	import type { Dm } from '../../../../types/dm';
	import Spinner from '../../components/spinner.svelte';
	import { createPopup } from '@picmo/popup-picker';
	import '../custom-picker.css';

	let {
		loading,
		loadingSending,
		username,
		chatContainer = $bindable(),
		messages,
		sendMessage,
		message = $bindable()
	}: {
		loading: boolean;
		loadingSending: boolean;
		username: string;
		chatContainer: HTMLDivElement | null;
		messages: Dm[];
		sendMessage: (inputElement: HTMLInputElement | undefined) => void;
		message: string;
	} = $props();

	let triggerButton: HTMLButtonElement | undefined = $state(undefined);
	let picker = $state<ReturnType<typeof createPopup> | undefined>(undefined);

	$effect(() => {
		if (triggerButton && !picker) {
			console.log('Creating emoji picker');
			picker = createPopup(
				{},
				{
					triggerElement: triggerButton,
					referenceElement: triggerButton,
					position: 'top-start',
					className: 'picmo__dark'
				}
			);

			picker.addEventListener(
				'emoji:select',
				(event: { emoji: string; hexcode: string; label: string }) => {
					message += event.emoji;
				}
			);

			picker.addEventListener('picker:open', () => {
				console.log('Emoji picker opened');
			});
		}
	});

	let inputElement: HTMLInputElement | undefined = $state(undefined);
</script>

<div class="p-3 md:p-5 h-[calc(100vh-144px)] grid grid-rows-[auto,1fr,auto]">
	<div class="flex gap-2 items-center">
		<Icon
			onclick={() => clearActiveChat()}
			icon="mdi:arrow-back"
			width="28"
			class="cursor-pointer"
		/>
		<div class="flex items-center gap-2">
			<span
				class="flex font-bold justify-center items-center uppercase bg-primary-400 rounded-full h-10 w-10"
				>{username.slice(0, 1) + username.slice(username.length - 1, username.length)}</span
			>
			<p class="text-xl">{username}</p>
		</div>
	</div>

	<div class="flex h-[calc(100vh-144px)] justify-between flex-col gap-2">
		<div
			class="flex flex-col my-4 gap-1 overflow-auto max-h-[85%] px-5"
			bind:this={chatContainer}
		>
			{#if loading}
				<p>loading...</p>
			{:else if $auth.data && messages.length > 0}
				{#each messages as dm}
					<ChatBubble message={dm.message} mine={dm.sender.id === $auth.data.id} />
				{/each}
			{:else}
				<p>S tímto uživatelem jste si zatím neposlali žádnou zprávu</p>
			{/if}
		</div>
		<form onsubmit={() => sendMessage(inputElement)} class="flex gap-1 mt-auto">
			<button
				type="button"
				class="pr-2"
				bind:this={triggerButton}
				onclick={() => picker?.open()}
			>
				<Icon icon="bxs:smile" width="24" />
			</button>
			<input
				bind:this={inputElement}
				type="text"
				class="input p-2"
				maxlength="300"
				bind:value={message}
			/>
			<button type="submit" class="btn variant-filled-primary w-36 rounded-md">
				{#if loadingSending}
					<Spinner w="w-5" h="h-5" fill="fill-white" />
				{:else}
					Poslat
				{/if}
			</button>
		</form>
	</div>
</div>
