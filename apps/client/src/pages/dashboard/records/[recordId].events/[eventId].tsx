import { Button, Card, Input } from "@nextui-org/react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import useSWR from "swr";

import { Loading } from "@/components/Loading";
import http from "@/lib/http";
import { Event } from "@/types";
import { sleep } from "@/utils";

const CreateOrViewEvent = () => {
  const navigate = useNavigate();
  const { eventId, recordId } = useParams<{
    eventId: string;
    recordId: string;
  }>();

  const isNew = eventId === "new";
  const { data: event, isLoading } = useSWR<Event>(
    isNew ? "" : `/records/${recordId}/events/${eventId}`,
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: Record<string, unknown> = Object.fromEntries(
      formData.entries(),
    );

    try {
      if (isNew) await http.post(`/records/${recordId}/events`, data);
      else await http.put(`/records/${recordId}/events/${eventId}`, data);

      toast.success(
        isNew
          ? "Etkinlik başarıyla oluşturuldu!"
          : "Etkinlik başarıyla güncellendi!",
      );

      await sleep(3000);
      navigate(`/dashboard/records/${recordId}/events`);
    } catch (error) {
      http.handleError(error);
    }
  };

  if (isLoading) return <Loading />;

  return (
    <Card className="p-3">
      <h1 className="mb-3 text-2xl font-semibold">
        {isNew ? "Yeni Etkinlik" : "Etkinliği Görüntüle"}
      </h1>
      <form className="grid grid-cols-12 gap-3" onSubmit={handleSubmit}>
        <Input
          className="col-span-12 md:col-span-6"
          defaultValue={event?.title}
          isRequired
          label="Etkinlik Adı"
          name="title"
          type="text"
        />
        <Input
          className="col-span-12 md:col-span-6"
          defaultValue={event?.description}
          isRequired
          label="Açıklama"
          name="description"
          type="text"
        />

        <div className="col-span-12">
          <Button color="primary" type="submit">
            {isNew ? "Oluştur" : "Güncelle"}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default CreateOrViewEvent;
