import { Loading } from "@/components/Loading";
import { useHttp } from "@/hooks/useHttp";
import { http, httpError } from "@/lib/http";
import { ServiceRecord, User } from "@/types";
import { getFileUrl, sleep } from "@/utils";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Card,
  CardBody,
  CardFooter,
  Input,
  Progress,
  Select,
  SelectItem,
  Textarea,
} from "@nextui-org/react";
import { AxiosProgressEvent } from "axios";
import { FileIcon, Package2Icon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { mutate } from "swr";

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

    const user = users.find((user) => user.id === data.userId);
    if (!user) return toast.error("Kullanıcı bulunamadı!");

    data.userId = user.id;
    data.estimatedCost = parseFloat(data.estimatedCost);
    data.requiredParts = data.requiredParts.split("\n").filter(Boolean);
    data.estimatedDelivery = new Date(data.estimatedDelivery);

    try {
      const { data: rec } = isNew
        ? await http.post("/records", data)
        : await http.put(`/records/${recordId}`, data);

      toast.success(
        isNew
          ? "Servis kaydı başarıyla oluşturuldu!"
          : "Servis kaydı başarıyla güncellendi!",
      );

      await sleep(3000);
      navigate(`/dashboard/records/${rec.id}`);
    } catch (error) {
      httpError(error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Bu kaydı silmek istediğinize emin misiniz?")) return;

    try {
      await http.delete(`/records/${recordId}`);
      toast.success("Servis kaydı başarıyla silindi!");
      navigate("/dashboard/records");
    } catch (error) {
      httpError(error);
    }
  };

  return (
    <div>
      <Card>
        <CardBody>
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
              description={
                <p>
                  Kullanıcıyı seçmek için e-posta adresini yazın.
                  <Link
                    to="/dashboard/users/new"
                    className="mx-1 text-primary-500"
                  >
                    Yeni kullanıcı oluştur
                  </Link>
                </p>
              }
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
              <SelectItem key={"waiting_for_parts"}>
                Parça Tedarik Ediliyor
              </SelectItem>
              <SelectItem key={"in_progress"}>İşlemde</SelectItem>
              <SelectItem key={"completed"}>Tamamlandı</SelectItem>
              <SelectItem key={"shipped"}>Kargoya Verildi</SelectItem>
              <SelectItem key={"delivered"}>Teslim Edildi</SelectItem>
            </Select>

            <Input
              label="Ürün IMEI Numarası"
              name="productImeiNumber"
              type="text"
              isRequired
              defaultValue={record?.productImeiNumber}
              className="col-span-12 md:col-span-6"
            />

            <Input
              label="Ürün Seri Numarası"
              name="productSerialNumber"
              type="text"
              isRequired
              defaultValue={record?.productSerialNumber}
              className="col-span-12 md:col-span-6"
            />

            <Input
              label="Tahmin Edilen Fiyat"
              name="estimatedCost"
              type="number"
              isRequired
              defaultValue={record?.estimatedCost.toString()}
              className="col-span-12 md:col-span-6"
            />

            <Input
              label="Tahmini teslim tarihi"
              name="estimatedDelivery"
              type="date"
              isRequired
              defaultValue={
                new Date(record?.estimatedDelivery || new Date())
                  .toISOString()
                  .split("T")[0]
              }
              className="col-span-12 md:col-span-6"
            />

            <Textarea
              label="Kullanılan Parçalar"
              name="requiredParts"
              isRequired
              defaultValue={record?.requiredParts.join("\n")}
              className="col-span-12"
              description="Her satıra bir parça ekleyin."
            />

            <Textarea
              label="Açıklama"
              name="description"
              isRequired
              defaultValue={record?.description}
              className="col-span-12"
            />

            <div className="col-span-12">
              <Button type="submit" color="primary">
                {isNew ? "Oluştur" : "Güncelle"}
              </Button>
            </div>
          </form>
        </CardBody>
        <CardFooter className="justify-end gap-3">
          {record && (
            <>
              <Button
                as={Link}
                to={`/sr/${record.id}`}
                target="_blank"
                color="primary"
                variant="light"
              >
                <strong>Ön izlemeyi göster</strong>
              </Button>
              <Button
                color="danger"
                startContent={<TrashIcon />}
                onClick={handleDelete}
                variant="light"
              >
                <strong className="mt-1">Sil</strong>
              </Button>
              <Button
                as={Link}
                to={`/dashboard/records/${record.id}/deliver`}
                color="primary"
                startContent={<Package2Icon />}
                variant="light"
              >
                <strong className="mt-1">Teslimet Ekranı</strong>
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
      <br />
      {record && <ViewImages record={record} />}
    </div>
  );
};

export default CreateOrViewRecord;

interface ViewImagesProps {
  record: ServiceRecord;
}

const ViewImages = ({ record }: ViewImagesProps) => {
  const [uploadState, setUploadState] = useState<AxiosProgressEvent>();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      await http.post(`/records/${record.id}/images`, formData, {
        onUploadProgress: setUploadState,
      });
      toast.success("Resimler  başarıyla yüklendi!");
      mutate(`/records/${record.id}`);
    } catch (error) {
      httpError(error);
    }

    setUploadState(undefined);
  };

  const handleOpen = (image: string) => {
    window.open(getFileUrl(image), "_blank");
  };

  const handleDelete = async (image: string) => {
    try {
      await http.delete(`/records/${record.id}/images/${image}`);
      toast.success("Resim başarıyla silindi!");
      mutate(`/records/${record.id}`);
    } catch (error) {
      httpError(error);
    }
  };

  return (
    <Card>
      <CardBody>
        <form onSubmit={handleSubmit} className="grid gap-3">
          <Input
            label="Resim Seç"
            name="images"
            type="file"
            multiple
            isRequired
            accept="image/*"
            className="col-span-12"
            startContent={<FileIcon />}
          />
          <Button type="submit" color="primary">
            <strong>Yükle</strong>
          </Button>
          {uploadState && (
            <div className="col-span-12">
              <Progress value={uploadState.loaded} />
            </div>
          )}
        </form>
        <br />

        <div className="grid grid-cols-12 gap-3">
          {record.images.map((image) => (
            <Card
              key={image}
              className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3"
            >
              <CardBody>
                <img
                  src={getFileUrl(image)}
                  alt={record.productName}
                  className="h-full w-full object-fill"
                  onClick={() => window.open(getFileUrl(image), "_blank")}
                />
              </CardBody>
              <CardFooter className="justify-between">
                <Button
                  color="primary"
                  variant="light"
                  onClick={() => handleOpen(image)}
                >
                  <strong>Görüntüle</strong>
                </Button>
                <Button
                  color="danger"
                  variant="light"
                  onClick={() => handleDelete(image)}
                >
                  <strong>Sil</strong>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};
