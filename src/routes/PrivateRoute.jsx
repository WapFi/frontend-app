
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "../api/axios";
import PageLoader from "../components/PageLoader";

function PrivateRoute({ children }) {
  const [authStatus, setAuthStatus] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("/users/me");

        if (res?.data?.status === true) {
          const userRole = res?.data?.data?.role;
          
          if (userRole === "WAPFI_ADMIN" || userRole === "WAPFI_SUPER_ADMIN") {
            setAuthStatus("admin");
          } else if (userRole === "WAPFI_USER") {
            setAuthStatus("user");
          } else {
            setAuthStatus("unauthorized");
          }
        } else {
          setAuthStatus("unauthenticated");
        }
      } catch (error) {
        console.log("request failed.");
        setAuthStatus("unauthenticated");
      }
    };

    checkAuth();
  }, []);

  if (authStatus === null) return <PageLoader />;

  if (authStatus === "unauthenticated") return <Navigate to="/sign-in" replace />;
  
  if (authStatus === "admin") return <Navigate to="/admin/dashboard" replace />;

  if (authStatus === "unauthorized") return <Navigate to="/sign-in" replace />;

  return children;
}

export default PrivateRoute;

