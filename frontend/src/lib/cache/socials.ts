import { type Writable, writable } from 'svelte/store';
import type { Friendship } from '../../types/friendship';
import type { FriendRequest } from '../../types/friendRequest';

interface SocialCache {
	currentUserId: number | null;
	friendships: Friendship[] | null;
	friendRequests: FriendRequest[] | null;
	lastFetched: number;
}

const initialSocialCache: SocialCache = {
	currentUserId: null,
	friendships: null,
	friendRequests: null,
	lastFetched: 0
};

// Cache data for friends page
const { subscribe, set, update }: Writable<SocialCache> = writable(initialSocialCache);

export const socialCache = {
	subscribe,
	set,
	update,
	clear: () => {
		console.log('Cleaning social cache...');
		set(initialSocialCache);
	}
};
