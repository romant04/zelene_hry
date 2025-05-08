<script lang="ts">
	let {message, mine}: {message: string, mine: boolean} = $props();
</script>

<div class="rounded-[2rem] text-[0.9rem] py-2 px-4 max-w-[min(420px,50%)] whitespace-normal break-all {mine ? 'self-end bg-tertiary-700' : 'self-start bg-primary-600'}">
	{message}
</div>