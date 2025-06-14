<script lang="ts">
	let {
		message,
		mine,
		sender,
		messageType
	}: { message: string; mine: boolean; sender: string; messageType: 'dm' | 'group' } = $props();
</script>

<!-- If the message contains only emojis don't create the bubble -->
{#if RegExp(/^(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)+$/u).test(message)}
	<div
		class="text-3xl max-w-[min(420px,50%)] whitespace-normal break-all {mine
			? 'self-end'
			: 'self-start'}"
	>
		{#if !mine && messageType === 'group'}
			<p class="text-sm text-gray-400 mb-1">{sender}</p>
		{/if}
		{message}
	</div>
{:else}
	<div
		class="flex flex-col items-start max-w-[min(420px,50%)] {mine ? 'self-end' : 'self-start'}"
	>
		{#if !mine && messageType === 'group'}
			<p class="text-sm ml-1 text-gray-400">{sender}</p>
		{/if}
		<span
			class="rounded-[2rem] text-[0.9rem] py-2 px-4 whitespace-normal break-all {mine
				? 'bg-tertiary-700'
				: 'bg-primary-600'}">{message}</span
		>
	</div>
{/if}
