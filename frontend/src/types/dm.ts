import type { PublicUser } from './user';

export interface Dm {
	dmId: number;
	sender: PublicUser;
	receiver: PublicUser;
	message: string;
	createdAt: Date;
}
