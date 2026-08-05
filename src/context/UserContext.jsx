



import { createContext, useState, useContext, useEffect, useCallback } from "react";
import { fetchUserMe } from "../api/apiData";

const UserContext = createContext();

export function UserContextProvider({ children }) {
  const [userData, setUserData] = useState(() => {
    const stored = localStorage.getItem("userData");
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (userData) {
      localStorage.setItem("userData", JSON.stringify(userData));
    } else {
      localStorage.removeItem("userData");
    }
  }, [userData]);

  const refreshUserData = useCallback(async () => {
    try {
      const res = await fetchUserMe();
      if (res.status) {
        setUserData(res.data);
        return res.data;
      } else {
        console.error("Failed to fetch user data:", res);
      }
    } catch (err) {
      console.error("Error in refreshUserData:", err);
    }
  }, []);

  // Initial fetch on mount, but only on pages that need an authenticated user.
  useEffect(() => {
    const publicPaths = [
      "/",
      "/select-language",
      "/sign-in",
      "/sign-up",
      "/forgot-password",
      "/verify-code",
      "/change-password",
    ];

    if (publicPaths.includes(window.location.pathname)) {
      return;
    }

    refreshUserData();
  }, [refreshUserData]);

  return (
    <UserContext.Provider value={{ userData, setUserData, refreshUserData }}>
      {children}
    </UserContext.Provider>
  );
}

export function use_UserData() {
  return useContext(UserContext);
}