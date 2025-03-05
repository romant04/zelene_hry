<script lang="ts">
	import Icon from '@iconify/svelte';
	import { onDestroy } from 'svelte';
	let {
		isOpenModal = $bindable(),
		modal = $bindable()
	}: { isOpenModal: boolean; modal: HTMLElement | undefined } = $props();

	let button: HTMLButtonElement | undefined = $state(undefined);

	function handleClickOutside(event: MouseEvent) {
		if (modal?.contains(event.target as Node) || button?.contains(event.target as Node)) {
			return;
		}

		isOpenModal = false;
	}

	function handleClick() {
		isOpenModal = !isOpenModal;

		if (isOpenModal) {
			document.addEventListener('click', handleClickOutside);
		} else {
			document.removeEventListener('click', handleClickOutside);
		}
	}

	onDestroy(() => {
		document.removeEventListener('click', handleClickOutside);
	});
</script>

<button
	bind:this={button}
	onclick={handleClick}
	class="bg-primary-500 hover:bg-primary-400 w-10 h-10 rounded-full flex justify-center items-center"
>
	<Icon icon="mdi:user" width="30" class="text-white" />
</button>
