import {
  Card,
  CardBody,
  CardHeader,
  cn,
  getKeyValue,
  Input,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { CheckIcon } from "lucide-react";
import { Key } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import useSWR from "swr";

import { Event, ServiceRecord } from "@/types";
import { getFileUrl, translateRecordStatus } from "@/utils";

const Title = ({ title }: { title: string }) => {
  return (
    <CardHeader className="justify-center">
      <h1 className="text-2xl font-bold">{title}</h1>
    </CardHeader>
  );
};

const ViewRecord = () => {
  const { recordId } = useParams<{ recordId: string }>();
  const { data: record } = useSWR<ServiceRecord>(`/records/${recordId}`);

  if (!record) return "Yükleniyor...";

  return (
    <>
      <Navbar />
      <main className="container my-10 min-h-screen">
        <div className="grid gap-3">
          <Stepper status={record.status} />
          <DisplayDetails record={record} />
          <div className="hidden">
            <EventsTable />
            <ImagesShowcase images={record.images} />
          </div>
        </div>
      </main>
    </>
  );
};

interface DisplayDetailsProps {
  record: ServiceRecord;
}
const DisplayDetails = ({ record }: DisplayDetailsProps) => {
  return (
    <Card>
      <Title title="Detaylar" />
      <CardBody className="grid grid-cols-12 gap-3">
        <Input
          className="col-span-12 md:col-span-6"
          label="Ürün Adı"
          value={record.productName}
        />
        <Input
          className="col-span-12 md:col-span-6"
          label="Servis Durumu"
          value={translateRecordStatus(record.status)}
        />
        <Input
          className="col-span-12 md:col-span-6"
          label="Kayıt Tarihi"
          value={new Date(record.createdAt).toLocaleString()}
        />
        <Input
          className="col-span-12 md:col-span-6"
          label="Güncellenme Tarihi"
          value={new Date(record.updatedAt).toLocaleString()}
        />
      </CardBody>
    </Card>
  );
};

interface ImagesShowcaseProps {
  images: string[];
}

const ImagesShowcase = ({ images }: ImagesShowcaseProps) => {
  return (
    <Card>
      <Title title="Görseller" />
      <CardBody>
        <div className="grid grid-cols-12 gap-3">
          {images.map((image, index) => (
            <div
              className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3"
              key={index}
            >
              <img
                alt=""
                className="h-40 w-full rounded-md object-fill"
                onClick={() => window.open(getFileUrl(image), "_blank")}
                src={getFileUrl(image)}
              />
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};

const EventsTable = () => {
  const { recordId } = useParams<{ recordId: string }>();
  const { data: events } = useSWR<Event[]>(`/records/${recordId}/events`);

  if (!events) return "Yükleniyor...";

  const columns = [
    {
      key: "title",
      label: "Başlık",
    },
    {
      key: "description",
      label: "Açıklama",
    },
    {
      key: "createdAt",
      label: "Tarih",
    },
  ];

  const handleRowAction = (key: Key) => {
    const event = events.find((event) => event.id === key);
    if (!event) return;
    toast.info(event.title, {
      description: event.description,
    });
  };

  const rows = events.map((event) => ({
    ...event,
    createdAt: new Date(event.createdAt).toLocaleString(),
    description:
      event.description.length > 50
        ? `${event.description.slice(0, 50)}...`
        : event.description,
    key: event.id,
  }));

  const lastEvent = events[events.length - 1];

  return (
    <Card>
      <Title title="Olaylar" />
      <CardBody>
        {lastEvent && (
          <p className="mx-auto max-w-xl text-center">
            {lastEvent.description}
          </p>
        )}
      </CardBody>
      <Table
        aria-label="Example table with dynamic content"
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
    </Card>
  );
};

interface StepperProps {
  status: string;
}

const Stepper = ({ status }: StepperProps) => {
  const steps = [
    {
      key: "pending",
      title: "Beklemede",
    },
    {
      key: "in_progress",
      title: "Devam Ediyor",
    },
    {
      key: "shipped",
      title: "Kargoya Verildi",
    },
    {
      key: "completed",
      title: "Tamamlandı",
    },
  ];

  const currentStep = steps.findIndex((step) => step.key === status);

  return (
    <Card>
      <Title title="Servis Durumu" />
      <CardBody>
        <div className="grid grid-cols-12 place-items-center gap-5">
          {steps.map((step, index) => (
            <div
              className={
                (cn(
                  `flex items-center gap-3 ${
                    index <= currentStep ? "text-primary" : "text-gray-300"
                  }`,
                ),
                "col-span-12 md:col-span-3")
              }
              key={step.key}
            >
              <div
                className={`mx-auto flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                  index <= currentStep
                    ? "border-primary bg-primary"
                    : "border-gray-300"
                }`}
              >
                {index <= currentStep ? (
                  <CheckIcon className="text-white" size={20} />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <p className="mt-2">{step.title}</p>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};

export default ViewRecord;

const Navbar = () => {
  return (
    <Card radius="none">
      <CardBody className="container">
        <div className="flex items-center justify-between gap-3">
          <div className="flex cursor-pointer items-center gap-3">
            <img
              alt=""
              className="h-10 w-10 rounded-full object-cover"
              src="/logo.png"
            />
            <h1 className="text-2xl font-bold">YAYPEL</h1>
          </div>
          <div className="flex gap-3">
            <h4 className="cursor-pointer text-lg font-semibold">
              <span className="hidden md:block">Servis Takip Sistemi</span>
              <span className="block md:hidden">STS</span>
            </h4>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
