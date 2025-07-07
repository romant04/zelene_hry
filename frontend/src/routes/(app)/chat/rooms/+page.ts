import type { PageLoad } from './$types';
import type { Friendship } from '../../../../types/friendship';
import { API } from '../../../../constants/urls';
import type { Chatroom } from '../../../../types/chat';
import type { Restriction } from '../../../../types/restriction';

export const load: PageLoad = async () => {
	try {
		const friendships = await fetch(`${API}/api/secured/user/friends`, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`
			}
		}).then((res) => res.json());
		const chatRooms = await fetch(`${API}/api/secured/chats`, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`
			}
		}).then((res) => res.json());
		const restrictions = await fetch(`${API}/api/secured/chats/restrictions`, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`
			}
		}).then((res) => res.json());
		return {
			data: {
				friendships: friendships as Friendship[],
				chatRooms: chatRooms as Chatroom[],
				restrictions: restrictions as Restriction[]
			}
		};
	} catch {
		return {
			status: 404,
			error: new Error('Failed to load')
		};
	}
};
