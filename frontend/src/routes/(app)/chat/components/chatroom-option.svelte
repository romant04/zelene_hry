<script lang="ts">
	import { setActiveChat } from '../../../../stores/active-chat';
	import { activeChat } from '../../../../stores/active-chat';
	import type { Chatroom } from '../../../../types/chat';
	import { notifications, updateNotifications } from '../../../../stores/notifications';
	import type { Notification } from '../../../../types/notificationMessage';
	import { API } from '../../../../constants/urls';

	let { room, loading = $bindable() }: { room: Chatroom; loading: boolean } = $props();

	async function acknowledgeNotifications(notifications: Notification[]) {
		await Promise.all(
			notifications.map((notification) =>
				fetch(`${API}/api/notifications?notificationId=${notification.notificationId}`, {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${localStorage.getItem('token')}`
					}
				})
			)
		);
	}
	function handleChatSelect() {
		setActiveChat(room);

		acknowledgeNotifications(
			$notifications.filter(
				(notification) =>
					notification.message.includes(room.name) &&
					notification.redirectUrl === '/chat/rooms'
			)
		);
		updateNotifications(
			$notifications.filter(
				(notification) =>
					!notification.message.includes(room.name) ||
					notification.redirectUrl !== '/chat/rooms'
			)
		);

		loading = true;
	}

	let unreadMessages = $derived(
		$notifications.filter(
			(notification) =>
				notification.message.includes(room.name) &&
				notification.redirectUrl === '/chat/rooms'
		).length
	);
</script>

<button
	onclick={handleChatSelect}
	class="{$activeChat.activeChat?.id === room.id
		? 'bg-tertiary-700'
		: 'bg-tertiary-800'} text-left flex items-center px-4 py-3 hover:bg-tertiary-700 rounded-sm"
>
	<span class="text-lg font-semibold">{room.name}</span>

	{#if unreadMessages > 0}
		<span
			class="ml-auto bg-primary-500 flex justify-center items-center p-2 w-5 h-5 rounded-full text-sm"
			>{unreadMessages}</span
		>
	{/if}
</button>
