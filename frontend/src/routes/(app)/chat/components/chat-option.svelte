<script lang="ts">
	import type { User } from '../../../../types/user';
	import { setActiveChat } from '../../../../stores/active-chat';
	import { activeChat } from '../../../../stores/active-chat';

	let { friend }: { friend: User } = $props();

	function handleChatSelect() {
		setActiveChat(friend);
	}
</script>

<button
	onclick={handleChatSelect}
	class="{$activeChat.activeChat?.id === friend.id
		? 'bg-tertiary-700'
		: 'bg-tertiary-800'} text-left px-4 py-3 hover:bg-tertiary-700 rounded-sm"
>
	<span class="text-lg font-semibold">{friend.username}</span>
</button>
