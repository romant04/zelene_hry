<script lang="ts">
	import type { User } from '../../../../types/user';
	import { createChatSocket } from '$lib/socket';
	import type { Dm } from '../../../../types/dm';
	import { onDestroy, tick } from 'svelte';
	import { auth } from '../../../../stores/auth';
	import ChatOption from './chat-option.svelte';
	import ChatroomOption from './chatroom-option.svelte';
	import { clearSocket } from '../../../../utils/socket';
	import { activeChat } from '../../../../stores/active-chat';
	import ChatSection from './chat-section.svelte';
	import { addToast } from '../../../../stores/toast';
	import { API } from '../../../../constants/urls';
	import Select from '../../components/select.svelte';
	import type { ChatMessage, Chatroom, Message } from '../../../../types/chat';
	import { isChatroom } from '../../../../utils/isChatroom.js';
	import { createChatroomSocket } from '$lib/socket.js';
	import { chatSocket, clearChatSocket, setChatSocket } from '../../../../stores/chat-socket';
	import { isChatroomMessage } from '../../../../utils/isChatroomMessage';
	import type { Restriction } from '../../../../types/restriction';

	let {
		friends,
		chatRooms,
		chatType,
		restrictions
	}: {
		friends: User[];
		chatRooms: Chatroom[];
		chatType: 'dm' | 'group';
		restrictions: Restriction[];
	} = $props();

	let isMemberOfChatroom = $state(false);
	let restriction = $state<Restriction | null>(null);

	$effect(() => {
		if (chatType === 'dm') {
			isMemberOfChatroom = true; // In DMs, the user is always a member of the chat
			restriction = null;
			return;
		}

		if ($activeChat.activeChat && isChatroom($activeChat.activeChat)) {
			isMemberOfChatroom = $activeChat.activeChat.users.some(
				(user) => user.id === $auth.data?.id
			);
			restriction =
				restrictions.find(
					(restriction) =>
						restriction.chatId === $activeChat.activeChat?.id &&
						restriction.userId === $auth.data?.id
				) || null;
		} else {
			isMemberOfChatroom = false;
		}
	});

	let filter = $state('');
	let searchTerm = '';
	let debounceTimeout: number | null = null;

	let messages: Message[] = $state([]);
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

	async function sendMessage(inputElement: HTMLInputElement | undefined) {
		if (!$activeChat.activeChat || !$auth.data || !$chatSocket.chatSocket || !inputElement) {
			return;
		}

		if (message === '') {
			addToast('Zpráva nesmí být prázdná', 'error');
			return;
		}

		const tempMessage = message;
		message = '';

		loadingSending = true;

		if (chatType === 'group' && isChatroom($activeChat.activeChat)) {
			// If it's a group chat, we need to send the message to the chatroom
			const response = await fetch(
				`${API}/api/secured/chats/${$activeChat.activeChat.id}/message`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${localStorage.getItem('token')}`
					},
					body: JSON.stringify({
						message: tempMessage
					})
				}
			);

			inputElement.focus();
			const data = (await response.json()) as Message;
			$chatSocket.chatSocket.emit('sendMessage', {
				message: data,
				room: $activeChat.activeChat
			});
			return;
		}

		const response = await fetch(`${API}/api/secured/dms`, {
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

		inputElement.focus();
		const data = (await response.json()) as Dm;
		$chatSocket.chatSocket.emit('sendMessage', data);
	}

	async function fetchMessages(friendId: number) {
		if (!$auth.data || !$activeChat.activeChat) {
			return;
		}

		if (chatType === 'group' && isChatroom($activeChat.activeChat)) {
			// If it's a group chat, we need to fetch messages from the chatroom
			const response = await fetch(
				`${API}/api/secured/chats/${$activeChat.activeChat.id}/messages`,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`
					}
				}
			);
			const data: ChatMessage[] = await response.json();
			messages = data.sort(
				(a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
			);
			return;
		}

		const response = await fetch(`${API}/api/secured/dms?userId=${friendId}`, {
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
		if (
			$activeChat.activeChat &&
			$chatSocket.chatSocket === null &&
			$auth.data?.id &&
			isMemberOfChatroom &&
			!restriction
		) {
			if (isChatroom($activeChat.activeChat)) {
				// If it's a chatroom, we need to create a socket for the chatroom
				setChatSocket(
					createChatroomSocket(
						$auth.data,
						$activeChat.activeChat.id,
						$activeChat.activeChat.users
					)
				);
			} else {
				// If it's a DM, we create a socket for the DM
				setChatSocket(createChatSocket($auth.data.id, $activeChat.activeChat.id));
			}
		}
	});

	$effect(() => {
		if (!$auth.data?.id || !$activeChat.activeChat?.id || $chatSocket.chatSocket === null) {
			return;
		}

		if (isChatroom($activeChat.activeChat)) {
			$chatSocket.chatSocket.on(
				'receiveMessage',
				(data: { message: ChatMessage; room: Chatroom }) => {
					messages = [...messages, data.message];
					loadingSending = false;
					scrollToBottom();
				}
			);
			$chatSocket.chatSocket.on('messageDeleted', (data: { messageId: number }) => {
				messages = messages.filter(
					(message) => isChatroomMessage(message) && message.messageId !== data.messageId
				);
			});
		} else {
			$chatSocket.chatSocket.on('receiveMessage', (data: Dm) => {
				messages = [...messages, data];
				loadingSending = false;
				scrollToBottom();
			});
		}
	});

	// Cleanup on component destroy
	onDestroy(() => {
		$activeChat.activeChat = null;
		if ($chatSocket.chatSocket) {
			clearSocket($chatSocket.chatSocket);
			clearChatSocket();
		}
	});
</script>

<div class="hidden md:grid grid-cols-[auto,1fr] h-[calc(100vh-72px)]">
	<div class="bg-tertiary-600 py-5 px-4 w-80">
		<h2 class="text-3xl font-semibold">Chaty</h2>

		<Select
			options={[
				{
					option: 'Privátní chaty',
					value: 'dms',
					defaultOption: chatType === 'dm'
				},
				{
					option: 'Chatovací místnosti',
					value: 'rooms',
					defaultOption: chatType === 'group'
				}
			]}
			value={chatType}
			asLinks={true}
			styles="mt-5 mb-10 bg-tertiary-700 p-2 rounded-sm"
		/>

		<input
			name="search"
			placeholder={`Vyhledat ${chatType === 'dm' ? 'kamaráda' : 'místnost'}...`}
			class="input !bg-tertiary-800 py-2 text-sm font-semibold px-2 mt-3"
			type="text"
			oninput={handleSearch}
		/>
		<div class="flex flex-col gap-[2px] mt-5">
			{#if chatType === 'dm'}
				{#each friends.filter((friend) => friend.username.includes(filter)) as friend}
					<ChatOption {friend} bind:loading />
				{/each}
			{:else if chatType === 'group'}
				{#each chatRooms.filter((room) => room.name.includes(filter)) as room}
					<ChatroomOption {room} bind:loading />
				{/each}
			{/if}
		</div>
	</div>

	{#if $activeChat.activeChat !== null}
		{@const name = isChatroom($activeChat.activeChat)
			? $activeChat.activeChat.name
			: $activeChat.activeChat.username}
		<ChatSection
			{loading}
			{loadingSending}
			username={name}
			bind:isMemberOfChatroom
			{restriction}
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
		<Select
			options={[
				{
					option: 'Privátní chaty',
					value: 'dms',
					defaultOption: chatType === 'dm'
				},
				{
					option: 'Chatovací místnosti',
					value: 'rooms',
					defaultOption: chatType === 'group'
				}
			]}
			value={chatType}
			asLinks={true}
			styles="mt-5 mb-10 bg-tertiary-700 p-2 rounded-sm"
		/>
		<input
			placeholder={`Vyhledat ${chatType === 'dm' ? 'kamaráda' : 'místnost'}...`}
			class="input !bg-tertiary-800 py-2 text-sm font-semibold px-2 mt-3"
			type="text"
			oninput={handleSearch}
		/>
		<div class="flex flex-col gap-[2px] mt-5">
			{#if chatType === 'dm'}
				{#each friends.filter((friend) => friend.username.includes(filter)) as friend}
					<ChatOption {friend} bind:loading />
				{/each}
			{:else if chatType === 'group'}
				{#each chatRooms.filter((room) => room.name.includes(filter)) as room}
					<ChatroomOption {room} bind:loading />
				{/each}
			{/if}
		</div>
	</div>

	{#if $activeChat.activeChat !== null}
		{@const name = isChatroom($activeChat.activeChat)
			? $activeChat.activeChat.name
			: $activeChat.activeChat.username}
		<ChatSection
			{loading}
			{loadingSending}
			username={name}
			bind:isMemberOfChatroom
			{restriction}
			{messages}
			bind:message
			bind:chatContainer={mobileChatContainer}
			{sendMessage}
		/>
	{/if}
</div>
