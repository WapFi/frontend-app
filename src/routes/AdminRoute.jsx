import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "../api/axios";
import PageLoader from "../components/PageLoader";

function AdminRoute({ children }) {
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
        console.log("Auth check failed.");
        setAuthStatus("unauthenticated");
      }
    };

    checkAuth();
  }, []);

  if (authStatus === null) return <PageLoader />;

  if (authStatus === "unauthenticated") return <Navigate to="/sign-in" replace />;
  
  if (authStatus === "user") return <Navigate to="/dashboard" replace />;
  
  if (authStatus === "unauthorized") return <Navigate to="/sign-in" replace />;

  return children;
}

export default AdminRoute;