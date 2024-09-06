import React from "react";
import ReactDOM from "react-dom/client";

import "@/styles/tailwind.css";
import "@/styles/index.css";

import { ErrorBoundaryLayout, Toaster } from "@/components";
import { Provider } from "@/providers";

import { routes } from "@generouted/react-router";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    element: <ErrorBoundaryLayout />,
    children: routes,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <>
    <React.StrictMode>
      <Provider>
        <RouterProvider router={router} />
        <Toaster />
      </Provider>
    </React.StrictMode>
  </>,
);
