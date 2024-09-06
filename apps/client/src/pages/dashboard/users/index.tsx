import { Loading } from "@/components/Loading";
import { useHttp } from "@/hooks/useHttp";
import { User } from "@/types";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
  Input,
  Card,
  Button,
} from "@nextui-org/react";
import { PlusIcon, SearchIcon } from "lucide-react";
import { Key, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Users = () => {
  const navigate = useNavigate();

  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const { data: users } = useHttp<User[]>("/users");

  useEffect(() => {
    if (!users) return;
    setFilteredUsers(users);
  }, [users]);

  if (!users) return <Loading />;

  const columns = [
    {
      key: "displayName",
      label: "Ad Soyad",
    },
    {
      key: "email",
      label: "E-Mail",
    },
    {
      key: "phoneNumber",
      label: "Telefon Numarası",
    },
    {
      key: "roles",
      label: "Roller",
    },
  ];

  const rows = filteredUsers.map((user) => {
    return {
      key: user.id,
      displayName: user.displayName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      roles: user.roles.join(", "),
    };
  });

  const handleRowAction = (key: Key) => {
    navigate(`/dashboard/users/${key.toString()}`);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const filtered = users.filter(
      (user) =>
        user.displayName.toLowerCase().includes(value.toLowerCase()) ||
        user.email.toLowerCase().includes(value.toLowerCase()) ||
        user.phoneNumber.toLowerCase().includes(value.toLowerCase()),
    );
    setFilteredUsers(filtered);
  };

  return (
    <div className="grid gap-5">
      <Card className="p-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-lg font-bold">Kullanıcılar</h1>
          <div>
            <Input
              placeholder="Ara..."
              startContent={<SearchIcon size={20} />}
              onChange={handleSearch}
              variant="faded"
            />
          </div>
        </div>
      </Card>
      <div className="flex justify-end">
        <AddItem />
      </div>
      <Table
        aria-label="Example table with dynamic content"
        isStriped
        selectionMode="single"
        onRowAction={handleRowAction}
        className="overflow-auto"
        bottomContent={
          <p className="text-center font-normal">
            Filtrelenmiş
            <span className="mx-1 text-primary-500">
              {filteredUsers.length}
            </span>
            adet sonuç gösteriliyor
          </p>
        }
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody items={rows}>
          {(item) => (
            <TableRow key={item.key}>
              {(columnKey) => (
                <TableCell>{getKeyValue(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default Users;

const AddItem = () => {
  return (
    <Button
      as={Link}
      to={"/dashboard/users/new"}
      color="primary"
      startContent={<PlusIcon />}
    >
      <strong className="mt-1">Yeni Kullanıcı Ekle</strong>
    </Button>
  );
};
