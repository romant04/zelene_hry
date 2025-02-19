<script lang="ts">
	let { name, message }: { name: string; message: string } = $props();
</script>

<div class="flex items-center justify-between gap-8 rounded-md bg-surface-600 px-6 py-3">
	<div class="flex flex-col gap-px">
		<p class="text-xl font-semibold">{name}</p>
		<p class="line-clamp-5 text-sm">{message}</p>
	</div>
	<div class="flex gap-1">
		<button class="variant-filled-primary btn text-sm">Přijmout</button>
		<button class="variant-filled-error btn text-sm">Zamítnout</button>
	</div>
</div>
