import { Button, Input } from "@nextui-org/react";
import { toast } from "sonner";

import { CenteredCard } from "@/components/CenteredCard";
import { PasswordInput } from "@/components/PasswordInput";
import http from "@/lib/http";
import { useNavigate } from "@/router";
import { sleep } from "@/utils";

const Register = () => {
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      await http.post("/auth/register", data);
      toast.success("Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...");
      await sleep(1000);
      navigate("/login");
    } catch (error) {
      http.handleError(error);
    }
  };

  return (
    <CenteredCard>
      <form className="grid gap-3" onSubmit={handleSubmit}>
        <Input isRequired label="Ad Soyad" name="displayName" type="text" />

        <Input isRequired label="E-Mail" name="email" type="email" />

        <Input
          isRequired
          label="Telefon Numarası"
          name="phoneNumber"
          type="text"
        />

        <PasswordInput isRequired label="Şifre" name="password" />

        <Button color="primary" type="submit">
          Kayıt Ol
        </Button>
      </form>
      <br />
      <p className="text-center">
        Hesabınız var mı?{" "}
        <button className="text-primary" onClick={() => navigate("/login")}>
          Giriş yapın
        </button>
      </p>
    </CenteredCard>
  );
};

export default Register;
