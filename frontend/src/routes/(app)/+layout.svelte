<script lang="ts">
	import '../../app.postcss';
	import '../../main.css';
	import AppFooter from './components/layout/layout-footer.svelte';
	import Header from './components/layout/header.svelte';
	import { auth, updateUserState } from '../../stores/auth';
	import { navigating } from '$app/state';
	import Toast from './components/toast.svelte';
	import { onDestroy, onMount, setContext } from 'svelte';
	import type { Socket } from 'socket.io-client';
	import { createNotificationSocket } from '$lib/socket';
	import type { NotificationMessage } from '../../types/notificationMessage';
	import { clearSocket } from '../../utils/socket';
	import { notifications, updateNotifications } from '../../stores/notifications';

	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
	let notificationSocket: Socket | null = null;

	onMount(() => {
		if (localStorage.getItem('out-of-service')) {
			updateUserState(); // Test if service is back online
		}
	});

	$effect(() => {
		if (!notificationSocket && $auth.data?.id) {
			notificationSocket = createNotificationSocket($auth.data.id);
			setContext('notificationSocket', notificationSocket);

			notificationSocket.emit('fetchNotifications');

			notificationSocket.on('notifications', (notifications: NotificationMessage[]) => {
				updateNotifications(notifications);
			});

			notificationSocket.on('notification', (notification: NotificationMessage) => {
				if ($notifications.some((n) => n.id === notification.id)) {
					return; // Ignore duplicate notifications
				}

				updateNotifications([...$notifications, notification]);
			});
		}
	});

	onDestroy(() => {
		if (notificationSocket) {
			clearSocket(notificationSocket);
			setContext('notificationSocket', null);
		}
	});
</script>

<Header />

<main class="main h-full pt-[4.5rem]">
	{#if navigating.to}
		<div class="fixed top-0 left-0 z-[100] h-1 w-full bg-surface-800">
			<div class="h-full bg-primary-500 animate-progress"></div>
		</div>
	{/if}
	<Toast />
	{@render children?.()}
</main>

<!-- Footer -->
<AppFooter />

<style>
	@keyframes progress {
		0% {
			width: 0%;
		}
		100% {
			width: 95%;
		}
	}
	.animate-progress {
		animation: progress 2s ease-out forwards;
	}
</style>
