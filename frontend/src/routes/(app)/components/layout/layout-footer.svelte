<script lang="ts">
	import { page } from '$app/state';
	import { t, localizeHref } from '$lib/i18n';
	import emailjs from '@emailjs/browser';
	import { addToast } from '../../../../stores/toast';
	import Spinner from '../spinner.svelte';

	let email = $state('');
	let message = $state('');

	let loading = $state(false);

	let LINKS = $derived([
		{
			title: t('footer.popularGames'),
			links: [
				{
					label: t('footer.wordFootball'),
					href: localizeHref('/game-detail/2')
				},
				{
					label: t('footer.climbers'),
					href: localizeHref('/game-detail/3')
				},
				{
					label: t('footer.prsi'),
					href: localizeHref('/game-detail/1')
				}
			]
		},
		{
			title: t('footer.myAccount'),
			links: [
				{
					label: t('footer.login'),
					href: localizeHref('/login')
				},
				{
					label: t('footer.register'),
					href: localizeHref('/register')
				},
				{
					label: t('footer.friends'),
					href: localizeHref('/pratele')
				},
				{
					label: t('footer.chat'),
					href: localizeHref('/chat')
				}
			]
		},
		{
			title: t('footer.contactUs'),
			links: [
				{
					label: 'duelovky@gmail.com',
					href: ''
				}
			]
		}
	]);

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (!email || !message) {
			addToast(t('footer.fillAllFields'), 'error');
			return;
		}

		loading = true;

		const templateParams = {
			email: email,
			message: message
		};

		try {
			// Pass your Public Key right into the options object
			await emailjs.send('service_qh0fldb', 'template_dsk7hol', templateParams, {
				publicKey: 'gcD1cewvlGFquiutv'
			});

			addToast(t('footer.emailSent'), 'success');

			email = '';
			message = '';
		} catch (error) {
			console.error('Failed to send:', error);
			addToast(t('footer.emailFailed'), 'error');
		} finally {
			loading = false;
		}
	}
</script>

<footer
	class="footer {!page.url.pathname.includes('/chat') &&
		'mt-20'} flex min-h-[24rem] h-max flex-col justify-between bg-tertiary-700 pt-10"
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
				<h4 class="mb-3 text-2xl">{t('footer.foundBug')}</h4>
				<form class="w-full" onsubmit={handleSubmit}>
					<div>
						<label for="email" class="label">{t('footer.email')}</label>
						<input
							name="email"
							type="email"
							class="input w-full !bg-tertiary-800 p-2 text-sm"
							bind:value={email}
						/>
					</div>
					<div class="mt-2">
						<label class="label" for="bug-desc">{t('footer.bugDescription')}</label>
						<textarea
							name="bug-desc"
							class="textarea resize-none !bg-tertiary-800 p-2 text-sm"
							rows="3"
							bind:value={message}
						></textarea>
					</div>
					<button type="submit" class="btn h-9 w-full bg-secondary-700">
						{#if loading}
							<Spinner fill="fill-gray-500" />
						{:else}
							{t('footer.reportBug')}
						{/if}
					</button>
				</form>
			</div>
		</div>
	</section>

	<section
		class="mt-8 flex md:flex-row gap-8 flex-col w-full items-center justify-between bg-tertiary-800 px-6 py-2"
	>
		<h2 class="font-heading text-3xl font-semibold tracking-wide">Duelovky</h2>
		<p class="text-xs">&copy; Copyright - Roman Tarnai 2024</p>
	</section>
</footer>
