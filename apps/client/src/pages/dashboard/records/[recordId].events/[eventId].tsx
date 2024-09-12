import { Loading } from "@/components/Loading";
import { useHttp } from "@/hooks/useHttp";
import { http, httpError } from "@/lib/http";
import { Event } from "@/types";
import { sleep } from "@/utils";
import { Button, Card, Input } from "@nextui-org/react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const CreateOrViewEvent = () => {
  const navigate = useNavigate();
  const { recordId, eventId } = useParams<{
    recordId: string;
    eventId: string;
  }>();

  const isNew = eventId === "new";
  const { data: event, isLoading } = useHttp<Event>(
    isNew ? "" : `/records/${recordId}/events/${eventId}`,
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: any = Object.fromEntries(formData.entries());

    try {
      isNew
        ? await http.post(`/records/${recordId}/events`, data)
        : await http.put(`/records/${recordId}/events/${eventId}`, data);

      toast.success(
        isNew
          ? "Etkinlik başarıyla oluşturuldu!"
          : "Etkinlik başarıyla güncellendi!",
      );

      await sleep(3000);
      navigate(`/dashboard/records/${recordId}/events`);
    } catch (error) {
      httpError(error);
    }
  };

  if (isLoading) return <Loading />;

  return (
    <Card className="p-3">
      <h1 className="mb-3 text-2xl font-semibold">
        {isNew ? "Yeni Etkinlik" : "Etkinliği Görüntüle"}
      </h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-3">
        <Input
          label="Etkinlik Adı"
          name="title"
          type="text"
          className="col-span-12 md:col-span-6"
          defaultValue={event?.title}
          isRequired
        />
        <Input
          label="Açıklama"
          name="description"
          type="text"
          className="col-span-12 md:col-span-6"
          defaultValue={event?.description}
          isRequired
        />

        <div className="col-span-12">
          <Button type="submit" color="primary">
            {isNew ? "Oluştur" : "Güncelle"}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default CreateOrViewEvent;
