<script lang="ts">
	import '../../app.postcss';
	import { AppBar } from '@skeletonlabs/skeleton';
	import AppFooter from './components/layout-footer.svelte';
	import Icon from '@iconify/svelte';

	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();

	const LINKS = [
		{
			href: '/#hry',
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

	let mobileMenuOpened = false;

	let scrollY = $state(0);
	let header: HTMLDivElement | undefined;

	let scrollPosition = 0;
	let scrollFromLastDirectionChange = 0;
	const scrollTolerance = 25;

	$effect(() => {
		if (!header) {
			return;
		}

		const newScrollPosition = Math.max(scrollY, 0);
		const oldDirection = scrollFromLastDirectionChange < 0 ? 'up' : 'down';
		const newDirection = newScrollPosition > scrollPosition ? 'down' : 'up';

		if (oldDirection !== newDirection) {
			scrollFromLastDirectionChange = 0;
		}
		scrollFromLastDirectionChange += newScrollPosition - scrollPosition;

		scrollPosition = newScrollPosition;

		if (
			Math.abs(scrollFromLastDirectionChange) > scrollTolerance &&
			scrollY > header.offsetHeight &&
			mobileMenuOpened === false
		) {
			if (scrollFromLastDirectionChange < 0) {
				header.style.transform = 'translateY(0)';
			} else {
				header.style.transform = 'translateY(-100%)';
			}
		}

		// Ensure that there header will always stick to top when we see can see it
		if (scrollY < header.offsetHeight && header.style.transform !== 'translateY(0)') {
			header.style.transform = 'translateY(0)';
		}
	});
</script>

<svelte:window bind:scrollY="{scrollY}"></svelte:window>

<!-- App Bar -->
<div bind:this="{header}" class="fixed top-0 z-20 w-full transition-all duration-300">
	<AppBar
		class="header"
		gridColumns="grid-cols-3"
		slotDefault="place-self-center"
		slotTrail="place-content-end"
	>
		{#snippet lead()}
		<h1 class="font-heading text-4xl font-bold">Duelovky</h1>
		{/snippet}
		<ul class="hidden gap-16 lg:flex">
			{#each LINKS as { href, target, text }}
			<li class="group">
				<a
					class="relative text-xl after:absolute after:-bottom-[2px] after:left-0 after:h-[2px] after:w-0 after:rounded-sm after:bg-success-500 after:transition-all after:duration-[200ms] after:ease-out group-hover:after:w-[105%]"
					{href}
					{target}
					>{text}</a
				>
			</li>
			{/each}
		</ul>
		{#snippet trail()}
		<Icon width="38" icon="material-symbols:account-circle" class="lg:hidden text-primary-400 cursor-pointer" />
		<a
			href="/login"
			class="variant-filled-primary hidden lg:flex justify-center items-center btn h-10 w-40 text-sm font-bold uppercase tracking-wide"
		>
			Přihlásit se
		</a>
		{/snippet}
	</AppBar>
</div>

<main class="main h-full pt-16">{@render children?.()}</main>

<!-- Footer -->
<AppFooter />
