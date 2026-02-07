import { type Handle, redirect } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get('token'); // 1. Read the token from cookies
	const protectedRoutes = ['/chat', '/pratele'];

	// Check if the current URL starts with any of your protected paths
	const isProtected = protectedRoutes.some((route) => event.url.pathname.startsWith(route));
	if (isProtected && !token) {
		throw redirect(303, '/login');
	}

	// 2. Pass it into "locals" so all load functions can see it
	event.locals.token = token || null;

	// 3. Proceed with the request
	return resolve(event);
};
