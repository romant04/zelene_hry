import type { PageLoad } from './$types';
import type { FriendRequest } from '../../../types/friendRequest';
import type { User } from '../../../types/user';
import type { Friendship } from '../../../types/friendship';

export const load: PageLoad = async ({ params }) => {
	try {
		const [friends, friendRequests, suggestedFriends] = await Promise.all([
			fetch(`http://localhost:8080/api/secured/user/friends`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`
				}
			}).then((res) => res.json()),
			fetch(`http://localhost:8080/api/secured/user/friendRequests`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`
				}
			}).then((res) => res.json()),
			fetch(`http://localhost:8080/api/secured/users`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`
				}
			}).then((res) => res.json())
		]);

		return {
			data: {
				friendships: friends as Friendship[],
				friendRequest: friendRequests as FriendRequest[],
				suggestedFriends: suggestedFriends as User[]
			}
		};
	} catch (error) {
		return {
			status: 404,
			error: new Error('Failed to load')
		};
	}
};
