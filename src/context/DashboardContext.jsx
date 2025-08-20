

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { fetchDashboardData } from "../api/apiData";

const DashboardContext = createContext();

export function DashboardProvider({ children }) {
  const [dashboardData, setDashboardData] = useState(() => {
    const stored = localStorage.getItem("dashboardData");
    return stored ? JSON.parse(stored) : null;
  });

  // Keep localStorage in sync when dashboardData changes
  useEffect(() => {
    if (dashboardData) {
      localStorage.setItem("dashboardData", JSON.stringify(dashboardData));
    } else {
      localStorage.removeItem("dashboardData");
    }
  }, [dashboardData]);

  // Use useCallback to memoize the refresh function
  const refreshDashboardData = useCallback(async () => {
    try {
      const res = await fetchDashboardData();
      if (res.data) {
        setDashboardData(res.data);
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
  }, []); // Empty dependency array is crucial here!

  // Initial data fetch on mount
  useEffect(() => {
    refreshDashboardData();
  }, [refreshDashboardData]); // Now it depends on the memoized function

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