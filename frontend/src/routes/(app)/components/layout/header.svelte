<script lang="ts">
	import UserMenu from './user-menu/user-menu.svelte';
	import LoginSkeleton from './login-skeleton.svelte';
	import { AppBar } from '@skeletonlabs/skeleton';
	import Icon from '@iconify/svelte';
	import { auth } from '../../../../stores/auth';
	import MobileMenu from './mobile-menu.svelte';
	import { getHeaderLinks } from '../../../../constants/links';
	import UserMenuModal from './user-menu/user-menu-modal.svelte';
	import Notifications from './notifications.svelte';
	import NotificationModal from './notification-modal.svelte';
	import Link from './link.svelte';
	import LanguageSelect from './language-select.svelte';
	import { i18n, t, localizeHref } from '$lib/i18n';
	import { profileCache } from '$lib/cache/profile';
	import { mmrCache } from '$lib/cache/mmr';

	let mobileMenuOpened = false;

	let scrollY = $state(0);
	let header: HTMLElement | undefined;
	let isOpen = $state(false);

	let scrollPosition = 0;
	let scrollFromLastDirectionChange = 0;
	const scrollTolerance = 25;

	let headerLinks = $derived.by(() => {
		void i18n.locale;
		return getHeaderLinks(t);
	});

	// Data is reloaded by navigating to the page in the other language
	function handleLocaleChange() {
		profileCache.clear();
		mmrCache.clear();
	}

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
				isOpenModal = false;
				isOpenNotifications = false;
			}
		}

		// Ensure that there header will always stick to top when we see can see it
		if (scrollY < header.offsetHeight && header.style.transform !== 'translateY(0)') {
			header.style.transform = 'translateY(0)';
		}
	});

	function handleIsOpen() {
		isOpen = !isOpen;
	}

	// 0 loading · 1 signed in · 2 signed out
	let isAuthenticated = $derived($auth.loaded === false ? 0 : $auth.data ? 1 : 2);

	let isOpenModal = $state(false);
	let isOpenNotifications = $state(false);
	let modal: HTMLElement | undefined = $state(undefined);
	let notificationModal: HTMLElement | undefined = $state(undefined);
</script>

<svelte:window bind:scrollY />

<header
	bind:this={header}
	class="fixed top-0 z-40 w-full transition-all duration-300"
	style="box-shadow: 0px 6px 20px 10px rgba(32,32,32,0.25);"
>
	<AppBar
		class="header"
		gridColumns="grid-cols-3"
		slotDefault="place-self-center"
		slotTrail="place-content-end"
	>
		{#snippet lead()}
			{#if isAuthenticated === 1}
				<div class="md:hidden">
					<UserMenu bind:isOpenModal bind:modal />
				</div>
			{:else}
				<h1 class="font-heading text-3xl md:hidden font-bold">Duelovky</h1>
			{/if}
			<a href={localizeHref('/')}>
				<h1 class="font-heading text-4xl hidden md:inline font-bold">Duelovky</h1>
			</a>
		{/snippet}
		<ul class="hidden gap-16 lg:flex">
			{#each headerLinks as link}
				<Link {link} />
			{/each}
		</ul>

		{#if isAuthenticated === 1}
			<h1 class="font-heading text-3xl md:hidden font-bold">Duelovky</h1>
		{/if}

		{#snippet trail()}
			<div class="mr-2 hidden md:block">
				<LanguageSelect onChange={handleLocaleChange} />
			</div>
			{#if isAuthenticated === 1 && $auth.data}
				<div class="hidden md:block lg:hidden">
					<UserMenu bind:isOpenModal bind:modal />
				</div>
				<Notifications bind:isOpenNotifications bind:modal={notificationModal} />
				<div class="hidden lg:block">
					<UserMenu bind:isOpenModal bind:modal />
				</div>
				<Icon
					width="30"
					icon="heroicons-outline:menu-alt-3"
					onclick={handleIsOpen}
					class="cursor-pointer lg:hidden !ml-1 sm:ml-auto"
				/>
			{:else if isAuthenticated === 2}
				<Notifications bind:isOpenNotifications bind:modal={notificationModal} />
				<Icon
					width="38"
					icon="heroicons-outline:menu-alt-3"
					onclick={handleIsOpen}
					class="cursor-pointer lg:hidden"
				/>
				<a
					href={localizeHref('/login')}
					class="variant-filled-primary btn hidden h-10 w-40 items-center justify-center text-sm font-bold uppercase tracking-wide lg:flex"
				>
					{t('nav.login')}
				</a>
			{:else}
				<LoginSkeleton />
			{/if}
		{/snippet}
	</AppBar>
</header>

{#if isOpenModal}
	<UserMenuModal bind:modal bind:isOpen={isOpenModal} />
{/if}
{#if isOpenNotifications}
	<NotificationModal bind:isOpenNotifications bind:modal={notificationModal} />
{/if}
<MobileMenu links={headerLinks} bind:isOpen {isAuthenticated} onLocaleChange={handleLocaleChange} />
