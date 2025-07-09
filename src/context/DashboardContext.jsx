// import React, { createContext, useContext, useState } from "react";

// const DashboardContext = createContext();

// export function DashboardProvider({ children }) {
//   const [dashboardData, setDashboardData] = useState(null);

//   return (
//     <DashboardContext.Provider value={{ dashboardData, setDashboardData }}>
//       {children}
//     </DashboardContext.Provider>
//   );
// }

// export function useDashboard() {
//   return useContext(DashboardContext);
// }

import { createContext, useContext, useEffect, useState } from "react";

const DashboardContext = createContext();

export function DashboardProvider({ children }) {
  const [dashboardData, setDashboardData] = useState(() => {
    const stored = localStorage.getItem("dashboardData");
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (dashboardData) {
      localStorage.setItem("dashboardData", JSON.stringify(dashboardData));
    } else {
      localStorage.removeItem("dashboardData");
    }
  }, [dashboardData]);

  return (
    <DashboardContext.Provider value={{ dashboardData, setDashboardData }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  return useContext(DashboardContext);
}
