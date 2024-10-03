import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Input,
  Select,
  SelectItem,
  SharedSelection,
} from "@nextui-org/react";
import { Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import useSWR from "swr";

import { Loading } from "@/components/Loading";
import http from "@/lib/http";
import { User } from "@/types";
import { sleep } from "@/utils";

const CreateOrViewUser = () => {
  const navigate = useNavigate();

  const [userRoles, setUserRoles] = useState<string[]>([]);

  const { userId } = useParams<{ userId: string }>();
  const isNew = userId === "new";
  const { data: user, isLoading } = useSWR<User>(
    isNew ? "" : `/users/${userId}`,
  );

  useEffect(() => {
    if (!user) return;
    setUserRoles(user.roles);
  }, [user]);

  if (isLoading) return <Loading />;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: Record<string, unknown> = Object.fromEntries(
      formData.entries(),
    );

    console.log(data);

    data.roles = userRoles;
    if (data.email === "") delete data.email;

    try {
      if (isNew) await http.post("/users", data);
      else await http.put(`/users/${userId}`, data);

      toast.success(
        isNew
          ? "Kullanıcı başarıyla oluşturuldu!"
          : "Kullanıcı başarıyla güncellendi!",
      );

      await sleep(3000);
      navigate("/dashboard/users");
    } catch (error) {
      http.handleError(error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Kullanıcıyı silmek istediğinize emin misiniz?"))
      return;

    try {
      await http.delete(`/users/${userId}`);
      toast.success("Kullanıcı başarıyla silindi!");

      await sleep(3000);
      navigate("/dashboard/users");
    } catch (error) {
      http.handleError(error);
    }
  };

  const handleRoleSelection = (keys: SharedSelection) => {
    const arr = Array.from(keys).map((key) => key.toString());
    setUserRoles(arr);
  };

  return (
    <div>
      <Card>
        <CardBody>
          <h1 className="mb-3 bg-red-400 text-xl font-bold">
            {isNew ? "Kullanıcı Oluştur" : "Kullanıcıyı Görüntüle"}
          </h1>
          <form className="grid grid-cols-12 gap-3" onSubmit={handleSubmit}>
            <Input
              className="col-span-12 md:col-span-6"
              defaultValue={user?.displayName}
              isRequired
              label="Ad Soyad"
              name="displayName"
              type="text"
            />

            <Input
              className="col-span-12 md:col-span-6"
              defaultValue={user?.email || ""}
              label="E-Mail"
              name="email"
              type="email"
            />

            <Input
              className="col-span-12 md:col-span-6"
              defaultValue={user?.phoneNumber}
              isRequired
              label="Telefon Numarası"
              name="phoneNumber"
              type="text"
            />

            {!isNew && (
              <Select
                className="col-span-12 md:col-span-6"
                isRequired
                label="Roller"
                name="roles"
                onSelectionChange={handleRoleSelection}
                selectedKeys={userRoles}
                selectionMode="multiple"
              >
                <SelectItem key={"admin"} value="admin">
                  Admin
                </SelectItem>
                <SelectItem key={"technician"} value="technician">
                  Teknisyen
                </SelectItem>
                <SelectItem key={"user"} value="user">
                  Kullanıcı
                </SelectItem>
              </Select>
            )}

            {!isNew && (
              <Input
                className="col-span-12 md:col-span-6"
                label="Şifre"
                name="password"
                type="password"
              />
            )}

            <div className="col-span-12">
              <Button color="primary" type="submit">
                <strong>
                  {isNew ? "Kullanıcı Oluştur" : "Kullanıcıyı Güncelle"}
                </strong>
              </Button>
            </div>
          </form>
        </CardBody>
        <CardFooter className="justify-end">
          {!isNew && (
            <Button
              color="danger"
              onClick={handleDelete}
              startContent={<Trash2Icon />}
              variant="light"
            >
              <strong className="mt-1">Sil</strong>
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default CreateOrViewUser;
