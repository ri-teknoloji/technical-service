import axios from "axios";
import { toast } from "sonner";

import { API_URL } from "@/config";
import { sleep } from "@/utils";

const http = axios.create({ baseURL: API_URL });

const getToken = () => {
  if (typeof window === "undefined") return;

  return localStorage.getItem("token");
};

http.interceptors.request.use(async (request) => {
  const token = getToken();

  if (token) {
    request.headers.Authorization = `Bearer ${token}`;
  }

  return request;
});

http.handleError = async (error) => {
  if (!axios.isAxiosError(error)) {
    return toast.error("Bilinmeyen bir hata oluştu!");
  }

  if (!error.response) {
    return toast.error("Sunucuya bağlanırken bir hata oluştu!");
  }

  if (error.response.status === 401) {
    localStorage.removeItem("token");
    toast.error("Unauthorized");
    await sleep(1000);
    location.replace("/login");
  }

  const { errors, message } = error.response.data;

  return toast.error(message, {
    description: errors && errors.join("\n"),
    descriptionClassName: "whitespace-pre",
  });
};

http.fetcher = (url) => http.get(url).then((res) => res.data);

export default http;
