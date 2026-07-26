import { writable } from 'svelte/store';

export const endTime = writable<number | null>(null);
