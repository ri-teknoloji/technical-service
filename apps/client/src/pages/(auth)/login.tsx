import { Button, Divider, Input } from "@nextui-org/react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { CenteredCard } from "@/components/CenteredCard";
import { PasswordInput } from "@/components/PasswordInput";
import http from "@/lib/http";
import { sleep } from "@/utils";

const Login = () => {
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await http.post("/auth/login", data);
      localStorage.setItem("token", res.data.token);
      toast.success("Giriş başarılı!");
      await sleep(1000);
      location.replace("/");
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

        <PasswordInput isRequired label="Şifre" name="password" />

        <Button color="primary" type="submit">
          Giriş Yap
        </Button>
      </form>
      <Divider className="my-5" />

      <div className="grid gap-3">
        <p className="text-center">
          Hesabınız yok mu?{" "}
          <button
            className="text-primary"
            onClick={() => navigate("/register")}
          >
            Kayıt ol
          </button>
        </p>

        <Button
          as={Link}
          color="danger"
          to={"/forget-password"}
          variant="light"
        >
          <strong>Şifremi Unuttum</strong>
        </Button>
      </div>
    </CenteredCard>
  );
};

export default Login;
