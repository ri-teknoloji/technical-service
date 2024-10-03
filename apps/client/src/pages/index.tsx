import { Button } from "@nextui-org/react";
import { Link } from "react-router-dom";
import useSWR from "swr";

const Home = () => {
  const { data } = useSWR("/");
  console.log(data);
  return (
    <div className="grid h-screen place-items-center gap-3">
      <Button as={Link} color="primary" size="lg" to={"/dashboard"}>
        <strong>Dashboard</strong>
      </Button>
    </div>
  );
};

export default Home;
