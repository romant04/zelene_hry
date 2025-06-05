<!-- YOU CAN DELETE EVERYTHING IN THIS PAGE -->
<script lang="ts">
	import HpHero from './components/hp-hero.svelte';
	import slovniFotbal from '../../assets/images/slovni-fotbal.webp';
	import prsi from '../../assets/images/prsi.webp';
	import horolezci from '../../assets/images/horolezci.webp';
	import dama from '../../assets/images/dama.webp';
	import lode from '../../assets/images/lode.webp';
	import GameCard from './components/game-card.svelte';

	// TODO: Fetch games from db
	const GAMES = [
		{
			image: slovniFotbal,
			title: 'Slovní fotbal',
			perex: 'Utkej se společeně se svým protihráčem ve hře, která prověří vaší slovní zásobu a otestuje vaše oči. Kdo dokáže sestavit více slov než vyprší čas?',
			tags: [
				{ tagName: 'Hra se slovy', tagColor: 'text-success-500' },
				{ tagName: 'Logické', tagColor: 'text-secondary-400' }
			]
		},
		{
			image: prsi,
			title: 'Prší',
			perex: 'Zahraj si oblíbenou klasickou karetní hru Prší, kde se utkáš se svým protihráčem ve strategii a rychlém myšlení! Kdo se jako první zbaví všech karet se stává vítězem!',
			tags: [
				{ tagName: 'Karetní', tagColor: 'text-success-500' },
				{ tagName: 'Logické', tagColor: 'text-secondary-400' }
			]
		},
		{
			image: horolezci,
			title: 'Horolezci',
			perex: 'Hra Horolezci prozkouší vaší znalost nejrůznějších pořekadel a rčení. Budete riskovat pro více bodů nebo se podržíte jistoty? To vše může rozhodnout o tom kdo se dostane na vrchol jako první.',
			tags: [
				{ tagName: 'Hra se slovy', tagColor: 'text-success-500' },
				{ tagName: 'Strategické', tagColor: 'text-secondary-400' }
			]
		},
		{
			image: dama,
			title: 'Dáma',
			perex: 'Vyzkoušej svůj důvtip a strategii v klasické hře Dámy! Přelsti soupeře a dobyj jeho kameny - kdo z vás bude králem šachovnice?',
			tags: [
				{ tagName: 'Desková hra', tagColor: 'text-success-500' },
				{ tagName: 'Strategické', tagColor: 'text-secondary-400' }
			]
		},
		{
			image: lode,
			title: 'Lodě',
			perex: 'Zapoj taktiku a přesnost ve hře Lodě! Ponoř soupeřovu flotilu dřív, než objeví tvé lodě a staň se vládcem moře.',
			tags: [
				{ tagName: 'Desková hra', tagColor: 'text-success-500' },
				{ tagName: 'Strategické', tagColor: 'text-secondary-400' }
			]
		}
	];
</script>

<svelte:head>
	<title>Duelovky</title>
</svelte:head>

<div class="h-full">
	<HpHero />
	<div class="container mx-auto pt-24" id="hry">
		<div class="flex flex-col gap-1">
			<h2 class="font-heading text-4xl md:text-5xl font-semibold tracking-wide">
				Online hry
			</h2>
			<p class="text-lg md:text-[24px] leading-tight md:leading-[32px]">
				Hrej online proti ostatním lidem a nebo vyzvi své <br />
				kamarády na duel
			</p>
		</div>

		<div
			class="mt-8 grid grid-cols-1 justify-items-center gap-10 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
		>
			{#each GAMES as game}
				<GameCard
					image={game.image}
					perex={game.perex}
					title={game.title}
					tags={game.tags}
				/>
			{/each}
		</div>
	</div>
</div>
