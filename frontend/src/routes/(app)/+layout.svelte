<script lang="ts">
	import '../../app.postcss';
	import '../../main.css';
	import AppFooter from './components/layout/layout-footer.svelte';
	import Header from './components/layout/header.svelte';
	import {auth, updateUserState} from '../../stores/auth';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import Toast from './components/toast.svelte';
	import { onMount } from "svelte";

	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();

	onMount(() => {
		if (localStorage.getItem('out-of-service')) {
			updateUserState(); // Test if service is back online
		}
	})

	const protectedRoutes = ['/chat', '/pratele'];
	$effect(() => {
		if (
			$auth.data === null &&
			protectedRoutes.some((route) => page.url.pathname.includes(route))
		) {
			goto('/login');
		}
	});
</script>

<Header />

<main class="main h-full pt-[4.5rem]">
	<Toast />
	{@render children?.()}
</main>

<!-- Footer -->
<AppFooter />
