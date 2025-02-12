<script lang="ts">
	import '../../app.postcss';
	import { AppBar } from '@skeletonlabs/skeleton';

	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();

	const LINKS = [
		{
			href: '#',
			target: '_self',
			text: 'Hry'
		},
		{
			href: '#',
			target: '_self',
			text: 'Chat'
		},
		{
			href: '#',
			target: '_self',
			text: 'Přátelé'
		},
		{
			href: '#',
			target: '_self',
			text: 'Žebříček'
		}
	];
</script>

<!-- App Bar -->
<AppBar
	class="header"
	gridColumns="grid-cols-3"
	slotDefault="place-self-center"
	slotTrail="place-content-end"
>
	{#snippet lead()}
	<strong class="text-xl uppercase">Duelovky</strong>
	{/snippet}
	<ul class="flex gap-20">
		{#each LINKS as { href, target, text }}
		<li>
			<a
				class="relative text-lg after:absolute after:-bottom-[2px] after:left-0 after:h-[2px] after:w-0 after:rounded-sm after:bg-success-500 after:transition-all after:duration-[200ms] after:ease-out hover:after:w-[105%]"
				{href}
				{target}
				>{text}</a
			>
		</li>
		{/each}
	</ul>
	{#snippet trail()}
	<button
		class="variant-filled-primary btn h-10 w-36 text-sm font-semibold uppercase tracking-wide"
	>
		Přihlásit se
	</button>
	{/snippet}
</AppBar>

<main class="main h-full">{@render children?.()}</main>

<!-- Footer -->
<footer class="footer">
	<h1>Hello footer</h1>
</footer>
