import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "../api/axios";

function PrivateRoute({ children }) {
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("/users/me", {
          withCredentials: true,
        });

        if (res?.data?.status === true) {
          setIsAuth(true);
        } else {
          setIsAuth(false);
        }
      } catch (error) {
        setIsAuth(false);
      }
    };

    checkAuth();
  }, []);

  if (isAuth === null) return <p className="p-4">Loading...</p>;

  if (isAuth === false) {
    return <Navigate to="/sign-in" replace />;
  }

  return children;
}

export default PrivateRoute;
