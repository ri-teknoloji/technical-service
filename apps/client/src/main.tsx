import { routes } from "@generouted/react-router";
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { ErrorBoundaryLayout } from "@/components";
import "@/styles/globals.css";

const router = createBrowserRouter([
  {
    children: routes,
    element: <ErrorBoundaryLayout />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <>
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </>,
);
