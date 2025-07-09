import { fetchDashboardData } from "../../api/apiData";
import { useState, useEffect } from "react";
import Dashboard from "./Dashboard";
import New_User_Dashboard from "./New_User_Dashboard";
import PageLoader from "../PageLoader";
import { useDashboard } from "../../context/DashboardContext";
import { useTranslation } from "react-i18next";

function DashboardWrapper() {
  const { t } = useTranslation();

  const { dashboardData, setDashboardData } = useDashboard();
  const [error, setError] = useState(null);

  // useEffect(() => {
  //   if (!dashboardData || !dashboardData.credit_score) {
  //     const loadData = async () => {
  //       try {
  //         const res = await fetchDashboardData();
  //         if (res.status) {
  //           setDashboardData(res.data);
  //         } else {
  //           setError(t("dashboardWrapper.failedLoad"));
  //         }
  //       } catch (error) {
  //         setError(t("dashboardWrapper.unableLoad"));
  //       }
  //     };
  //     loadData();
  //   }
  // }, [dashboardData]);

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

  return dashboardData.credit_score.current_score === 0 ? (
    <New_User_Dashboard dashboardData={dashboardData} />
  ) : (
    <Dashboard dashboardData={dashboardData} />
  );
}

export default DashboardWrapper;
