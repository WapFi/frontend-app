import { createContext, useState, useContext, useEffect } from "react";

const UserContext = createContext();

export function UserContextProvider({ children }) {
  const [userData, setUserData] = useState(() => {
    const stored = localStorage.getItem("userData");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("repaymentsData", JSON.stringify(userData));
  }, [userData]);

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
}

export function use_UserData() {
  return useContext(UserContext);
}
