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
import { Link, useNavigate, useParams } from "react-router-dom";
import useSWR from "swr";

import { Loading } from "@/components/Loading";
import { Event } from "@/types";

const RecordEvents = () => {
  const navigate = useNavigate();
  const { recordId } = useParams<{ recordId: string }>();
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const { data: events } = useSWR<Event[]>(`/records/${recordId}/events`);

  useEffect(() => {
    if (!events) return;
    setFilteredEvents(events);
  }, [events]);

  if (!events) return <Loading />;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    const filtered = events.filter((event) =>
      event.title.toLowerCase().includes(query),
    );
    setFilteredEvents(filtered);
  };

  const columns = [
    {
      key: "title",
      label: "Etkinlik Adı",
    },
    {
      key: "description",
      label: "Açıklama",
    },
    {
      key: "date",
      label: "Tarih",
    },
  ];

  const rows = filteredEvents.map((event) => {
    return {
      date: new Date(event.createdAt).toLocaleString(),
      description: event.description,
      key: event.id,
      title: event.title,
    };
  });

  const handleRowAction = (key: Key) => {
    navigate(`/dashboard/records/${recordId}/events/${key}`);
  };

  return (
    <div className="grid gap-3">
      <Card className="p-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-lg font-bold">Olaylar</h1>
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
              {filteredEvents.length}
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

export default RecordEvents;

const AddItem = () => {
  const { recordId } = useParams<{ recordId: string }>();
  return (
    <Button
      as={Link}
      color="primary"
      startContent={<PlusIcon />}
      to={`/dashboard/records/${recordId}/events/new`}
    >
      <strong className="mt-1">Yeni Olay Ekle</strong>
    </Button>
  );
};
