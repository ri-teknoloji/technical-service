import { CenteredCard } from "@/components/CenteredCard";
import { http, httpError } from "@/lib/http";
import { sleep } from "@/utils";
import { Button, Divider, Input } from "@nextui-org/react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const ResetPassword = () => {
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    if (data.password !== data.passwordConfirmation) {
      return toast.error("Şifreler uyuşmuyor!");
    }

    try {
      await http.post("/auth/reset-password", data);
      toast.success("Şifreniz sıfırlandı!", {
        description: "Devam edebilmek için yönlendiriliyorsunuz...",
      });
      await sleep(3000);
      navigate("/login");
    } catch (error) {
      httpError(error);
    }
  };

  return (
    <CenteredCard>
      <form onSubmit={handleSubmit} className="grid gap-3">
        <Input label="SMS Kodu" name="token" type="text" isRequired />

        <Input label="Yeni Şifre" name="password" type="password" isRequired />

        <Input
          label="Yeni Şifre Tekrar"
          name="passwordConfirmation"
          type="password"
          isRequired
        />

        <Button type="submit" color="primary">
          Şifremi Sıfırla
        </Button>
      </form>
      <Divider className="my-5" />
      <div className="grid gap-3">
        <Button as={Link} to={"/login"} color="secondary" variant="light">
          <strong>Giriş Yap</strong>
        </Button>
        <Button
          as={Link}
          to={"/forget-password"}
          color="secondary"
          variant="light"
        >
          <strong>SMS Kodum yok</strong>
        </Button>
      </div>
    </CenteredCard>
  );
};

export default ResetPassword;
