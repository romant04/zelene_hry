import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	// This passes the token from hooks.server.ts to the +page.ts load function
	return {
		token: locals.token
	};
};
