import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import type { User } from '../types/user';
import { goto } from '$app/navigation';
import { API } from '../constants/urls';

// User store
export const auth = writable<{ token: string | null; data: User | null; loaded: boolean }>({
	token: null,
	data: null,
	loaded: false
});

// Function to fetch user data
async function fetchUserData(token: string) {
	let response: Response;
	try {
		response = await fetch(`${API}/api/secured/user`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			}
		});
	} catch {
		await goto('/error/out-of-service');
		auth.update((u) => ({ ...u, token: null, data: null, loaded: true }));
		return;
	}

	if (!response.ok) {
		auth.update((u) => ({ ...u, token: null, data: null, loaded: true }));
		return;
	}

	const data = await response.json();
	localStorage.removeItem('out-of-service');
	auth.update((u) => ({ ...u, data, loaded: true }));
}

// Function to initialize or update the user state
export function updateUserState() {
	if (browser) {
		const token = localStorage.getItem('token');

		if (token) {
			auth.set({ token, data: null, loaded: false });
			void fetchUserData(token); // Fetch user data if token exists
		} else {
			auth.set({ token: null, data: null, loaded: true }); // Clear user state if no token
		}
	}
}

// Initialize user state synchronously on first load
if (browser) {
	updateUserState();

	// Listen for changes to localStorage from other tabs/windows
	window.addEventListener('storage', (event) => {
		if (event.key === 'token') {
			updateUserState(); // Update user state when token changes
		}
	});
}

// Function to set the token (e.g., after login)
export function setToken(token: string) {
	if (browser) {
		document.cookie = `token=${token}; path=/; max-age=604800; SameSite=Lax; Secure`;
		localStorage.setItem('token', token);
		updateUserState(); // Update user state immediately
	}
}

// Function to clear the token (e.g., after logout)
export function clearToken() {
	if (browser) {
		document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`; // Clear cookie
		localStorage.removeItem('token');
		updateUserState(); // Update user state immediately
	}
}
