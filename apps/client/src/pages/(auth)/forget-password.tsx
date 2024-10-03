import { Button, Divider, Input } from "@nextui-org/react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { CenteredCard } from "@/components/CenteredCard";
import http from "@/lib/http";
import { sleep } from "@/utils";

const ForgetPassword = () => {
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      await http.post("/auth/forget-password", data);
      toast.success("Şifrenizi sıfırlamak için sms gönderildi!", {
        description: "Devam edebilmek için yönlendiriiliyorsunuz...",
      });
      await sleep(3000);
      navigate("/reset-password");
    } catch (error) {
      http.handleError(error);
    }
  };

  return (
    <CenteredCard>
      <form className="grid gap-3" onSubmit={handleSubmit}>
        <Input
          isRequired
          label="Mail / Kullanıcı Adı"
          name="username"
          placeholder="Mail / Kullanıcı Adı"
          type="text"
        />

        <Button color="primary" type="submit">
          Kod Gönder
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
          to={"/reset-password"}
          variant="light"
        >
          <strong>SMS Kodum var</strong>
        </Button>
      </div>
    </CenteredCard>
  );
};

export default ForgetPassword;
