<script lang="ts">
	import Icon from '@iconify/svelte';
	import { onDestroy } from 'svelte';
	import { notifications } from '../../../../stores/notifications';

	let {
		isOpenNotifications = $bindable(),
		modal = $bindable()
	}: { isOpenNotifications: boolean; modal: HTMLElement | undefined } = $props();

	let button: HTMLButtonElement | undefined = $state(undefined);

	function handleClickOutside(event: MouseEvent) {
		if (modal?.contains(event.target as Node) || button?.contains(event.target as Node)) {
			return;
		}

		isOpenNotifications = false;
	}

	function handleClick() {
		isOpenNotifications = !isOpenNotifications;

		if (isOpenNotifications) {
			document.addEventListener('click', handleClickOutside);
		} else {
			document.removeEventListener('click', handleClickOutside);
		}
	}

	onDestroy(() => {
		if (typeof document !== 'undefined') {
			document.removeEventListener('click', handleClickOutside);
		}
	});
</script>

<button
	bind:this={button}
	onclick={handleClick}
	class="cursor-pointer relative hover:bg-gray-100/30 rounded-full sm:p-2"
>
	<Icon icon="nimbus:notification" width="24" />

	{#if $notifications.length > 0}
		<div
			class="absolute text-sm top-0 -right-1 bg-warning-500 w-5 h-5 flex justify-center items-center rounded-full"
		>
			{$notifications.length}
		</div>
	{/if}
</button>
