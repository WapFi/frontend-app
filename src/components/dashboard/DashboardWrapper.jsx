

import { fetchDashboardData } from "../../api/apiData";
import { useState, useEffect } from "react";
import Dashboard from "./Dashboard"; // Now imports the single, combined component
import PageLoader from "../PageLoader";
import { useDashboard } from "../../context/DashboardContext";
import { useTranslation } from "react-i18next";

function DashboardWrapper() {
  const { t } = useTranslation();
  const { dashboardData, setDashboardData } = useDashboard();
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetchDashboardData();
        if (res.status) {
          setDashboardData(res.data);
        } else {
          setError(t("dashboardWrapper.failedLoad"));
        }
      } catch (error) {
        setError(t("dashboardWrapper.unableLoad"));
      }
    };
    loadData();
  }, []);

  if (error) return <div className="p-4 text-red-600">{error}</div>;

  if (!dashboardData || !dashboardData.credit_score) return <PageLoader />;

  return <Dashboard dashboardData={dashboardData} />;
}

export default DashboardWrapper;