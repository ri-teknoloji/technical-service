import { Home, Users, Archive, Settings } from "lucide-react";

export const sidebarItems = [
  {
    label: "Yönetim Paneli",
    href: "/dashboard",
    icon: Home,
    canCreate: false,
  },
  {
    label: "Kullanıcılar",
    href: "/dashboard/users",
    icon: Users,
    canCreate: true,
  },
  {
    label: "Servis Kayıtları",
    href: "/dashboard/records",
    icon: Archive,
    canCreate: true,
  },
  {
    label: "Ayarlar",
    href: "/dashboard/settings",
    icon: Settings,
    canCreate: false,
  },
];
