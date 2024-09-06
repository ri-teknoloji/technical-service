import { CenteredCard } from "@/components/CenteredCard";
import { PasswordInput } from "@/components/PasswordInput";
import { http, httpError } from "@/lib/http";
import { sleep } from "@/utils";
import { Button, Input } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

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

        <PasswordInput label="Şifre" name="password" isRequired />

        <Button type="submit" color="primary">
          Giriş Yap
        </Button>
      </form>
      <br />
      <p className="text-center">
        Hesabınız yok mu?{" "}
        <button onClick={() => navigate("/register")} className="text-primary">
          Kayıt ol
        </button>
      </p>
    </CenteredCard>
  );
};

export default Login;
