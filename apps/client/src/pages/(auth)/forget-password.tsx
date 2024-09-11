import { CenteredCard } from "@/components/CenteredCard";
import { http, httpError } from "@/lib/http";
import { sleep } from "@/utils";
import { Button, Divider, Input } from "@nextui-org/react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

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
      httpError(error);
    }
  };

  return (
    <CenteredCard>
      <form onSubmit={handleSubmit} className="grid gap-3">
        <Input
          label="Mail / Kullanıcı Adı"
          name="username"
          type="text"
          placeholder="Mail / Kullanıcı Adı"
          isRequired
        />

        <Button type="submit" color="primary">
          Kod Gönder
        </Button>
      </form>
      <Divider className="my-5" />
      <div className="grid gap-3">
        <Button as={Link} to={"/login"} color="secondary" variant="light">
          <strong>Giriş Yap</strong>
        </Button>
        <Button
          as={Link}
          to={"/reset-password"}
          color="secondary"
          variant="light"
        >
          <strong>SMS Kodum var</strong>
        </Button>
      </div>
    </CenteredCard>
  );
};

export default ForgetPassword;
