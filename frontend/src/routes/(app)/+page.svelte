<!-- YOU CAN DELETE EVERYTHING IN THIS PAGE -->
<script lang="ts">
	import hpHeroVideo from '../../assets/videos/hp-hero-optimised.mp4';
	import hpHeroPoster from '../../assets/images/hp-hero-poster.jpg';
</script>

<svelte:head>
	<title>Duelovky | Home</title>
</svelte:head>

<div class="h-full">
	<div class="relative h-[95%] w-full overflow-hidden">
		<video
			src="{hpHeroVideo}"
			loop
			autoplay
			muted
			poster="{hpHeroPoster}"
			class="brightness-[65%]"
		></video>
	</div>
</div>
