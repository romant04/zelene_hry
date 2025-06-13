<script lang="ts">
	import { setActiveChat } from '../../../../stores/active-chat';
	import { activeChat } from '../../../../stores/active-chat';
	import { getContext } from 'svelte';
	import type { Socket } from 'socket.io-client';
	import type { Chatroom } from '../../../../types/chat';
	import Icon from '@iconify/svelte';

	let { room, loading = $bindable() }: { room: Chatroom; loading: boolean } = $props();
	const notificationSocket: Socket = getContext('notificationSocket');

	function handleChatSelect() {
		setActiveChat(room);
		if (!notificationSocket) {
			return;
		}

		loading = true;
	}
</script>

<button
	onclick={handleChatSelect}
	class="{$activeChat.activeChat?.id === room.id
		? 'bg-tertiary-700'
		: 'bg-tertiary-800'} text-left flex items-center px-4 py-3 hover:bg-tertiary-700 rounded-sm"
>
	<span class="text-lg font-semibold">{room.name}</span>

	<span class="flex ml-auto items-center text-primary-400 gap-1">
		<span class="text-white text-sm">
			{room.users.length}
		</span>
		<Icon icon="mdi:account" width="24" />
	</span>
</button>
