<script lang="ts">
	import SocialLink from './social-link.svelte';
	import { page } from '$app/state';

	const LINKS = [
		{
			title: 'Populární hry',
			links: [
				{
					label: 'Slovní fotbal',
					href: './game-detail.html'
				},
				{
					label: 'Horolezci',
					href: './game-detail.html'
				},
				{
					label: 'Prší',
					href: './game-detail.html'
				},
				{
					label: 'Lodě',
					href: './game-detail.html'
				}
			]
		},
		{
			title: 'Můj účet',
			links: [
				{
					label: 'Přihlášení',
					href: '/login'
				},
				{
					label: 'Registrace',
					href: '/register'
				},
				{
					label: 'Přátelé',
					href: '/pratele'
				},
				{
					label: 'Chat',
					href: '/chat'
				}
			]
		},
		{
			title: 'Kontaktujte nás',
			links: [
				{
					label: '+420 630 520 710'
				},
				{
					label: 'info@duelovky.cz',
					href: '#'
				}
			]
		}
	];
</script>

<footer
	class="footer {!page.url.pathname.includes('/chat') &&
		'mt-20'} flex min-h-[24rem] flex-col justify-between bg-tertiary-700 pt-10"
>
	<section
		class="grid grid-cols-1 gap-16 px-8 pb-5 lg:grid-cols-[2fr,auto,1fr] lg:px-16 xl:px-24"
	>
		<section
			class="grid mx-auto w-fit grid-cols-1 sm:flex sm:w-full flex-wrap justify-center gap-16 2xl:gap-24"
		>
			{#each LINKS as link}
				<div class="flex flex-col">
					<h4 class="mb-2 text-2xl">{link.title}</h4>
					{#each link.links as l}
						{#if l.href}
							<a href={l.href} class="text-gray-300 hover:text-gray-100">{l.label}</a>
						{:else}
							<p>{l.label}</p>
						{/if}
					{/each}
				</div>
			{/each}
		</section>

		<div class="mr-4 hidden h-full w-px bg-tertiary-200 md:block lg:mr-8 xl:mr-16"></div>
		<div class="flex w-full justify-center">
			<div class="w-full max-w-[24rem]">
				<h4 class="mb-3 text-2xl">Narazili jste na bug ?</h4>
				<form class="w-full">
					<div>
						<label for="email" class="label">E-mail</label>
						<input
							name="email"
							type="email"
							class="input w-full !bg-tertiary-800 p-2 text-sm"
						/>
					</div>
					<div class="mt-2">
						<label class="label" for="bug-desc">Popis bugu</label>
						<textarea
							name="bug-desc"
							class="textarea resize-none !bg-tertiary-800 p-2 text-sm"
							rows="3"
						></textarea>
					</div>
					<button class="btn h-9 w-full bg-secondary-700">Náhlasit bug</button>
				</form>
			</div>
		</div>
	</section>

	<section
		class="mt-8 flex md:flex-row gap-8 flex-col w-full items-center justify-between bg-tertiary-800 px-6 py-2"
	>
		<h2 class="font-heading text-3xl font-semibold tracking-wide">Duelovky</h2>
		<div class="flex gap-10">
			<SocialLink href="https://www.x.com">
				<svg
					class="w-6 text-black group-hover:text-white transition-all duration-150"
					role="img"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
				>
					<title>X</title>
					<path
						fill="currentColor"
						d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"
					/>
				</svg>
			</SocialLink>
			<SocialLink href="https://www.youtube.com">
				<svg
					role="img"
					class="w-6 text-black group-hover:text-white transition-all duration-150"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
				>
					<title>YouTube</title>
					<path
						fill="currentColor"
						d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
					/>
				</svg>
			</SocialLink>
			<SocialLink href="https://www.instagram.com">
				<svg
					role="img"
					class="w-6 text-black group-hover:text-white transition-all duration-150"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
				>
					<title>Instagram</title>
					<path
						fill="currentColor"
						d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077"
					/>
				</svg>
			</SocialLink>
		</div>
		<p class="text-xs">&copy; Copyright - Roman Tarnai 2024</p>
	</section>
</footer>
