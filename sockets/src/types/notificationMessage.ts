import { User } from "./user";

export interface Notification {
  notificationId: string;
  type: string;
  message?: string | null;
  messageKey?: string | null;
  messageParams?: string | null;
  redirectUrl: string;
  user: User;
  isRead: boolean;
  createdAt: Date;
}

export interface NotificationInput {
  type: string;
  message?: string;
  messageKey?: string;
  messageParams?: string;
  redirectUrl: string;
  userId: number;
  mmrSecret: string;
}
