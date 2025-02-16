<script lang="ts">
	let {signIn}: {signIn: string} = $props();

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
			localStorage.setItem('token', data.token);
			window.location.href = '/';
		} else {
			alert("Špatné přihlašovací údaje");
			password = '';
		}
	}

	async function handleSignUp() {
		if (password !== password2) {
			alert("Hesla se neshodují");
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
			localStorage.setItem('token', data.token);
			window.location.href = '/';
		} else {
			alert("Registrace se nezdařila");
		}
	}

	function handleSubmit(e: Event) {
		e.preventDefault()

		if (signIn) {
			handleSignIn();
		} else {
			handleSignUp();
		}
	}
</script>

<div class="w-[80%] mt-12 min-h-[80vh] grid grid-cols-[60%,40%] justify-center items-center mx-auto">
	<div class="flex flex-col justify-center items-center bg-tertiary-700 gap-8 rounded-l-md px-6 py-8 w-full h-[30rem]">
		<h2 class="text-4xl text-center font-heading font-bold">{signIn ? "Přihlásit se" : "Registrovat se"}</h2>
		<form onsubmit={handleSubmit} class="w-full max-w-[34rem] mx-auto flex flex-col {signIn ? 'gap-4' : 'gap-1'}">
			{#if !signIn}
				<div class="flex mt-2 gap-3 w-full items-center">
					<label for="username" class="label {signIn ? 'w-20' : 'w-32'} text-right">Přezdívka</label>
					<input
						bind:value={username}
						name="username"
						type="text"
						class="input w-full !bg-tertiary-800 p-2 text-sm"
					/>
				</div>
			{/if}
			<div class="flex mt-2 gap-3 w-full items-center">
				<label for="email" class="label {signIn ? 'w-20' : 'w-32'} text-right">E-mail</label>
				<input
					bind:value={email}
					name="email"
					type="email"
					class="input w-full !bg-tertiary-800 p-2 text-sm"
				/>
			</div>
			<div class="flex mt-2 gap-3 w-full items-center">
				<label for="pass" class="label {signIn ? 'w-20' : 'w-32'}  text-right">Heslo</label>
				<input
					bind:value={password}
					name="pass"
					type="password"
					class="input w-full !bg-tertiary-800 p-2 text-sm"
				/>
			</div>
			{#if !signIn}
				<div class="flex mt-2 gap-3 w-full items-center">
					<label for="pass2" class="label w-32 text-right">Heslo znovu</label>
					<input
						bind:value={password2}
						name="pass2"
						type="password"
						class="input w-full !bg-tertiary-800 p-2 text-sm"
					/>
				</div>
			{/if}
			<button class="btn h-11 mt-2 w-full bg-primary-600 text-white">{signIn ? "Přihlásit se" : "Registrovat se"}</button>
		</form>
	</div>

	<div class="bg-secondary-600 rounded-r-md py-8 px-6 h-[30rem] flex flex-col justify-center items-center">
		<h2 class="text-4xl text-center font-heading font-bold">{signIn ? "Ještě nemáte účet ?" : "Už máte svůj účet ?"}</h2>
		<p>{signIn ? "Vytvořte si ho nyní" : "Přihlaště se k němu"}</p>
		<a href="{signIn ? '/register' : '/login'}" class="btn bg-tertiary-700 h-12 w-full max-w-56 mt-5">{signIn ? "Registrovat se" : "Přihlásit se"}</a>
	</div>
</div>