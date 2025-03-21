import type { PageLoad } from './$types';
import type { Friendship } from '../../../types/friendship';
import {API} from "../../../constants/urls";

export const load: PageLoad = async () => {
	try {
		const friendships = await fetch(`${API}/api/secured/user/friends`, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`
			}
		}).then((res) => res.json());

		return {
			data: {
				friendships: friendships as Friendship[]
			}
		};
	} catch {
		return {
			status: 404,
			error: new Error('Failed to load')
		};
	}
};
