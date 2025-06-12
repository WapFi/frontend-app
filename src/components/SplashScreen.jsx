import { useEffect } from "react";
import WapfiLogo from "./WapfiLogo";
import { useNavigate } from "react-router-dom";
function SplashScreen() {
    const navigate = useNavigate();

    useEffect(() => {
        setTimeout(() => {
            // after two seconds, navigate to select language page
            navigate("/select-language")
        }, 2000);
    });
  return (
    <div className="h-screen flex justify-center items-center">
      <WapfiLogo className="border-b-black border-b-[3.5px] md:border-b-7" />
    </div>
  );
}

export default SplashScreen;
