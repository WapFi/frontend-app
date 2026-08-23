import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "../api/axios";
import PageLoader from "../components/PageLoader";
import { AdminRoleProvider } from "../context/AdminRoleContext";

function AdminRoute({ children }) {
  const [authStatus, setAuthStatus] = useState(null);
  const [adminUser, setAdminUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("/users/me");

        if (res?.data?.status === true) {
          const userData = res?.data?.data;
          const userRole = res?.data?.data?.role;
          
          if (userRole === "WAPFI_ADMIN" || userRole === "WAPFI_SUPER_ADMIN") {
            setAdminUser(userData);
            setAuthStatus("admin");
          } else if (userRole === "WAPFI_USER") {
            setAuthStatus("user");
          } else {
            setAuthStatus("unauthorized");
          }
        } else {
          setAuthStatus("unauthenticated");
        }
      } catch {
        setAuthStatus("unauthenticated");
      }
    };

    checkAuth();
  }, []);

  if (authStatus === null) return <PageLoader />;

  if (authStatus === "unauthenticated") return <Navigate to="/sign-in" replace />;
  
  if (authStatus === "user") return <Navigate to="/dashboard" replace />;
  
  if (authStatus === "unauthorized") return <Navigate to="/sign-in" replace />;

  return <AdminRoleProvider adminUser={adminUser}>{children}</AdminRoleProvider>;
}

export default AdminRoute;
