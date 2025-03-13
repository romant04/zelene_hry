<script lang="ts">
	import type { User } from '../../../../types/user';
	import { Socket } from 'socket.io-client';
	import { createChatSocket } from '$lib/socket';
	import type { Dm } from '../../../../types/dm';
	import { onDestroy, tick } from 'svelte';
	import { auth } from '../../../../stores/auth';
	import ChatOption from './chat-option.svelte';
	import ChatBubble from './chat-bubble.svelte';
	import { clearSocket } from '../../../../utils/socket';
	import { activeChat } from '../../../../stores/active-chat';

	let { friends }: { friends: User[] } = $props();
	let chatSocket: Socket | null = null;

	let filter = '';
	let searchTerm = '';
	let debounceTimeout: number | null = null;

	let messages: Dm[] = $state([]);
	let message = $state('');

	let chatContainer: HTMLDivElement | null = $state(null);

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

		const response = await fetch('http://localhost:8080/api/secured/dms', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('token')}`
			},
			body: JSON.stringify({
				receiverId: $activeChat.activeChat.id,
				message: message
			})
		});
		message = '';

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

	$effect(() => {
		if ($activeChat.activeChat && friends.length > 0) {
			async function init(id: number) {
				await fetchMessages(id);
				if (chatContainer) {
					await tick();
					chatContainer.scrollTop = chatContainer.scrollHeight;
				}
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
			async function scrollToBottom() {
				await tick();
				if (chatContainer) {
					chatContainer.scrollTop = chatContainer.scrollHeight;
				}
			}
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

<div class="grid grid-cols-[auto,1fr] h-[calc(100vh-72px)]">
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
				<ChatOption {friend} />
			{/each}
		</div>
	</div>

	{#if $activeChat.activeChat !== null}
		{@const username = $activeChat.activeChat.username}
		<div class="p-5 h-[calc(100vh-144px)] grid grid-rows-[auto,1fr,auto]">
			<div class="flex items-center gap-2">
				<span
					class="flex font-bold justify-center items-center uppercase bg-primary-400 rounded-full h-10 w-10"
					>{username.slice(0, 1) +
						username.slice(username.length - 1, username.length)}</span
				>
				<p class="text-xl">{username}</p>
			</div>

			<div class="flex h-[calc(100vh-144px)] justify-between flex-col gap-2">
				<div
					class="flex flex-col my-4 gap-1 overflow-auto max-h-[85%] px-5"
					bind:this={chatContainer}
				>
					{#if $auth.data}
						{#each messages as dm, index}
							<ChatBubble
								message={dm.message}
								mine={dm.sender.id === $auth.data.id}
							/>
						{/each}
					{/if}
				</div>
				<form onsubmit={sendMessage} class="flex gap-1 mt-auto">
					<input type="text" class="input p-2" bind:value={message} />
					<button type="submit" class="btn variant-filled-primary w-36 rounded-md"
						>Poslat</button
					>
				</form>
			</div>
		</div>
	{/if}
</div>
