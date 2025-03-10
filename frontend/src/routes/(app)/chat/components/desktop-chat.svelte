<script lang="ts">
	import type { User } from '../../../../types/user';
	import ChatOption from './chat-option.svelte';
	import ChatBubble from './chat-bubble.svelte';
	import type { Dm } from '../../../../types/dm';
	import { auth } from '../../../../stores/auth';

	let { friends }: { friends: User[] } = $props();

	let activeChat: User | null = $state(null);

	let filter = $state('');
	let searchTerm = $state('');
	let debounceTimeout: number | null = $state(null);

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

	let messages: Dm[] = $state([]);
	let message = $state('');

	async function sendMessage() {
		if (activeChat === null) {
			return;
		}

		const response = await fetch('http://localhost:8080/api/secured/dms', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('token')}`
			},
			body: JSON.stringify({
				receiverId: activeChat.id,
				message: message
			})
		});
		message = '';
		console.log(response);
	}

	async function fetchMessages(friendId: number) {
		const response = await fetch(`http://localhost:8080/api/secured/dms?userId=${friendId}`, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`
			}
		});
		const data = await response.json();
		console.log(data);
		messages = data;
	}
	$effect(() => {
		if (activeChat !== null && friends.length > 0) {
			fetchMessages(activeChat.id);
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
				<ChatOption {friend} bind:active={activeChat} />
			{/each}
		</div>
	</div>

	{#if activeChat !== null}
		<div class="p-5 h-[calc(100vh-144px)] grid grid-rows-[auto,1fr,auto]">
			<div class="flex items-center gap-2">
				<span
					class="flex font-bold justify-center items-center uppercase bg-primary-400 rounded-full h-10 w-10"
					>{activeChat.username.slice(0, 1) +
						activeChat.username.slice(
							activeChat.username.length - 1,
							activeChat.username.length
						)}</span
				>
				<p class="text-xl">{activeChat.username}</p>
			</div>

			<div class="flex h-[calc(100vh-144px)] justify-between flex-col gap-2">
				<div class="flex flex-col my-4 gap-1 overflow-auto max-h-[85%] px-5">
					{#if $auth.data}
						{#each messages as dm}
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
