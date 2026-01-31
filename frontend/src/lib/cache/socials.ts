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

// Cache data for friends page
export const socialCache: Writable<SocialCache> = writable({
	friendships: null,
	friendRequests: null,
	suggestedFriends: null,
	lastFetched: 0
});
