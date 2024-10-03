import { Archive, HelpCircleIcon, Home, Settings, Users } from "lucide-react";

export const sidebarItems = [
  {
    canCreate: false,
    href: "/dashboard",
    icon: Home,
    label: "Yönetim Paneli",
  },
  {
    canCreate: true,
    href: "/dashboard/users",
    icon: Users,
    label: "Kullanıcılar",
  },
  {
    canCreate: true,
    href: "/dashboard/records",
    icon: Archive,
    label: "Servis Kayıtları",
  },
  {
    canCreate: false,
    href: "/dashboard/settings",
    icon: Settings,
    label: "Ayarlar",
  },
  {
    canCreate: false,
    href: "/dashboard/help",
    icon: HelpCircleIcon,
    label: "Yardım",
  },
];
