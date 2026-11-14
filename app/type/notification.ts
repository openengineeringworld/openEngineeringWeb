
export type NotificationCategory =
  | "all"
  | "products"
  | "announcements"
  | "system";

export type NotificationIcon =
  | "sparkles"
  | "bell"
  | "shield"
  | "users"
  | "zap";

export interface NotificationItem {
  id: string;
  title: string;
  description: string;

  category: Exclude<NotificationCategory, "all">;

  badge: string;
  badgeColor: string;
  time: string;
  read: boolean;

  action?: {
    label: string;
    href: string;
    external?: boolean;
  };

  icon: NotificationIcon;
}
