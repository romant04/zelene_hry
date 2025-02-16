<script lang="ts">
	import hpHeroVideo from '../../../assets/videos/hp-hero-optimised.mp4';
	import hpHeroPoster from '../../../assets/images/hp-hero-poster.jpg';
</script>

<div class="relative h-[95vh] w-full overflow-hidden">
	<video
		src="{hpHeroVideo}"
		loop
		autoplay
		muted
		poster="{hpHeroPoster}"
		class="h-full w-full object-cover brightness-[65%]"
	></video>
	<div class="absolute left-6 md:left-12 lg:left-16 top-12 flex flex-col gap-5 md:gap-3">
		<h1 class="font-heading text-5xl md:text-6xl lg:text-8xl font-bold tracking-wide">Duelovky</h1>
		<p
			class="font-heading text-xl md:text-2xl lg:text-4xl font-semibold lg:leading-[2.75rem] tracking-wide text-success-400"
		>
			Klasické deskové hry, všechny <br />
			na jednom místě
		</p>
	</div>
	<a
		href="#hry"
		class="group relative bottom-28 lg:bottom-32 left-1/2 flex w-fit -translate-x-1/2 cursor-pointer flex-col items-center gap-1 lg:gap-3"
	>
		<p class="text-xl lg:text-[1.65rem] uppercase tracking-[0.2em] text-success-400">Prozkoumat</p>
		<svg
			width="36"
			height="36"
			xmlns="http://www.w3.org/2000/svg"
			xml:space="preserve"
			id="chevron-down"
			x="0"
			y="0"
			version="1.1"
			viewBox="0 0 512 512"
			class="text-success-400 h-6 lg:h-9 transition-all duration-300 ease-[cubic-bezier(0.42,0,0.44,1.68)] group-hover:translate-y-6"
		>
			<path
				fill="currentColor"
				d="M256 298.3l174.2-167.2c4.3-4.2 11.4-4.1 15.8.2l30.6 29.9c4.4 4.3 4.5 11.3.2 15.5L264.1 380.9c-2.2 2.2-5.2 3.2-8.1 3-3 .1-5.9-.9-8.1-3L35.2 176.7c-4.3-4.2-4.2-11.2.2-15.5L66 131.3c4.4-4.3 11.5-4.4 15.8-.2L256 298.3z"
			></path>
		</svg>
	</a>
</div>
