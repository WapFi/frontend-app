
import { createContext, useContext, useEffect, useState } from "react";
import { fetchDashboardData } from "../api/apiData";

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

  const refreshDashboardData = async () => {
    try {
      const res = await fetchDashboardData();
      if (res.data) {
        setDashboardData(res.data);
        // console.log("Dashboard data refreshed:", res.data);
        return res.data;
      } else {
        console.log("Failed to fetch dashboard data:", res);
        setDashboardData(null);
        return null;
      }
    } catch (err) {
      console.log("Error in refreshDashboardData:", err);
      setDashboardData(null);
      return null;
    }
  };

  useEffect(() => {
    refreshDashboardData();
  }, []);

  return (
    <DashboardContext.Provider
      value={{ dashboardData, setDashboardData, refreshDashboardData }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  return useContext(DashboardContext);
}
