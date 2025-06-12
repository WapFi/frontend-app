import { useEffect } from "react";
import WapfiLogo from "./WapfiLogo";
import { useNavigate } from "react-router-dom";
function Dashboard() {
    const navigate = useNavigate();

  return (
    <div className="h-screen flex justify-center items-center">
      <WapfiLogo className="border-b-black border-b-[3.5px] md:border-b-7" />
    </div>
  );
}

export default Dashboard;