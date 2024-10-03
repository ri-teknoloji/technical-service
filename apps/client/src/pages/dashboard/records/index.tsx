import { getLocalTimeZone } from "@internationalized/date";
import {
  Button,
  Card,
  DateRangePicker,
  DateValue,
  getKeyValue,
  Input,
  RangeValue,
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
import { ServiceRecord, User } from "@/types";
import { translateRecordStatus } from "@/utils";

const Records = () => {
  const navigate = useNavigate();

  const [filteredRecords, setFilteredRecords] = useState<ServiceRecord[]>([]);
  const { data: records } = useSWR<ServiceRecord[]>("/records");
  const { data: users } = useSWR<User[]>("/users");

  useEffect(() => {
    if (!records) return;
    setFilteredRecords(records);
  }, [records]);

  if (!records || !users) return <Loading />;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();

    const filtered = records.filter((record) => {
      const user = users.find((user) => user.id === record.userId);
      if (!user) return false;

      const searchFields = [
        user.displayName?.toLowerCase() || "",
        user.email?.toLowerCase() || "",
        user.phoneNumber?.toLowerCase() || "",
        record.productName?.toLowerCase() || "",
        translateRecordStatus(record.status)?.toLowerCase() || "",
      ];

      // En az bir alan eşleşiyorsa true döner
      return searchFields.some((field) => field.includes(value));
    });

    setFilteredRecords(filtered);
  };

  const handleDateRangeChange = (date: RangeValue<DateValue>) => {
    if (!date) return setFilteredRecords(records);

    const { end, start } = date;

    const filtered = records.filter((record) => {
      const recordDate = new Date(record.createdAt);
      return (
        recordDate >= start.toDate(getLocalTimeZone()) &&
        recordDate <= end.toDate(getLocalTimeZone())
      );
    });

    setFilteredRecords(filtered);
  };

  const handleRowAction = (key: Key) => {
    navigate(`/dashboard/records/${key.toString()}`);
  };

  const columns = [
    {
      key: "trackingNumber",
      label: "Takip Numarası",
    },
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
      productName: record.productName,
      startDate: new Date(record.createdAt).toLocaleString("tr-TR"),
      status: translateRecordStatus(record.status),
      trackingNumber: record.trackingNumber || "Bilinmiyor",
      updatedAt: new Date(record.updatedAt).toLocaleString("tr-TR"),
      user: user ? user.displayName : "Bilinmiyor",
    };
  });

  return (
    <div className="grid gap-5">
      <Card className="p-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-lg font-bold">Servis Kayıtları </h1>
          <div className="flex gap-1">
            <Input
              endContent={<SearchIcon size={20} />}
              label="Ara..."
              onChange={handleSearch}
              variant="faded"
            />
            <DateRangePicker
              label="Tarih Aralığı"
              onChange={handleDateRangeChange}
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
              {filteredRecords.length}
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

export default Records;

const AddItem = () => {
  return (
    <Button
      as={Link}
      color="primary"
      startContent={<PlusIcon />}
      to={"/dashboard/records/new"}
    >
      <strong className="mt-1">Yeni Kayıt Ekle</strong>
    </Button>
  );
};
