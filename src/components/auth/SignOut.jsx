import { useEffect } from "react";
import { signOut } from "../../api/authApi";
import clearSessionData from "../../utils/clearSessionData";
import PageLoader from "../PageLoader";

export default function SignOut() {
  useEffect(() => {
    const requestTimer = setTimeout(async () => {
      try {
        const response = await signOut();

        clearSessionData();
        sessionStorage.setItem(
          "logoutResult",
          JSON.stringify({
            type: "success",
            serverMessage: response.data?.message || "",
          }),
        );

        window.location.replace("/sign-in");
      } catch (error) {
        if (error.response?.status === 401) {
          clearSessionData();
          window.location.replace("/sign-in");
          return;
        }

        clearSessionData();
        sessionStorage.setItem(
          "logoutResult",
          JSON.stringify({
            type: "warning",
            serverMessage: error.response?.data?.message || "",
          }),
        );

        window.location.replace("/sign-in");
      }
    }, 0);

    return () => clearTimeout(requestTimer);
  }, []);

  return <PageLoader />;
}