import { User } from "./user";

export interface Notification {
  notificationId: string;
  type: string;
  message: string;
  redirectUrl: string;
  user: User;
  isRead: boolean;
  createdAt: Date;
}

export interface NotificationInput {
  type: string;
  message: string;
  redirectUrl: string;
  userId: number;
  mmrSecret: string;
}
