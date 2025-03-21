<script lang="ts">
	import '../../app.postcss';
	import '../../main.css';
	import Toast from "../(app)/components/toast.svelte"

	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<main class="main h-full pt-[4.5rem]">
	<Toast />
	{@render children?.()}
</main>
