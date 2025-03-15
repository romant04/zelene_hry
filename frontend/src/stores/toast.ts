import { writable } from 'svelte/store';
import type { Toast, ToastType } from '../types/toast';

export const toast = writable<Toast[]>([]);

let id = 1;

export function addToast(message: string, type: ToastType, duration = 3000) {
	const newToast = {
		id: id.toString(),
		message,
		type,
		duration
	};

	toast.update((t) => [...t, newToast]);

	setTimeout(() => {
		removeToast(newToast.id);
	}, duration);

	id++;
}

export function removeToast(id: string) {
	toast.update((t) => t.filter((item) => item.id !== id));
}
