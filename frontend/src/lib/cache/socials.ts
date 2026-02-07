import { type Writable, writable } from 'svelte/store';
import type { Friendship } from '../../types/friendship';
import type { FriendRequest } from '../../types/friendRequest';
import type { User } from '../../types/user';

interface SocialCache {
	friendships: Friendship[] | null;
	friendRequests: FriendRequest[] | null;
	suggestedFriends: User[] | null;
	lastFetched: number;
}

const initialSocialCache: SocialCache = {
	friendships: null,
	friendRequests: null,
	suggestedFriends: null,
	lastFetched: 0
};

// Cache data for friends page
const { subscribe, set, update }: Writable<SocialCache> = writable(initialSocialCache);

// 3. Export a custom object that includes the default methods + your new ones
export const socialCache = {
	subscribe,
	set,
	update,
	clear: () => {
		console.log('Cleaning social cache...');
		set(initialSocialCache);
	}
};
