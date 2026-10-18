<script lang="ts">
	import AuthForm from '../components/auth-form/auth-form.svelte';
	import { t } from '$lib/i18n';
</script>

<svelte:head>
	<title>{t('auth.loginTitle')}</title>
</svelte:head>

<AuthForm signIn="{true}" />
