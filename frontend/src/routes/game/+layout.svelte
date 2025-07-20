<script lang="ts">
	import Toast from '../(app)/components/toast.svelte';
	import './games.css';
	import { onDestroy } from 'svelte';
	interface Props {
		children?: import('svelte').Snippet;
	}

	$effect(() => {
		if (typeof document !== 'undefined') {
			document.body.classList.add('game');
			document.documentElement.classList.add('game');
		}
	});

	onDestroy(() => {
		if (typeof document !== 'undefined') {
			document.body.classList.remove('game');
			document.documentElement.classList.remove('game');
		}
	});

	let { children }: Props = $props();
</script>

<main class="h-screen w-screen">
	<Toast />
	{@render children?.()}
</main>
