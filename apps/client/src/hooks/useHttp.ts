import { fetcher, httpError } from "@/lib/http";
import useSWR, { SWRConfiguration, SWRResponse } from "swr";

export const useHttp = <T>(
  url: string,
  config?: SWRConfiguration,
): SWRResponse<T> => {
  return useSWR<T>(url, fetcher, {
    onError: httpError,
    ...config,
  });
};
