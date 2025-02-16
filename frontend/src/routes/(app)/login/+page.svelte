<script lang="ts">
	import AuthForm from '../components/auth-form.svelte';
</script>

<svelte:head>
	<title>Duelovky | Přihlášení</title>
</svelte:head>

<h1>
	<AuthForm signIn={true} />
</h1>