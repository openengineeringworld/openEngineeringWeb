import { Bell, Sparkles, ShieldCheck, Users, Zap } from "lucide-react";
import type { NotificationItem } from "./notification-types";

export function renderIcon(icon: NotificationItem["icon"]) {
  switch (icon) {
    case "sparkles":
      return <Sparkles className="h-5 w-5 text-purple-400" />;
    case "users":
      return <Users className="h-5 w-5 text-amber-400" />;
    case "shield":
      return <ShieldCheck className="h-5 w-5 text-emerald-400" />;
    case "zap":
      return <Zap className="h-5 w-5 text-cyan-400" />;
    default:
      return <Bell className="h-5 w-5 text-purple-300" />;
  }
}
