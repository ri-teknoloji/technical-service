import { useTheme } from "next-themes";
import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import { SWRConfig } from "swr";

import http from "@/lib/http";

import { Providers } from "./_providers";

type Theme = "dark" | "light" | "system";

const AppLayout = () => {
  const { theme } = useTheme() as {
    theme: Theme;
  };

  return (
    <>
      <Providers>
        <SWRConfig
          value={{
            fetcher: http.fetcher,
            onError: http.handleError,
          }}
        >
          <Outlet />
          <Toaster richColors theme={theme || "light"} />
        </SWRConfig>
      </Providers>
    </>
  );
};

export default AppLayout;
