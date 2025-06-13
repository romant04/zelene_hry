import type { User } from './user';

export interface Chatroom {
	id: number;
	name: string;
	isPublic: boolean;
	users: User[];
}