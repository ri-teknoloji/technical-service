import { ThemeToggler } from "@/components";
import { sidebarItems } from "@/data";
import { useHttp } from "@/hooks/useHttp";
import { useViewport } from "@/hooks/useViewport";
import { User } from "@/types";
import {
  Button,
  Card,
  cn,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { MenuIcon, UserIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const path = useLocation();
  const { isMobile } = useViewport();

  useEffect(() => {
    const className = ["overflow-x-hidden"];
    document.body.classList.add(...className);

    return () => {
      document.body.classList.remove(...className);
    };
  }, []);

  useEffect(() => {
    const isSidebarOpen = JSON.parse(
      localStorage.getItem("isSidebarOpen") || "false",
    );

    if (isMobile) return setIsSidebarOpen(false);
    setIsSidebarOpen(isSidebarOpen);
  }, [isMobile, path]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    localStorage.setItem("isSidebarOpen", JSON.stringify(!isSidebarOpen));
  };

  const sidebarClassName = isSidebarOpen
    ? "col-span-12 md:col-span-3"
    : "hidden";

  const mainClassName = isSidebarOpen
    ? "col-span-12 md:col-span-9"
    : "col-span-12 md:col-span-12";

  return (
    <div className="grid grid-cols-12">
      {/* Sidebar */}
      <div className={sidebarClassName}>
        <Sidebar toggleSidebar={toggleSidebar} />
      </div>

      <div className={cn(mainClassName, "flex h-screen flex-col")}>
        {/* Navbar */}
        <Navbar toggleSidebar={toggleSidebar} />

        {/* Main Content */}
        <main className="container my-5 flex-1 overflow-auto p-3">
          <Outlet />
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default Layout;

interface SidebarProps {
  toggleSidebar: () => void;
}

const Sidebar = ({ toggleSidebar }: SidebarProps) => {
  return (
    <Card className="h-full min-h-screen p-3" radius="none">
      <div className="flex h-10 justify-between">
        <div className="flex w-full items-center">
          <h1 className="text-xl font-bold">Dashboard</h1>
        </div>
        <div className="block md:hidden">
          <SidebarToggler toggleSidebar={toggleSidebar} />
        </div>
      </div>
      <Divider className="my-3" />
      <div className="grid gap-1">
        {sidebarItems.map((item, index) => (
          <Button
            key={index}
            as={Link}
            to={item.href}
            startContent={<item.icon size={20} />}
            className="justify-start"
            variant="light"
            radius="none"
          >
            <div className="mt-1">
              <strong>{item.label}</strong>
            </div>
          </Button>
        ))}
      </div>
    </Card>
  );
};

interface NavbarProps {
  toggleSidebar: () => void;
}
const Navbar = ({ toggleSidebar }: NavbarProps) => {
  return (
    <Card className="p-3" radius="none">
      <div className="flex justify-between gap-3">
        <SidebarToggler toggleSidebar={toggleSidebar} />
        <div className="flex items-center gap-3">
          <ThemeToggler />
          <UserDisplay />
        </div>
      </div>
    </Card>
  );
};

const Footer = () => {
  return (
    <Card className="p-3" radius="none">
      <div className="flex justify-between">
        <p>
          <strong>Yönetim Paneli</strong>
        </p>
        <p>
          <strong>Version:</strong> 1.0.0
        </p>
      </div>
    </Card>
  );
};

const SidebarToggler = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
  return (
    <Button onClick={toggleSidebar} variant="light" isIconOnly>
      <MenuIcon size={20} />
    </Button>
  );
};

const UserDisplay = () => {
  const { data: me } = useHttp<User>("/auth/me");

  const logout = () => {
    localStorage.removeItem("token");
    location.reload();
  };

  if (!me) return null;

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button startContent={<UserIcon />} variant="faded">
          <strong className="mt-1">{me.displayName}</strong>
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
        <DropdownItem onPress={logout} color="danger">
          Çıkış Yap
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
