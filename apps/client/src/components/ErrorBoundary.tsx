import { Button } from "@nextui-org/react";
import { ErrorBoundary } from "react-error-boundary";
import { Outlet } from "react-router-dom";

import { CenteredCard } from "./CenteredCard";

function fallbackRender({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  return (
    <CenteredCard>
      <h1 className="p-3 text-center text-2xl">Something went wrong</h1>
      <p className="text-center">
        There was an error while rendering this component.
      </p>
      <br />
      <pre className="text-sm text-red-500" style={{ whiteSpace: "normal" }}>
        {error.message}
      </pre>
      <br />
      <Button
        className="w-full"
        color="danger"
        onClick={resetErrorBoundary}
        size="sm"
      >
        Reload
      </Button>
    </CenteredCard>
  );
}

export const ErrorBoundaryLayout = () => (
  <ErrorBoundary FallbackComponent={fallbackRender}>
    <Outlet />
  </ErrorBoundary>
);
