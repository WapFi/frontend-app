// import { useEffect } from "react";
// import WapfiLogo from "./WapfiLogo";
// import loadingBar from "../assets/loading bar.gif";
// import { useNavigate } from "react-router-dom";
// function SplashScreen() {
//   const navigate = useNavigate();

//     useEffect(() => {
//       setTimeout(() => {
//         // after two seconds, navigate to select language page
//         navigate("/select-language");
//       }, 4000);
//     });
//   return (
//     <div className="h-screen flex flex-col justify-center items-center pb-20 lg:pr-20">
//       {/* <WapfiLogo className="border-b-black border-b-[3.5px] md:border-b-7" /> */}
//       <WapfiLogo className="w-[178px] h-[71.206px] lg:w-[284px] lg:h-[113.609px] shrink-0" />
//       <div className="bg-lightgray bg-center bg-cover bg-no-repeat">
//         <img
//           src={loadingBar}
//           alt="loading bar"
//           className="block w-[242px] h-[6px] shrink-0 lg:w-[285px] lg:h-[8px] -mt-10"
//         />
//       </div>
//     </div>
//   );
// }

// export default SplashScreen;


import { useEffect, useState } from "react";
import WapfiLogo from "./WapfiLogo";
import loadingBar from "../assets/loading bar.gif";
import { useNavigate } from "react-router-dom";

function SplashScreen() {
  const navigate = useNavigate();
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setFadeOut(true); 
      setTimeout(() => navigate("/select-language"), 1000); 
    }, 4000);

    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <div
      className={`h-screen flex flex-col justify-center items-center pb-20 lg:pr-20 transition-opacity duration-500 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <WapfiLogo className="w-[178px] h-[71.206px] lg:w-[284px] lg:h-[113.609px] shrink-0" />
      <div className="bg-lightgray bg-center bg-cover bg-no-repeat">
        <img
          src={loadingBar}
          alt="loading bar"
          className="block w-[242px] h-[6px] shrink-0 lg:w-[285px] lg:h-[8px] -mt-10"
        />
      </div>
    </div>
  );
}

export default SplashScreen;

