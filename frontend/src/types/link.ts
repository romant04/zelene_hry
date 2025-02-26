import type { HTMLAttributeAnchorTarget } from 'svelte/elements';

export interface Link {
	href: string;
	text: string;
	target: HTMLAttributeAnchorTarget;
}
