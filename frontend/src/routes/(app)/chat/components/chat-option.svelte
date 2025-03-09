<script lang="ts">
	import type { User } from '../../../../types/user';

	let { friend, active = $bindable() }: { friend: User; active: User | null } = $props();

	function handleChatSelect() {
		active = friend;
	}
</script>

<button
	onclick={handleChatSelect}
	class="{active?.id === friend.id
		? 'bg-tertiary-700'
		: 'bg-tertiary-800'} text-left px-4 py-3 hover:bg-tertiary-700 rounded-sm"
>
	<span class="text-lg font-semibold">{friend.username}</span>
</button>
