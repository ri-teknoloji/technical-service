import Chart, { Props } from "react-apexcharts";
import useSWR from "swr";

import { ServiceRecord, User } from "@/types";

const Dashboard = () => {
  return (
    <div className="grid gap-5">
      <h1 className="text-3xl font-bold" style={{ color: "#2c3e50" }}>
        Dashboard
      </h1>
      <div className="grid grid-cols-1 place-items-center gap-5 md:grid-cols-2">
        <ServiceStatusStats />
        <TechnicianStats />
      </div>
    </div>
  );
};

export default Dashboard;

const ServiceStatusStats = () => {
  const { data: records } = useSWR<ServiceRecord[]>("/records");

  const getStatusCount = (status: ServiceRecord["status"]) => {
    if (!records) return 0;
    return records.filter((record) => record.status === status).length;
  };

  const chartProps: Props = {
    options: {
      labels: [
        "Bekleyen",
        "Tamamlanan",
        "Parça Bekliyor",
        "İşlemde",
        "Kargoya Verildi",
        "Teslim Edildi",
        "İptal Edildi",
      ],
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
            },
          },
        },
      },
    },
    series: [
      getStatusCount("pending"),
      getStatusCount("completed"),
      getStatusCount("waiting_for_parts"),
      getStatusCount("in_progress"),
      getStatusCount("shipped"),
      getStatusCount("delivered"),
      getStatusCount("cancelled"),
    ],
    type: "donut",
  };

  return (
    <div className="w-96">
      <h1 className="mb-3 text-center text-2xl font-bold">Servis Durumları</h1>
      <Chart {...chartProps} />
    </div>
  );
};

const TechnicianStats = () => {
  const { data: records } = useSWR<ServiceRecord[]>("/records");
  const { data: users } = useSWR<User[]>("/users");

  const getTechnicianCount = (technicianId: string) => {
    if (!records) return 0;
    return records.filter((record) => record.technicianId === technicianId)
      .length;
  };

  if (!users) return null;

  const technicians = users.filter((user) => user.roles.includes("technician"));

  const chartProps: Props = {
    options: {
      labels: technicians.map((technician) => technician.displayName) || [],
    },
    series: [
      {
        data: technicians.map((technician) =>
          getTechnicianCount(technician.id),
        ),
      },
    ],
    type: "bar",
  };

  return (
    <div className="w-96">
      <h1 className="mb-3 text-center text-2xl font-bold">
        Teknisyen İstatistikleri
      </h1>
      <Chart {...chartProps} />
    </div>
  );
};
