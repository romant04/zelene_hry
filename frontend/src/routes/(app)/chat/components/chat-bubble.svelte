<script lang="ts">
	let { message, mine }: { message: string; mine: boolean } = $props();
</script>

<!-- If the message contains only emojis don't create the bubble -->
{#if RegExp(/^(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)+$/u).test(message)}
	<p
		class="text-2xl max-w-[min(420px,50%)] whitespace-normalbreak-all {mine
			? 'self-end'
			: 'self-start'}"
	>
		{message}
	</p>
{:else}
	<div
		class="rounded-[2rem] text-[0.9rem] py-2 px-4 max-w-[min(420px,50%)] whitespace-normalbreak-all {mine
			? 'self-end bg-tertiary-700'
			: 'self-start bg-primary-600'}"
	>
		{message}
	</div>
{/if}
