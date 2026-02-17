<script lang="ts">
	import { userMenuLinks } from '../../../../../constants/links.js';
	import { fly } from 'svelte/transition';
	import { auth } from '../../../../../stores/auth.js';
	import { clearToken } from '../../../../../stores/auth.js';
	import { profileCache } from '$lib/cache/profile';
	import { socialCache } from '$lib/cache/socials';
	import { chatsCache } from '$lib/cache/chats';
	import { protectedRoutes } from '../../../../../constants/protectedRoutes';
	import { goto } from '$app/navigation';

	let {
		modal = $bindable(),
		isOpen = $bindable()
	}: { modal: HTMLElement | undefined; isOpen: boolean } = $props();

	function handleSignOut() {
		isOpen = false;
		profileCache.clear();
		socialCache.clear();
		chatsCache.clear();
		clearToken();

		// Redirect to home if the user is currently on a protected route
		const isProtected = protectedRoutes.some((route) =>
			window.location.pathname.startsWith(route)
		);
		if (isProtected) {
			goto('/', { replaceState: true });
		}
	}

	function handleClose() {
		isOpen = false;
	}
</script>

<div
	transition:fly={{ y: -200, duration: 300, opacity: 1 }}
	bind:this={modal}
	class="fixed top-16 left-3 md:left-auto md:right-3 bg-tertiary-600 z-30 px-4 pt-5 pb-4 w-64 h-48 rounded-md"
>
	<div class="h-full flex flex-col justify-between">
		<div>
			<p class="text-xl font-semibold">{$auth.data?.username}</p>
			<ul class="flex flex-col gap-1 mt-2">
				{#each userMenuLinks as { href, text }}
					<li>
						<a
							onclick={handleClose}
							{href}
							class="btn bg-tertiary-700 text-[0.9rem] w-full h-7 font-semibold"
							>{text}</a
						>
					</li>
				{/each}
			</ul>
		</div>
		<button onclick={handleSignOut} class="btn variant-filled-secondary !text-white h-8 w-full"
			>Odhlásit se</button
		>
	</div>
</div>
