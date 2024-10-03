import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Input,
  Select,
  SelectItem,
  Textarea,
} from "@nextui-org/react";
import { Package2Icon, TrashIcon } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import useSWR from "swr";

import { Loading } from "@/components/Loading";
import http from "@/lib/http";
import { ServiceRecord, User } from "@/types";
import { dateToDefaultValue, sleep } from "@/utils";

import { ViewImages } from "./_components/RecordImages";
import { UserInput } from "./_components/UserSelect";

const CreateOrViewRecord = () => {
  const navigate = useNavigate();

  const { recordId } = useParams<{ recordId: string }>();
  const isNew = recordId === "new";
  const { data: record, isLoading } = useSWR<ServiceRecord>(
    isNew ? "" : `/records/${recordId}`,
  );
  const { data: users } = useSWR<User[]>("/users");

  if (isLoading || !users) return <Loading />;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: Record<string, unknown> = Object.fromEntries(
      formData.entries(),
    );

    const user = users.find((user) => user.phoneNumber === data.userId);
    if (!user) return toast.error("Kullanıcı bulunamadı!");

    const technician = users.find(
      (user) => user.phoneNumber === data.technicianId,
    );
    if (!technician) return toast.error("Teknisyen bulunamadı!");

    data.userId = user.id;
    data.technicianId = technician.id;
    data.estimatedCost = parseFloat(formData.get("estimatedCost") as string);
    data.requiredParts = (formData.get("requiredParts") as string).split("\n");
    data.estimatedDelivery = new Date(
      formData.get("estimatedDelivery") as string,
    ).toISOString();

    if (!data.warrantyEndDate) delete data.warrantyEndDate;
    if (!data.appleWarrantyEndDate) delete data.appleWarrantyEndDate;

    try {
      const { data: rec } = isNew
        ? await http.post("/records", data)
        : await http.put(`/records/${recordId}`, data);

      toast.success(
        isNew
          ? "Servis kaydı başarıyla oluşturuldu!"
          : "Servis kaydı başarıyla güncellendi!",
      );

      await sleep(1000);
      if (!isNew) return navigate("/dashboard/records");

      const imagesFormData = new FormData();
      const images = formData.getAll("images") as File[];
      images.forEach((image) => imagesFormData.append("images", image));

      const promise = () => {
        return new Promise((resolve) =>
          http.post(`/records/${rec.id}/images`, imagesFormData).then(() => {
            resolve(true);

            sleep(1000).then(() => {
              navigate("/dashboard/records");
            });
          }),
        );
      };

      toast.promise(promise, {
        error: "Resimler yükleme sırasında bir hata oluştu!",
        loading: "Resimler yükleniyor...",
        success: "Resimler başarıyla yüklendi!",
      });
    } catch (error) {
      http.handleError(error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Bu kaydı silmek istediğinize emin misiniz?")) return;

    try {
      await http.delete(`/records/${recordId}`);
      toast.success("Servis kaydı başarıyla silindi!");
      navigate("/dashboard/records");
    } catch (error) {
      http.handleError(error);
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
                  color="primary"
                  to={`/dashboard/records/${recordId}/events`}
                  variant="light"
                >
                  <strong>Etkinlikleri Görüntüle</strong>
                </Button>
              </div>
            )}
          </div>
          <form className="grid grid-cols-12 gap-3" onSubmit={handleSubmit}>
            <UserInput
              defaultValue={record?.userId}
              isRequired
              items={users}
              label="Kullanıcı"
              name="userId"
            />

            <UserInput
              defaultValue={record?.technicianId}
              isRequired
              items={users.filter((u) => u.roles.includes("technician"))}
              label="Teknisyen"
              name="technicianId"
            />

            <Input
              className="col-span-12 md:col-span-6"
              defaultValue={record?.productName}
              isRequired
              label="Ürün Adı"
              name="productName"
              type="text"
            />

            <Select
              className="col-span-12 md:col-span-6"
              defaultSelectedKeys={[record?.status || "pending"]}
              isRequired
              label="Durum"
              name="status"
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
              className="col-span-12 md:col-span-6"
              defaultValue={record?.productImeiNumber || ""}
              label="Ürün IMEI Numarası"
              name="productImeiNumber"
              type="text"
            />

            <Input
              className="col-span-12 md:col-span-6"
              defaultValue={record?.productSerialNumber || ""}
              label="Ürün Seri Numarası"
              name="productSerialNumber"
              type="text"
            />

            <Input
              className="col-span-12 md:col-span-6"
              defaultValue={record?.estimatedCost?.toString()}
              label="Tahmin Edilen Fiyat"
              name="estimatedCost"
              type="number"
            />

            <Input
              className="col-span-12 md:col-span-6"
              defaultValue={dateToDefaultValue(record?.estimatedDelivery)}
              label="Tahmini teslim tarihi"
              name="estimatedDelivery"
              type="date"
            />

            <Textarea
              className="col-span-12"
              defaultValue={record?.requiredParts.join("\n")}
              description="Her satıra bir parça ekleyin."
              label="Kullanılan Parçalar"
              name="requiredParts"
            />

            <Textarea
              className="col-span-12"
              defaultValue={record?.description}
              isRequired
              label="Açıklama"
              name="description"
            />

            <Input
              className="col-span-12 md:col-span-6"
              defaultValue={dateToDefaultValue(record?.warrantyEndDate)}
              description="Eğer ürüntü garanti dışı ise boş bırakın."
              label="Yaypel Garanti Bitiş Tarihi"
              name="warrantyEndDate"
              type="date"
            />

            <Input
              className="col-span-12 md:col-span-6"
              defaultValue={dateToDefaultValue(record?.appleWarrantyEndDate)}
              description="Eğer ürüntü garanti dışı ise boş bırakın."
              label="Apple Garanti Bitiş Tarihi"
              name="appleWarrantyEndDate"
              type="date"
            />

            {isNew && (
              <Input
                accept="image/*"
                capture="environment"
                className="col-span-12"
                label="Resimler"
                multiple
                name="images"
                type="file"
              />
            )}

            <Button className="col-span-12" color="primary" type="submit">
              {isNew ? "Oluştur" : "Güncelle"}
            </Button>
          </form>
        </CardBody>
        <CardFooter className="justify-end gap-3">
          {record && (
            <>
              <Button
                as={Link}
                color="primary"
                target="_blank"
                to={`/sr/${record.id}`}
                variant="light"
              >
                <strong>Ön izlemeyi göster</strong>
              </Button>
              <Button
                color="danger"
                onClick={handleDelete}
                startContent={<TrashIcon />}
                variant="light"
              >
                <strong className="mt-1">Sil</strong>
              </Button>
              <Button
                as={Link}
                color="primary"
                startContent={<Package2Icon />}
                to={`/dashboard/records/${record.id}/deliver`}
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
