import {
  Button,
  Card,
  getKeyValue,
  Input,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { PlusIcon, SearchIcon } from "lucide-react";
import { Key, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useSWR from "swr";

import { Loading } from "@/components/Loading";
import { User } from "@/types";

const Users = () => {
  const navigate = useNavigate();

  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const { data: users } = useSWR<User[]>("/users");

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
      displayName: user.displayName,
      email: user.email,
      key: user.id,
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
        user.email?.toLowerCase().includes(value.toLowerCase()) ||
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
              onChange={handleSearch}
              placeholder="Ara..."
              startContent={<SearchIcon size={20} />}
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
        bottomContent={
          <p className="text-center font-normal">
            Filtrelenmiş
            <span className="mx-1 text-primary-500">
              {filteredUsers.length}
            </span>
            adet sonuç gösteriliyor
          </p>
        }
        className="overflow-auto"
        isStriped
        onRowAction={handleRowAction}
        selectionMode="single"
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
      color="primary"
      startContent={<PlusIcon />}
      to={"/dashboard/users/new"}
    >
      <strong className="mt-1">Yeni Kullanıcı Ekle</strong>
    </Button>
  );
};
