export type NotificationCategory = "all" | "products" | "announcements" | "system";

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  category: "products" | "announcements" | "system";
  badge: string;
  badgeColor: string;
  time: string;
  read: boolean;
  action?: {
    label: string;
    href: string;
    external?: boolean;
  };
  icon: "sparkles" | "bell" | "shield" | "users" | "zap";
}
