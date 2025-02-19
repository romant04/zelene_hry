import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// User store
export const auth = writable<{ token: string | null; data: any }>({ token: null, data: null });

// Function to fetch user data
async function fetchUserData(token: string) {
	const response = await fetch('http://localhost:8080/api/secured/user', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		}
	});

	const data = await response.json();
	auth.update((u) => ({ ...u, data }));
}

// Function to initialize or update the user state
function updateUserState() {
	if (browser) {
		const token = localStorage.getItem('token');

		if (token) {
			auth.set({ token, data: null });
			void fetchUserData(token); // Fetch user data if token exists
		} else {
			auth.set({ token: null, data: null }); // Clear user state if no token
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
		localStorage.setItem('token', token);
		updateUserState(); // Update user state immediately
	}
}

// Function to clear the token (e.g., after logout)
export function clearToken() {
	if (browser) {
		localStorage.removeItem('token');
		updateUserState(); // Update user state immediately
	}
}
