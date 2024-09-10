import { Loading } from "@/components/Loading";
import { useHttp } from "@/hooks/useHttp";
import { ServiceRecord, User } from "@/types";
import {
  Card,
  Input,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
  Button,
} from "@nextui-org/react";
import { PlusIcon, SearchIcon } from "lucide-react";
import { Key, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Records = () => {
  const navigate = useNavigate();

  const [filteredRecords, setFilteredRecords] = useState<ServiceRecord[]>([]);
  const { data: records } = useHttp<ServiceRecord[]>("/records");
  const { data: users } = useHttp<User[]>("/users");

  useEffect(() => {
    if (!records) return;
    setFilteredRecords(records);
  }, [records]);

  if (!records || !users) return <Loading />;

  const switchStatus = (status: ServiceRecord["status"]) => {
    switch (status) {
      case "pending":
        return "Beklemede";
      case "completed":
        return "Tamamlandı";
      case "in_progress":
        return "Devam Ediyor";
      case "shipped":
        return "Kargolandı";
      default:
        return "Bilinmiyor";
    }
  };

  const columns = [
    {
      key: "user",
      label: "Kullanıcı",
    },
    {
      key: "productName",
      label: "Ürün",
    },
    {
      key: "status",
      label: "Durum",
    },
    {
      key: "startDate",
      label: "Başlangıç Tarihi",
    },
    {
      key: "updatedAt",
      label: "Güncellenme Tarihi",
    },
  ];

  const rows = filteredRecords.map((record) => {
    const user = users.find((user) => user.id === record.userId);
    return {
      key: record.id,
      user: user ? user.displayName : "Bilinmiyor",
      productName: record.productName,
      status: switchStatus(record.status),
      startDate: new Date(record.createdAt).toLocaleString("tr-TR"),
      updatedAt: new Date(record.updatedAt).toLocaleString("tr-TR"),
    };
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const filtered = records.filter((record) => {
      const user = users.find((user) => user.id === record.userId);
      return (
        user?.displayName.toLowerCase().includes(value.toLowerCase()) ||
        user?.email.toLowerCase().includes(value.toLowerCase()) ||
        user?.phoneNumber.toLowerCase().includes(value.toLowerCase()) ||
        record.productName.toLowerCase().includes(value.toLowerCase()) ||
        switchStatus(record.status).toLowerCase().includes(value.toLowerCase())
      );
    });

    setFilteredRecords(filtered);
  };

  const handleRowAction = (key: Key) => {
    navigate(`/dashboard/records/${key.toString()}`);
  };

  return (
    <div className="grid gap-5">
      <Card className="p-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-lg font-bold">Servis Kayıtları </h1>
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
              {filteredRecords.length}
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

export default Records;

const AddItem = () => {
  return (
    <Button
      as={Link}
      to={"/dashboard/records/new"}
      color="primary"
      startContent={<PlusIcon />}
    >
      <strong className="mt-1">Yeni Kayıt Ekle</strong>
    </Button>
  );
};
