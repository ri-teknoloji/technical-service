import { CenteredCard } from "@/components/CenteredCard";
import { PasswordInput } from "@/components/PasswordInput";
import { http, httpError } from "@/lib/http";
import { useNavigate } from "@/router";
import { sleep } from "@/utils";
import { Button, Input } from "@nextui-org/react";
import { toast } from "sonner";

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
      httpError(error);
    }
  };

  return (
    <CenteredCard>
      <form onSubmit={handleSubmit} className="grid gap-3">
        <Input label="Ad Soyad" name="displayName" type="text" isRequired />

        <Input label="E-Mail" name="email" type="email" isRequired />

        <Input
          label="Telefon Numarası"
          name="phoneNumber"
          type="text"
          isRequired
        />

        <PasswordInput label="Şifre" name="password" isRequired />

        <Button type="submit" color="primary">
          Kayıt Ol
        </Button>
      </form>
      <br />
      <p className="text-center">
        Hesabınız var mı?{" "}
        <button onClick={() => navigate("/login")} className="text-primary">
          Giriş yapın
        </button>
      </p>
    </CenteredCard>
  );
};

export default Register;
