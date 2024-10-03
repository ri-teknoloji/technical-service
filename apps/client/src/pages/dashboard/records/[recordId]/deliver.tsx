import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
} from "@nextui-org/react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import useSWR from "swr";

import http from "@/lib/http";
import { ServiceRecord } from "@/types";
import { sleep } from "@/utils";

const Deliver = () => {
  const navigate = useNavigate();
  const { recordId } = useParams<{ recordId: string }>();

  const { data: record } = useSWR<ServiceRecord>(`/records/${recordId}`);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = new FormData(e.currentTarget);
    const data = Object.fromEntries(form.entries());

    try {
      await http.post(`/records/${recordId}/verify`, data);
      toast.success("Ürün başarıyla teslim edildi.");

      // create new event for record
      await http.post(`/records/${recordId}/events`, {
        description: `Ürün teslim edildi. Teslim alan kişi: ${form.get("receiver")}`,
        title: "Ürün Teslim edildi",
      });

      toast.success("Etkinlik başarıyla oluşturuldu.");

      await sleep(3000);
      navigate("/dashboard/records");
    } catch (error) {
      http.handleError(error);
    }
  };

  const handleResend = async () => {
    try {
      await http.get(`/records/${recordId}/delivery-code`);
      toast.success("Teslimat kodu başarıyla tekrar gönderildi.");
    } catch (error) {
      http.handleError(error);
    }
  };

  if (!record) return "Yükleniyor...";

  return (
    <Card>
      <CardHeader>
        <h4 className="text-xl font-bold">Ürünü teslim et</h4>
      </CardHeader>
      <CardBody>
        <h6>
          <strong>Ürün:</strong> {record.productName}
        </h6>
        <br />
        {record.status === "delivered" ? (
          <p className="text-red-500">Bu ürün daha önce teslim edilmiş.</p>
        ) : (
          <form className="grid gap-3" onSubmit={handleSubmit}>
            <Input label="Ürünü teslim alan kişi" name="receiver" />
            <Input label="Teslimat Kodu" name="code" />
            <Button color="primary" type="submit">
              Teslimatı Onayla
            </Button>
          </form>
        )}
      </CardBody>
      <CardFooter>
        <Button
          color="primary"
          isDisabled={record.status === "delivered"}
          onClick={handleResend}
          variant="light"
        >
          <strong>Teslimat kodunu tekrar gönder</strong>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Deliver;
