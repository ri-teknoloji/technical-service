import { VITE_API_URL } from "@/config";
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
  return VITE_API_URL + "/files/" + file;
};

export const dateToDefaultValue = (date?: Date | null | string): string => {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0];
};

export const translateRecordStatus = (status: ServiceRecord["status"]) => {
  switch (status) {
    case "completed":
      return "Tamamlandı";
    case "delivered":
      return "Teslim Edildi";
    case "in_progress":
      return "Devam Ediyor";
    case "pending":
      return "Beklemede";
    case "shipped":
      return "Kargolandı";
    case "waiting_for_parts":
      return "Parça Tedarik Ediliyor";
    default:
      return "Bilinmiyor";
  }
};
