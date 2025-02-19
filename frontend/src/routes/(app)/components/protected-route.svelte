<!-- ProtectedRoute.svelte -->
<script lang="ts">
	import { auth } from '../../../stores/auth';
	import { goto } from '$app/navigation';

	if (!$auth.token || $auth.data == null) {
		goto('/login');
	}
</script>

<slot />
