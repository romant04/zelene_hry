<script lang="ts">
	import { fly } from 'svelte/transition';
	import { notifications, updateNotifications } from '../../../../stores/notifications';
	import type { Notification } from '../../../../types/notificationMessage';
	import { socialCache } from '$lib/cache/socials';
	import { chatsCache } from '$lib/cache/chats';
	import { goto } from '$app/navigation';
	import { API } from '../../../../constants/urls';
	import { formatNotificationMessage, pluralKey, t } from '$lib/i18n';

	let {
		isOpenNotifications = $bindable(),
		modal = $bindable()
	}: { isOpenNotifications: boolean; modal: HTMLElement | undefined } = $props();

	function getTimeDifference(date1: Date, date2: Date) {
		const diff = Math.abs(date2.getTime() - date1.getTime());
		const seconds = Math.floor(diff / 1000);
		const minutes = Math.floor(seconds / 60);
		const hours = Math.floor(minutes / 60);
		const days = Math.floor(hours / 24);

		if (days > 0) return t(pluralKey('notifications.daysAgo', days), { count: days });
		if (hours > 0) return t(pluralKey('notifications.hoursAgo', hours), { count: hours });
		if (minutes > 0)
			return t(pluralKey('notifications.minutesAgo', minutes), { count: minutes });
		return t(pluralKey('notifications.secondsAgo', seconds), { count: seconds });
	}

	async function handleNotificationClick(notification: Notification) {
		socialCache.clear();
		chatsCache.clear();

		isOpenNotifications = false;
		if (notification.redirectUrl.includes('/chat')) {
			// If the notification is for chat, we don't need to update the notifications
			// as it will be handled in the chat section.
			await goto(notification.redirectUrl);

			return;
		}
		updateNotifications([
			...$notifications.filter((nt) => nt.notificationId !== notification.notificationId)
		]);

		const res = await fetch(
			`${API}/api/notifications?notificationId=${notification.notificationId}`,
			{
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${localStorage.getItem('token')}`
				}
			}
		);
		console.log(res);

		await goto(notification.redirectUrl);
	}

	async function deleteAllNotifications() {
		updateNotifications([]);
		const res = await fetch(`${API}/api/notifications/ack-all`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('token')}`
			}
		});
		console.log(res);
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
			<button
				onclick={() => handleNotificationClick(notification)}
				class="bg-tertiary-700 flex flex-col justify-between min-h-20 p-2 rounded-md hover:bg-tertiary-800 cursor-pointer"
			>
				<span class="text-sm">{formatNotificationMessage(notification, t)}</span>
				<small class="text-xs text-gray-400"
					>{getTimeDifference(new Date(), new Date(notification.createdAt))}</small
				>
			</button>
		{/each}
		{#if $notifications.length === 0}
			<p class="text-center text-gray-400">{t('notifications.empty')}</p>
		{/if}
	</div>

	<button
		onclick={deleteAllNotifications}
		class="btn variant-filled-warning h-8 mt-3 !text-sm !text-white"
		>{t('notifications.deleteAll')}</button
	>
</div>
