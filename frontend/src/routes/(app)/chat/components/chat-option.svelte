<script lang="ts">
	let { name, active = $bindable() }: { name: string; active: string | null } = $props();

	function handleChatSelect() {
		active = name;
	}
</script>

<button
	onclick={handleChatSelect}
	class="{active === name
		? 'bg-tertiary-700'
		: 'bg-tertiary-800'} text-left px-4 py-3 hover:bg-tertiary-700 rounded-sm"
>
	<span class="text-lg font-semibold">{name}</span>
</button>
