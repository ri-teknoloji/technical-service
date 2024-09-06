import { Loading } from "@/components/Loading";
import { useHttp } from "@/hooks/useHttp";
import { http, httpError } from "@/lib/http";
import { ServiceRecord, User } from "@/types";
import { sleep } from "@/utils";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Card,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const CreateOrViewRecord = () => {
  const navigate = useNavigate();
  const { recordId } = useParams<{ recordId: string }>();
  const isNew = recordId === "new";
  const { data: record, isLoading } = useHttp<ServiceRecord>(
    isNew ? "" : `/records/${recordId}`,
  );
  const { data: users } = useHttp<User[]>("/users");

  if (isLoading || !users) return <Loading />;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: any = Object.fromEntries(formData.entries());

    data.userId = users.find((user) => user.email === data.userId)?.id;

    try {
      isNew
        ? await http.post("/records", data)
        : await http.put(`/records/${recordId}`, data);

      toast.success(
        isNew
          ? "Servis kaydı başarıyla oluşturuldu!"
          : "Servis kaydı başarıyla güncellendi!",
      );

      await sleep(3000);
      navigate("/dashboard/records");
    } catch (error) {
      httpError(error);
    }
  };

  return (
    <div>
      <Card className="p-3">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold">
            {isNew ? "Yeni Servis Kaydı" : "Servis Kaydını Görüntüle"}
          </h1>

          {!isNew && (
            <div>
              <Button
                as={Link}
                to={`/dashboard/records/${recordId}/events`}
                color="primary"
                variant="light"
              >
                <strong>Etkinlikleri Görüntüle</strong>
              </Button>
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-3">
          <Autocomplete
            label="Kullanıcı"
            name="userId"
            type="text"
            className="col-span-12 md:col-span-6"
            isRequired
            defaultSelectedKey={record?.userId}
            listboxProps={{
              emptyContent: (
                <div className="grid gap-2 text-center">
                  <p className="text-lg font-bold">
                    Hiçbir kullanıcı bulunamadı. Yeni bir kullanıcı oluşturun.
                  </p>
                  <Button
                    as={Link}
                    to="/dashboard/users/new"
                    color="primary"
                    fullWidth
                    size="sm"
                  >
                    <strong>Yeni Kullanıcı Oluştur</strong>
                  </Button>
                </div>
              ),
            }}
          >
            {users.map((user) => (
              <AutocompleteItem
                key={user.id}
                value={user.id}
                textValue={user.email}
              >
                {user.displayName} ({user.email}) {user.phoneNumber}
              </AutocompleteItem>
            ))}
          </Autocomplete>

          <Input
            label="Ürün Adı"
            name="productName"
            type="text"
            isRequired
            defaultValue={record?.productName}
            className="col-span-12 md:col-span-6"
          />

          <Select
            label="Durum"
            name="status"
            className="col-span-12 md:col-span-6"
            defaultSelectedKeys={[record?.status || "pending"]}
            isRequired
          >
            <SelectItem key={"pending"}>Beklemede</SelectItem>
            <SelectItem key={"in_progress"}>İşlemde</SelectItem>
            <SelectItem key={"shipped"}>Kargoya Verildi</SelectItem>
            <SelectItem key={"completed"}>Tamamlandı</SelectItem>
          </Select>

          <div className="col-span-12">
            <Button type="submit" color="primary">
              {isNew ? "Oluştur" : "Güncelle"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CreateOrViewRecord;
