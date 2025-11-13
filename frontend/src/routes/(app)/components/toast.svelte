<script lang="ts">
	import { removeToast, toast } from '../../../stores/toast';
	import Icon from '@iconify/svelte';
	import { fly } from 'svelte/transition';

	const toastIcon = {
		success: 'mdi:success-circle',
		error: 'mdi:error',
		info: 'mdi:information',
		warning: 'mdi:warning'
	};
	const iconColor = {
		success: 'text-success-600',
		error: 'text-error-400',
		info: 'text-blue-400',
		warning: 'text-orange-400'
	};
	const durationColor = {
		success: 'bg-success-600',
		error: 'bg-error-400',
		info: 'bg-blue-400',
		warning: 'bg-orange-400'
	};
</script>

<div>
	{#each $toast as { id, type, message, duration }}
		<div
			transition:fly={{ y: -50, opacity: 0, duration: 400 }}
			class="fixed max-w-28 flex items-center gap-2 z-[999] top-6 right-6 min-w-64 p-4 pr-8 rounded-md bg-tertiary-700 text-white"
		>
			<Icon icon={toastIcon[type]} width="24" class="{iconColor[type]} min-w-[24px]" />
			<span id={`${type}-${id}`} class={message.length > 50 ? 'text-sm' : 'text-base'}
				>{message}</span
			>
			<button class="absolute top-2 text-error-400 right-2" onclick={() => removeToast(id)}>
				<Icon icon="system-uicons:cross" width="24" />
			</button>

			<div
				class="progress-bar absolute bottom-0 left-0 h-1 {durationColor[type]}"
				style="animation-duration: {duration}ms"
			></div>
		</div>
	{/each}
</div>

<style>
	.progress-bar {
		animation: progress-bar linear forwards;
	}

	@keyframes progress-bar {
		from {
			width: 100%;
		}
		to {
			width: 0;
		}
	}
</style>
