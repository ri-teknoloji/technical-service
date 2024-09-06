import { Spinner } from "@nextui-org/react";

export const Loading = () => {
  return (
    <div className="relative grid h-screen w-full place-items-center">
      <Spinner size="lg" />
    </div>
  );
};
