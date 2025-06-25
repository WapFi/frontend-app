// import { useEffect, useState } from "react";
// import { Navigate } from "react-router-dom";
// import axios from "../api/axios";
// import { getCookie } from "../utils/getCookie";

// function PrivateRoute({ children }) {
//   const [isAuth, setIsAuth] = useState(null);

//   useEffect(() => {
//     const checkAuth = async () => {
      
//       console.log("CSRF Token:", getCookie('csrf_token'));
//       try {
//         const res = await axios.get("/users/me", {
//           withCredentials: true,
//           headers: {
//             'X-CSRF-Token': getCookie('csrf_token'),
//           }
//         });

//         if (res?.data?.status === true) {
//           console.log("authenticated");
//           setIsAuth(true);
//         } else {
//           console.log("not authenticated");
//           setIsAuth(false);
//         }
//       } catch (error) {
//         console.log("request failed.")
//         setIsAuth(false);
//       }
//     };

//     checkAuth();
//   }, []);

//   if (isAuth === null) return <p className="p-4">Loading...</p>;

//   if (isAuth === false) {
//     return <Navigate to="/sign-in" replace />;
//   }

//   return children;
// }

// export default PrivateRoute;


import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "../api/axios";
import PageLoader from "../components/PageLoader";

function PrivateRoute({ children }) {
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("/users/me");

        if (res?.data?.status === true) {
          // console.log("authenticated");
          // console.log(res.data);
          setIsAuth(true);
        } else {
          setIsAuth(false);
        }
      } catch (error) {
        console.log("request failed.");
        setIsAuth(false);
      }
    };

    checkAuth();
  }, []);

  if (isAuth === null) return  <PageLoader />;

  if (isAuth === false) return <Navigate to="/sign-in" replace />;

  return children;
}

export default PrivateRoute;

