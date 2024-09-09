import { useHttp } from "@/hooks/useHttp";
import { ServiceRecord } from "@/types";
import { useParams } from "react-router-dom";

const ViewRecord = () => {
  const { recordId } = useParams<{ recordId: string }>();
  const { data: record } = useHttp<ServiceRecord>(`/records/${recordId}`);

  if (!record) return "Yükleniyor...";

  return <div className="container min-h-screen"></div>;
};

export default ViewRecord;
