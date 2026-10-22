<!-- ProtectedRoute.svelte -->
<script lang="ts">
	import { localizeHref } from '$lib/i18n';
	import { auth } from '../../../stores/auth';
	import { goto } from '$app/navigation';

	if (!$auth.token || $auth.data == null) {
		goto(localizeHref('/login'));
	}
</script>

<slot />
