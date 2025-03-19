<script lang="ts">
	import type { User } from '../../../../types/user';
	import { Socket } from 'socket.io-client';
	import { createChatSocket } from '$lib/socket';
	import type { Dm } from '../../../../types/dm';
	import { onDestroy, tick } from 'svelte';
	import { auth } from '../../../../stores/auth';
	import ChatOption from './chat-option.svelte';
	import { clearSocket } from '../../../../utils/socket';
	import { activeChat } from '../../../../stores/active-chat';
	import ChatSection from './chat-section.svelte';
	import { addToast } from '../../../../stores/toast';

	let { friends }: { friends: User[] } = $props();
	let chatSocket: Socket | null = null;

	let filter = $state('');
	let searchTerm = '';
	let debounceTimeout: number | null = null;

	let messages: Dm[] = $state([]);
	let message = $state('');
	let loading = $state(true);

	let loadingSending = $state(false);

	let chatContainer: HTMLDivElement | null = $state(null);
	let mobileChatContainer: HTMLDivElement | null = $state(null);

	function handleSearch(event: Event & { currentTarget: EventTarget & HTMLInputElement }) {
		if (!event.target) {
			return;
		}

		searchTerm = (event.target as HTMLInputElement).value;
		if (debounceTimeout) {
			clearTimeout(debounceTimeout);
		}
		debounceTimeout = window.setTimeout(() => {
			filter = searchTerm;
			debounceTimeout = null;
		}, 500);
	}

	async function sendMessage() {
		if (!$activeChat.activeChat || !$auth.data || !chatSocket) {
			return;
		}

		if (message === '') {
			addToast('Zpráva nesmí být prázdná', 'error');
			return;
		}

		const tempMessage = message;
		message = '';

		loadingSending = true;

		const response = await fetch('http://localhost:8080/api/secured/dms', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('token')}`
			},
			body: JSON.stringify({
				receiverId: $activeChat.activeChat.id,
				message: tempMessage
			})
		});

		const data = (await response.json()) as Dm;
		chatSocket.emit('sendMessage', data);
	}

	async function fetchMessages(friendId: number) {
		const response = await fetch(`http://localhost:8080/api/secured/dms?userId=${friendId}`, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`
			}
		});
		messages = await response.json();
	}

	async function scrollToBottom() {
		if (chatContainer && mobileChatContainer) {
			await tick();
			chatContainer.scrollTop = chatContainer.scrollHeight;
			mobileChatContainer.scrollTop = mobileChatContainer.scrollHeight;
		}
	}

	$effect(() => {
		if ($activeChat.activeChat !== null && loading === false) {
			scrollToBottom();
		}
	});

	$effect(() => {
		if ($activeChat.activeChat && friends.length > 0) {
			async function init(id: number) {
				await fetchMessages(id);
				loading = false;
			}
			init($activeChat.activeChat.id);
		}
	});

	$effect(() => {
		if ($activeChat.activeChat && chatSocket !== null) {
			clearSocket(chatSocket);
			chatSocket = null;
		}

		if ($activeChat.activeChat && chatSocket === null && $auth.data?.id) {
			chatSocket = createChatSocket($auth.data.id, $activeChat.activeChat.id);
		}
	});

	$effect(() => {
		if (!$auth.data?.id || !$activeChat.activeChat?.id || chatSocket === null) {
			return;
		}

		chatSocket.on('receiveMessage', (data: Dm) => {
			messages = [...messages, data];
			loadingSending = false;
			scrollToBottom();
		});
	});

	// Cleanup on component destroy
	onDestroy(() => {
		if (chatSocket) {
			clearSocket(chatSocket);
			chatSocket = null;
		}
	});
</script>

<div class="hidden md:grid grid-cols-[auto,1fr] h-[calc(100vh-72px)]">
	<div class="bg-tertiary-600 py-5 px-4 w-80">
		<h2 class="text-3xl font-semibold">Chaty</h2>
		<input
			placeholder="Vyhledat kamaráda..."
			class="input !bg-tertiary-800 py-2 text-sm font-semibold px-2 mt-3"
			type="text"
			oninput={handleSearch}
		/>
		<div class="flex flex-col gap-[2px] mt-5">
			{#each friends.filter((friend) => friend.username.includes(filter)) as friend}
				<ChatOption {friend} bind:loading />
			{/each}
		</div>
	</div>

	{#if $activeChat.activeChat !== null}
		{@const username = $activeChat.activeChat.username}
		<ChatSection
			{loading}
			{loadingSending}
			{username}
			{messages}
			bind:message
			bind:chatContainer
			{sendMessage}
		/>
	{/if}
</div>

<div class="md:hidden relative h-[calc(100vh-72px)]">
	<div
		class=" bg-tertiary-600 absolute left-0 top-0 z-20 {$activeChat.activeChat === null
			? 'w-full px-4'
			: 'w-0 px-0'} py-5 overflow-hidden transition-all duration-300 ease-out h-full"
	>
		<h2 class="text-3xl font-semibold">Chaty</h2>
		<input
			placeholder="Vyhledat kamaráda..."
			class="input !bg-tertiary-800 py-2 text-sm font-semibold px-2 mt-3"
			type="text"
			oninput={handleSearch}
		/>
		<div class="flex flex-col gap-[2px] mt-5">
			{#each friends.filter((friend) => friend.username.includes(filter)) as friend}
				<ChatOption {friend} bind:loading />
			{/each}
		</div>
	</div>

	{#if $activeChat.activeChat !== null}
		{@const username = $activeChat.activeChat.username}
		<ChatSection
			{loading}
			{loadingSending}
			{username}
			{messages}
			bind:message
			bind:chatContainer={mobileChatContainer}
			{sendMessage}
		/>
	{/if}
</div>
