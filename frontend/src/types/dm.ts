import type { User } from './user';

export interface Dm {
	dmId: number;
	sender: User;
	receiver: User;
	message: string;
	createdAt: Date;
}
