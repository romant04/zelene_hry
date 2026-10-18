<script lang="ts">
	import brokenRobot from '../../../assets/images/broken-robot.png';
	import { onMount } from 'svelte';
	import { t } from '$lib/i18n';

	onMount(() => {
		localStorage.setItem('out-of-service', 'y');
	});
</script>

<svelte:head>
	<title>{t('errors.outOfServiceTitle')}</title>
</svelte:head>

<div class="container h-full justify-center flex flex-col gap-16 items-center">
	<h1 class="text-5xl font-bold text-center leading-[4rem]">
		{@html t('errors.outOfService')}
	</h1>
	<img src={brokenRobot} alt="broken robot" />
</div>
