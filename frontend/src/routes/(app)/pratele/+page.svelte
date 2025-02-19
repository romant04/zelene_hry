<script lang="ts">
	import PlayerCard from './components/player-card.svelte';
	import FriendRequest from './components/friend-request.svelte';

	let searchTerm = $state('');
	let filter = $state('');
	let debounceTimeout: number | null = $state(null);

	function handleSearch(event: Event & { currentTarget: EventTarget & HTMLInputElement }) {
		if (!event.target) {
			return;
		}

		searchTerm = (event.target as HTMLInputElement).value;
		if (debounceTimeout) {
			clearTimeout(debounceTimeout);
		}
		debounceTimeout = window.setTimeout(() => {
			filter = searchTerm;
			debounceTimeout = null;
		}, 750);
	}

	// TODO: Implement pagination instead of scrollbar where it looks better
	const players = ['Player1', 'Player2', 'Player3', 'CD-Rom'];
	const friends = ['CH-ROM', 'Player156', 'Player0'];
	const request = [
		{
			name: 'Player4',
			message: 'Hello, please add me as your friend!'
		}
	];
</script>

<svelte:head>
	<title>Duelovky | Přátelé</title>
</svelte:head>

<div class="container mt-16 grid grid-cols-2 gap-10">
	<div>
		<h2 class="font-heading text-4xl font-semibold">Najít hráče</h2>
		<div
			class="mt-5 rounded-md bg-gradient-to-tr from-tertiary-700 to-tertiary-500 p-5 shadow-sm shadow-primary-600"
		>
			<div class="flex items-center gap-2">
				<label for="search" class="label text-sm font-bold">Vyhledat: </label>
				<input
					type="text"
					name="search"
					class="input !bg-surface-900 px-2 py-1"
					placeholder="Jméno hráče"
					oninput="{handleSearch}"
				/>
			</div>
			<div class="mt-5 flex h-[30rem] flex-col gap-2 overflow-auto">
				{#each players.filter(x => x.toLowerCase().includes(filter.toLowerCase())) as
				player}
				<PlayerCard name="{player}" isFriend="{false}" />
				{/each}
			</div>
		</div>
	</div>

	<div class="flex flex-col gap-10">
		<div>
			<h2 class="font-heading text-4xl font-semibold">Moji přátelé</h2>
			<div class="mt-5 flex max-h-[15rem] flex-col gap-2 overflow-auto">
				{#each friends as friend}
				<PlayerCard bgColor="bg-surface-600" name="{friend}" isFriend="{true}" />
				{/each}
			</div>
		</div>
		<div>
			<h2 class="font-heading text-4xl font-semibold">Žádosti o přátelství</h2>
			<div class="mt-5 flex max-h-[15rem] flex-col gap-2 overflow-auto">
				{#each request as request}
				<FriendRequest name="{request.name}" message="{request.message}" />
				{/each}
			</div>
		</div>
	</div>
</div>
