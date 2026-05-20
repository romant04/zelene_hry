<script lang="ts">
	import type { User } from '../../../../types/user';
	import { setActiveChat } from '../../../../stores/active-chat';
	import { activeChat } from '../../../../stores/active-chat';
	import { notifications, updateNotifications } from '../../../../stores/notifications';
	import { API } from '../../../../constants/urls';
	import type { Notification } from '../../../../types/notificationMessage';

	let { friend, loading = $bindable() }: { friend: User; loading: boolean } = $props();

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
		setActiveChat(friend);

		acknowledgeNotifications(
			$notifications.filter(
				(notification) =>
					notification.message.includes(friend.username) &&
					notification.redirectUrl === '/chat/dms'
			)
		);
		updateNotifications(
			$notifications.filter(
				(notification) =>
					!notification.message.includes(friend.username) ||
					notification.redirectUrl !== '/chat/dms'
			)
		);
		loading = true;
	}

	let unreadMessages = $derived(
		$notifications.filter(
			(notification) =>
				notification.message.includes(friend.username) &&
				notification.redirectUrl === '/chat/dms'
		).length
	);
</script>

<button
	onclick={handleChatSelect}
	class="{$activeChat.activeChat?.id === friend.id
		? 'bg-tertiary-700'
		: 'bg-tertiary-800'} text-left flex items-center px-4 py-3 hover:bg-tertiary-700 rounded-sm"
>
	<span class="text-lg font-semibold">{friend.username}</span>

	{#if unreadMessages > 0}
		<span
			class="ml-auto bg-primary-500 flex justify-center items-center p-2 w-5 h-5 rounded-full text-sm"
			>{unreadMessages}</span
		>
	{/if}
</button>
