// import { createContext, useState, useContext, useEffect } from "react";

// const UserContext = createContext();

// export function UserContextProvider({ children }) {
//   const [userData, setUserData] = useState(() => {
//     const stored = localStorage.getItem("userData");
//     return stored ? JSON.parse(stored) : [];
//   });

//   useEffect(() => {
//     localStorage.setItem("userData", JSON.stringify(userData));
//   }, [userData]);

//   return (
//     <UserContext.Provider value={{ userData, setUserData }}>
//       {children}
//     </UserContext.Provider>
//   );
// }



// export function use_UserData() {
//   return useContext(UserContext);
// }


import { createContext, useState, useContext, useEffect } from "react";
import { fetchUserMe } from "../api/apiData";

const UserContext = createContext();

export function UserContextProvider({ children }) {
  const [userData, setUserData] = useState(() => {
    const stored = localStorage.getItem("userData");
    return stored ? JSON.parse(stored) : null;
  });

  // Keep localStorage in sync when userData changes
  useEffect(() => {
    if (userData) {
      localStorage.setItem("userData", JSON.stringify(userData));
    } else {
      localStorage.removeItem("userData");
    }
  }, [userData]);

  /**
   * New: fetch fresh user data from the server
   */
  const refreshUserData = async () => {
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
  };

  return (
    <UserContext.Provider value={{ userData, setUserData, refreshUserData }}>
      {children}
    </UserContext.Provider>
  );
}

export function use_UserData() {
  return useContext(UserContext);
}
