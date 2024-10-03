import { Button } from "@nextui-org/react";
import { Link } from "react-router-dom";

import { CenteredCard } from "@/components/CenteredCard";

const Forbidden = () => {
  return (
    <CenteredCard title="403 - Forbidden">
      <div className="grid gap-3">
        <h1 className="text-center text-xl font-bold text-red-800 dark:text-red-200">
          You are not allowed to access this page.
        </h1>
        <div className="flex justify-center">
          <Button as={Link} color="primary" to={"/"}>
            <strong>Go Home</strong>
          </Button>
        </div>
      </div>
    </CenteredCard>
  );
};

export default Forbidden;
