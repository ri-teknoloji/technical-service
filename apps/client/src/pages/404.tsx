import { CenteredCard } from "@/components/CenteredCard";
import { Button } from "@nextui-org/react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <CenteredCard title="404 - Not Found">
      <div className="grid gap-3">
        <h1 className="text-center text-xl font-bold text-red-800 dark:text-red-200">
          The page you are looking for does not exist.
        </h1>
        <div className="flex justify-center">
          <Button as={Link} to={"/"} color="primary">
            <strong>Go Home</strong>
          </Button>
        </div>
      </div>
    </CenteredCard>
  );
};

export default NotFound;
