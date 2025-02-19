<script lang="ts">
	let { signIn }: { signIn: boolean } = $props();
	import { setToken } from '../../../../stores/auth';
	import FormField from './form-field.svelte';

	let username = $state('');
	let email = $state('');
	let password = $state('');
	let password2 = $state('');

	async function handleSignIn() {
		const res = await fetch('http://localhost:8080/auth/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				email,
				password
			})
		});
		const data = await res.json();

		if (res.ok) {
			setToken(data.token);
			window.location.href = '/';
		} else {
			alert('Špatné přihlašovací údaje');
			password = '';
		}
	}

	async function handleSignUp() {
		if (password !== password2) {
			alert('Hesla se neshodují');
			return;
		}

		const res = await fetch('http://localhost:8080/auth/register', {
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

		const data = await res.json();

		if (res.ok) {
			setToken(data.token);
			window.location.href = '/';
		} else {
			alert('Registrace se nezdařila');
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
	class="mx-auto mt-12 grid w-[80%] grid-cols-1 items-center justify-center lg:min-h-[80vh] lg:grid-cols-[60%,40%]"
>
	<div
		class="flex h-[24rem] w-full flex-col items-center justify-center gap-4 rounded-t-md bg-tertiary-700 px-6 py-8 lg:h-[30rem] lg:gap-8 lg:rounded-l-md lg:rounded-t-none"
	>
		<h2 class="text-center font-heading text-2xl font-bold lg:text-4xl">
			{signIn ? "Přihlásit se" : "Registrovat se"}
		</h2>
		<form
			onsubmit="{handleSubmit}"
			class="{signIn ? 'gap-2 lg:gap-4' : 'gap-1 lg:gap-3'} mx-auto flex w-full max-w-[34rem] flex-col"
		>
			{#if !signIn}
			<FormField
				bind:value="{username}"
				{signIn}
				name="username"
				type="text"
				label="Přezdívka"
			/>
			{/if}
			<FormField bind:value="{email}" {signIn} name="email" type="email" label="E-mail" />
			<FormField bind:value="{password}" {signIn} name="pass" type="password" label="Heslo" />
			{#if !signIn}
			<FormField
				bind:value="{password2}"
				{signIn}
				name="pass2"
				type="password"
				label="Heslo znovu"
			/>
			{/if}
			<button class="btn mt-2 h-11 w-full bg-primary-600 text-white">
				{signIn ? "Přihlásit se" : "Registrovat se"}
			</button>
		</form>
	</div>

	<div
		class="flex h-[18rem] flex-col items-center justify-center rounded-b-md bg-secondary-600 px-6 py-8 lg:h-[30rem] lg:rounded-b-none lg:rounded-r-md"
	>
		<h2 class="text-center font-heading text-2xl font-bold lg:text-4xl">
			{signIn ? "Ještě nemáte účet ?" : "Už máte svůj účet ?"}
		</h2>
		<p>{signIn ? "Vytvořte si ho nyní" : "Přihlaště se k němu"}</p>
		<a
			href="{signIn ? '/register' : '/login'}"
			class="btn mt-5 h-12 w-full max-w-56 bg-tertiary-700"
			>{signIn ? "Registrovat se" : "Přihlásit se"}</a
		>
	</div>
</div>
