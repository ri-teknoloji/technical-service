import { Button } from "@nextui-org/react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="grid h-screen place-items-center gap-3">
      <Button as={Link} to={"/dashboard"} color="primary" size="lg">
        <strong>Dashboard</strong>
      </Button>
    </div>
  );
};

export default Home;
