import type { PageLoad } from './$types';
import type { Friendship } from '../../../types/friendship';

export const load: PageLoad = async () => {
	try {
		const friendships = await fetch(`http://localhost:8080/api/secured/user/friends`, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`
			}
		}).then((res) => res.json());

		return {
			data: {
				friendships: friendships as Friendship[]
			}
		};
	} catch (error) {
		return {
			status: 404,
			error: new Error('Failed to load')
		};
	}
};
