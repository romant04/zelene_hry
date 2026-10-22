import type { LayoutLoad } from './$types';
import { localeFromPath } from '$lib/i18n/routing';

// The language is part of the URL, so it is re-evaluated on every navigation
// (including client-side ones, where server loads don't rerun).
export const load: LayoutLoad = ({ url }) => {
	return { locale: localeFromPath(url.pathname) };
};
