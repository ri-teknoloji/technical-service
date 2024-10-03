import { Button, Divider, Input } from "@nextui-org/react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { CenteredCard } from "@/components/CenteredCard";
import http from "@/lib/http";
import { sleep } from "@/utils";

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
      http.handleError(error);
    }
  };

  return (
    <CenteredCard>
      <form className="grid gap-3" onSubmit={handleSubmit}>
        <Input isRequired label="SMS Kodu" name="token" type="text" />

        <Input isRequired label="Yeni Şifre" name="password" type="password" />

        <Input
          isRequired
          label="Yeni Şifre Tekrar"
          name="passwordConfirmation"
          type="password"
        />

        <Button color="primary" type="submit">
          Şifremi Sıfırla
        </Button>
      </form>
      <Divider className="my-5" />
      <div className="grid gap-3">
        <Button as={Link} color="secondary" to={"/login"} variant="light">
          <strong>Giriş Yap</strong>
        </Button>
        <Button
          as={Link}
          color="secondary"
          to={"/forget-password"}
          variant="light"
        >
          <strong>SMS Kodum yok</strong>
        </Button>
      </div>
    </CenteredCard>
  );
};

export default ResetPassword;
