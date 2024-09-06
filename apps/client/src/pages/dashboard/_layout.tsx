import { ThemeToggler } from "@/components";
import { sidebarItems } from "@/data";
import { useHttp } from "@/hooks/useHttp";
import { User } from "@/types";
import {
  Button,
  Card,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { MenuIcon, UserIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    document.body.classList.add("overflow-hidden");

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  useEffect(() => {
    const isSidebarOpen = JSON.parse(
      localStorage.getItem("isSidebarOpen") || "false",
    );
    setIsSidebarOpen(isSidebarOpen);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    localStorage.setItem("isSidebarOpen", JSON.stringify(!isSidebarOpen));
  };

  return (
    <div className="grid grid-cols-12 overflow-hidden">
      {isSidebarOpen && (
        <div className="col-span-12 md:col-span-3">
          <Card className="h-screen p-3" radius="none">
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
        </div>
      )}
      <div
        className={`col-span-12  ${isSidebarOpen ? "md:col-span-9" : "md:col-span-12"}`}
      >
        <Card className="p-3" radius="none">
          <div className="flex justify-between gap-3">
            <SidebarToggler toggleSidebar={toggleSidebar} />
            <div className="flex items-center gap-3">
              <ThemeToggler />
              <UserDisplay />
            </div>
          </div>
        </Card>
        <div className="container overflow-auto p-3">
          <Outlet />
        </div>
      </div>
    </div>
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
  const { data: me } = useHttp<User>("/auth/me", {
    onError: () => null,
  });

  const logout = () => {
    localStorage.removeItem("token");
    location.reload();
  };

  if (!me)
    return (
      <Button
        as={Link}
        to={"/login"}
        startContent={<UserIcon />}
        color="primary"
      >
        <strong className="mt-1">Giriş Yap</strong>
      </Button>
    );

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

export default Layout;
