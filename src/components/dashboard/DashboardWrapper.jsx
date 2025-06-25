// import { fetchDashboardData } from "../../api/apiData";
// import { useState, useEffect } from "react";
// import Dashboard from "./Dashboard";
// import New_User_Dashboard from "./New_User_Dashboard";

// function DashboardWrapper() {
//   const [dashboardData, setDashboardData] = useState(null);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         const res = await fetchDashboardData();
//         if (res.status) {
//           setDashboardData(res.data);
//         }
//       } catch (error) {
//         // console.log("Failed to load dashboard data: ", error);
//         setError("Unable to load dashboard. Please try again.");
//       }
//     };

//     loadData();
//   }, []);

//   if (error) return <div className="p-4 text-red-600">{error}</div>;

//   if (!dashboardData) return <p>Loading...</p>;

//   return dashboardData.creditScore?.current_score === 0 ? (
//     <New_User_Dashboard dashboardData={dashboardData} />
//   ) : (
//     <Dashboard dashboardData={dashboardData} />
//   );
// }

// export default DashboardWrapper;

import { fetchDashboardData } from "../../api/apiData";
import { useState, useEffect } from "react";
import Dashboard from "./Dashboard";
import New_User_Dashboard from "./New_User_Dashboard";
import PageLoader from "../PageLoader"; 

function DashboardWrapper() {
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetchDashboardData();
        if (res.status) {
            // console.log("from dashboard: ", res.data);
          setDashboardData(res.data);
        }
      } catch (error) {
        setError("Unable to load dashboard. Please try again.");
      }
    };

    loadData();
  }, []);

  if (error) return <div className="p-4 text-red-600">{error}</div>;

  if (!dashboardData) return <PageLoader />;

//   if (!dashboardData.creditScore.current_score === 0)
//     return <New_User_Dashboard dashboardData={dashboardData} />;

  return dashboardData.credit_score.current_score === 0 ? (
    <New_User_Dashboard dashboardData={dashboardData} />
  ) : (
    <Dashboard dashboardData={dashboardData} />
  );
}

export default DashboardWrapper;
