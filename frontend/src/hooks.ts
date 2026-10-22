import type { Reroute } from '@sveltejs/kit';
import { delocalizePath } from '$lib/i18n/routing';

// Maps public localized URLs (`/en/games/prsi`, `/hry/prsi`, ...) onto the route folders (`/game-detail/1`)
export const reroute: Reroute = ({ url }) => delocalizePath(url.pathname);
