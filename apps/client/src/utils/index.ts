import config from "@/config";
import { ServiceRecord } from "@/types";

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const generateKey = (len?: number) => {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const length = len || 32;
  let key = "";
  for (let i = 0; i < length; i++) {
    key += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return key;
};

export const getFileUrl = (file: string) => {
  return config.BACKEND + "/api/files/" + file;
};

export const translateRecordStatus = (status: ServiceRecord["status"]) => {
  switch (status) {
    case "pending":
      return "Beklemede";
    case "waiting_for_parts":
      return "Parça Tedarik Ediliyor";
    case "in_progress":
      return "Devam Ediyor";
    case "completed":
      return "Tamamlandı";
    case "shipped":
      return "Kargolandı";
    case "delivered":
      return "Teslim Edildi";
    default:
      return "Bilinmiyor";
  }
};
