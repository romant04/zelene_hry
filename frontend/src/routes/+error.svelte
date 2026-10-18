<script lang="ts">
	import '../app.postcss';
	import '../main.css';
	import brokenRobot from '../assets/images/broken-robot.png';
	import { t } from '$lib/i18n';
</script>

<svelte:head>
	<title>Duelovky | 404</title>
</svelte:head>

<main class="main container flex flex-col gap-16 h-full justify-center items-center">
	<h1 class="text-5xl font-bold">{t('errors.notFound')}</h1>
	<img src={brokenRobot} alt="broken robot" />
</main>
