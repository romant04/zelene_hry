<script lang="ts">
	import { i18n, type Locale } from '$lib/i18n';
	import { profileCache } from '$lib/cache/profile';
	import { mmrCache } from '$lib/cache/mmr';

	interface Props {
		data: { locale: Locale };
		children?: import('svelte').Snippet;
	}

	let { data, children }: Props = $props();

	// Set before children render, so SSR output is already in the right language
	i18n.locale = data.locale;

	$effect.pre(() => {
		if (i18n.locale !== data.locale) {
			// Cached API data is localized, drop it when the language changes
			profileCache.clear();
			mmrCache.clear();
			i18n.locale = data.locale;
		}
		document.documentElement.lang = data.locale;
	});
</script>

{@render children?.()}
