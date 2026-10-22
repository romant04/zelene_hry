<script lang="ts">
	import { page } from '$app/state';
	import { SITE_URL } from '../../constants/urls';
	import { delocalizePath, i18n, LOCALES, localizePath, type Locale } from '$lib/i18n';

	interface Props {
		title: string;
		description: string;
		/** Absolute or site-relative image url for social previews */
		image?: string;
		/** schema.org structured data */
		jsonLd?: Record<string, unknown> | Record<string, unknown>[];
	}

	let { title, description, image, jsonLd }: Props = $props();

	const OG_LOCALES: Record<Locale, string> = { cs: 'cs_CZ', en: 'en_GB' };

	let routePath = $derived(delocalizePath(page.url.pathname));
	let canonical = $derived(SITE_URL + localizePath(routePath, i18n.locale));
	let alternates = $derived(
		LOCALES.map((locale) => ({ locale, href: SITE_URL + localizePath(routePath, locale) }))
	);
	let imageUrl = $derived(image && (image.startsWith('http') ? image : SITE_URL + image));

	// `<` is escaped so the JSON can never close the script tag early
	let jsonLdScript = $derived(
		jsonLd
			? `<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}<\/script>`
			: ''
	);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={canonical} />
	{#each alternates as alternate}
		<link rel="alternate" hreflang={alternate.locale} href={alternate.href} />
	{/each}
	<!-- English is the fallback for visitors whose language we don't have -->
	<link rel="alternate" hreflang="x-default" href={SITE_URL + localizePath(routePath, 'en')} />

	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="Duelovky" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={canonical} />
	<meta property="og:locale" content={OG_LOCALES[i18n.locale]} />
	{#each LOCALES.filter((locale) => locale !== i18n.locale) as locale}
		<meta property="og:locale:alternate" content={OG_LOCALES[locale]} />
	{/each}
	{#if imageUrl}
		<meta property="og:image" content={imageUrl} />
		<meta name="twitter:image" content={imageUrl} />
	{/if}
	<meta name="twitter:card" content={imageUrl ? 'summary_large_image' : 'summary'} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />

	{#if jsonLdScript}
		{@html jsonLdScript}
	{/if}
</svelte:head>
