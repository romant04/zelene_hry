<script lang="ts">
	import { fly } from 'svelte/transition';
	import { notifications, updateNotifications } from '../../../../stores/notifications';
	import { getContext } from 'svelte';
	import type { Socket } from 'socket.io-client';
	import type { NotificationMessage } from '../../../../types/notificationMessage';

	let {
		isOpenNotifications = $bindable(),
		modal = $bindable()
	}: { isOpenNotifications: boolean; modal: HTMLElement | undefined } = $props();

	const notificationSocket: Socket = getContext('notificationSocket');

	function getTimeDifference(date1: Date, date2: Date) {
		const diff = Math.abs(date2.getTime() - date1.getTime());
		const seconds = Math.floor(diff / 1000);
		const minutes = Math.floor(seconds / 60);
		const hours = Math.floor(minutes / 60);
		const days = Math.floor(hours / 24);

		if (days > 0) return `Před ${days} dn${days === 1 ? 'em' : 'y'}`;
		if (hours > 0) return `Před ${hours} hodin${hours === 1 ? 'ou' : 'ami'}`;
		if (minutes > 0) return `Před ${minutes} minut${minutes === 1 ? 'ou' : 'ami'}`;
		return `Před ${seconds} sekund${seconds === 1 ? 'ou' : 'ami'}`;
	}

	function handleNotificationClick(notification: NotificationMessage) {
		isOpenNotifications = false;
		if (notification.redirectUrl === '/chat') {
			// If the notification is for chat, we don't need to update the notifications
			// as it will be handled in the chat section.
			return;
		}
		updateNotifications([...$notifications.filter((nt) => nt.id !== notification.id)]);

		if (notificationSocket) {
			notificationSocket.emit('ack', notification.id);
		}
	}

	function deleteAllNotifications() {
		updateNotifications([]);
		if (notificationSocket) {
			notificationSocket.emit('ackAll');
		}
	}
</script>

<div
	in:fly={{ y: -320, duration: 300, opacity: 1 }}
	out:fly={{ y: -320, duration: 300, opacity: 1 }}
	bind:this={modal}
	class="fixed top-16 flex flex-col justify-between right-3 bg-tertiary-600 z-30 px-3 pt-5 pb-3 w-72 h-80 rounded-md"
>
	<div class="flex flex-col gap-2 overflow-y-auto max-h-full">
		{#each $notifications as notification}
			<a
				href={notification.redirectUrl}
				onclick={() => handleNotificationClick(notification)}
				class="bg-tertiary-700 flex flex-col justify-between min-h-20 p-2 rounded-md hover:bg-tertiary-800 cursor-pointer"
			>
				<p class="text-sm">{notification.message}</p>
				<small class="text-xs text-gray-400"
					>{getTimeDifference(new Date(), new Date(notification.timestamp))}</small
				>
			</a>
		{/each}
		{#if $notifications.length === 0}
			<p class="text-center text-gray-400">Žádná oznámení</p>
		{/if}
	</div>

	<button
		onclick={deleteAllNotifications}
		class="btn variant-filled-warning h-8 mt-3 !text-sm !text-white"
		>Smazat všechny oznámení</button
	>
</div>
