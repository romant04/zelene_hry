import type { User } from "./user";

export interface Message {
  dmId: number;
  sender: User;
  receiver: User;
  message: string;
  createdAt: Date;
}
