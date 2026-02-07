<script lang="ts">
	import { goto } from '$app/navigation';

	let { signIn }: { signIn: boolean } = $props();
	import { setToken } from '../../../../stores/auth';
	import FormField from './form-field.svelte';
	import { API } from '../../../../constants/urls';
	import { addToast } from '../../../../stores/toast';

	let username = $state('');
	let email = $state('');
	let password = $state('');
	let password2 = $state('');

	async function handleSignIn() {
		const res = await fetch(`${API}/auth/login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				email,
				password
			})
		});

		let data;
		let error: string;

		const contentType = res.headers.get('content-type');
		if (contentType && contentType.includes('application/json')) {
			data = await res.json();
		} else {
			error = await res.text();
			addToast(`${error}`, 'error'); // If there is a defined error message use it.
			return;
		}

		if (res.ok) {
			setToken(data.token);
			await goto('/');
		} else {
			addToast('Špatné přihlašovací údaje', 'error');
			password = '';
		}
	}

	async function handleSignUp() {
		if (password !== password2) {
			addToast('Hesla se neshodují', 'error');
			return;
		}

		const res = await fetch(`${API}/auth/register`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				email,
				username,
				password
			})
		});

		let data;
		let error: string;

		const contentType = res.headers.get('content-type');
		if (contentType && contentType.includes('application/json')) {
			data = await res.json();
		} else {
			error = await res.text();
			addToast(`${error}`, 'error'); // If there is a defined error message use it.
			return;
		}

		if (res.ok) {
			setToken(data.token);
			await goto('/');
		} else {
			addToast('Registrace se nezdařila', 'error');
		}
	}

	function handleSubmit(e: Event) {
		e.preventDefault();

		if (signIn) {
			handleSignIn();
		} else {
			handleSignUp();
		}
	}
</script>

<div
	class="mx-auto mt-12 grid w-[75%] grid-cols-1 items-center justify-center lg:min-h-[80vh] lg:grid-cols-[60%,40%]"
>
	<div
		class="flex h-[24rem] relative overflow-hidden w-full flex-col items-center justify-center gap-4 rounded-t-md bg-tertiary-700 px-6 py-8 lg:h-[30rem] xl:h-[36rem] lg:gap-8 lg:rounded-l-md lg:rounded-t-none"
	>
		<div class="absolute -top-20 -left-20 bg-tertiary-600 w-52 h-52 rounded-full"></div>

		<h2 class="text-center font-heading text-2xl font-bold lg:text-4xl">
			{signIn ? 'Přihlásit se' : 'Registrovat se'}
		</h2>
		<form
			onsubmit={handleSubmit}
			class="{signIn
				? 'gap-2 lg:gap-4'
				: 'gap-1 lg:gap-3'} mx-auto flex w-full max-w-[34rem] flex-col"
		>
			{#if !signIn}
				<FormField
					bind:value={username}
					{signIn}
					name="username"
					type="text"
					label="Přezdívka"
				/>
			{/if}
			<FormField bind:value={email} {signIn} name="email" type="email" label="E-mail" />
			<FormField bind:value={password} {signIn} name="pass" type="password" label="Heslo" />
			{#if !signIn}
				<FormField
					bind:value={password2}
					{signIn}
					name="pass2"
					type="password"
					label="Heslo znovu"
				/>
			{/if}
			<button type="submit" class="btn mt-2 h-11 w-full bg-primary-600 text-white">
				{signIn ? 'Přihlásit se' : 'Registrovat se'}
			</button>
		</form>
	</div>

	<div
		class="flex h-[18rem] relative overflow-hidden flex-col items-center justify-center rounded-b-md bg-primary-600 px-6 py-8 lg:h-[30rem] xl:h-[36rem] lg:rounded-b-none lg:rounded-r-md"
	>
		<div class="absolute -bottom-20 -right-20 bg-primary-500 w-52 h-52 rounded-full"></div>

		<h2 class="text-center font-heading text-2xl font-bold lg:text-4xl">
			{signIn ? 'Ještě nemáte účet ?' : 'Už máte svůj účet ?'}
		</h2>
		<p class="max-w-60 text-center">
			{signIn
				? 'Vytvořte si ho nyní a přidejte se k aktivní hráčské komunitě'
				: 'Přihlašte se nyní ať můžete pokračovat v duelování'}
		</p>
		<a
			href={signIn ? '/register' : '/login'}
			class="btn mt-5 h-12 w-full max-w-56 bg-tertiary-700"
			>{signIn ? 'Registrovat se' : 'Přihlásit se'}</a
		>
	</div>
</div>
