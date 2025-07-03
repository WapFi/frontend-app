// // src/components/Layout/Layout.jsx
// import { Outlet } from "react-router-dom";
// import HeaderBar from "./HeaderBar";
// import Sidebar from "./Sidebar";
// import MobileMenu from "./MobileMenu";
// import { fetchUserMe } from "../../../api/apiData";
// import { useState, useEffect } from "react";
// import PageLoader from "../../PageLoader";
// import { useTranslation } from "react-i18next";

// function Layout() {
//   const { t } = useTranslation();

//   const [userData, setUserData] = useState(null);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         const res = await fetchUserMe();
//         if (res.status) {
//           // console.log(res.data);
//           localStorage.setItem("bank_account_name", res.data.full_name);
//           setUserData(res.data);
//         }
//       } catch (error) {
//         // console.log("Failed to load dashboard data: ", error);
//         setError(
//           "Unable to fetch your personal information. Please try again."
//         );
//       }
//     };

//     loadData();
//   }, []);

//   if (error) return <div className="p-4 text-red-600">{t("layout.error")}</div>;

//   if (!userData) return <PageLoader />;

//   return (
//     <div className="flex gap-3.5 min-h-screen">
//       {/* Sidebar for desktop */}
//       <aside className="md:w-[30%] hidden lg:block lg:w-[23%]">
//         <Sidebar />
//       </aside>

//       {/* Main content area */}
//       <div className="md:w-[75%] w-[95%] mx-auto flex-1 flex flex-col">
//         {/* Top bar: HeaderBar on desktop, MobileMenu on mobile */}
//         <header>
//           <div className="hidden lg:block">
//             <HeaderBar userName={userData} />
//           </div>
//           <div className="lg:hidden">
//             <MobileMenu userName={userData} />
//           </div>
//         </header>

//         {/* Page content goes here */}
//         <main className="pt-4 flex-1 overflow-y-auto">
//           <Outlet />
//           {/* <h1>Hi</h1> */}
//         </main>
//       </div>
//     </div>
//   );
// }

// export default Layout;



import { Outlet, useNavigate } from "react-router-dom";
import HeaderBar from "./HeaderBar";
import Sidebar from "./Sidebar";
import MobileMenu from "./MobileMenu";
import { fetchUserMe } from "../../../api/apiData";
import { useState, useEffect } from "react";
import PageLoader from "../../PageLoader";
import { useTranslation } from "react-i18next";
import { useDashboard } from "../../../context/DashboardContext";

function Layout() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Your existing user data loading
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetchUserMe();
        if (res.status) {
          localStorage.setItem("bank_account_name", res.data.full_name);
          setUserData(res.data);
        }
      } catch (error) {
        setError(
          "Unable to fetch your personal information. Please try again."
        );
      }
    };

    loadData();
  }, []);

  // --- NEW: Dashboard Context for Active Loan Check ---
  const { dashboardData } = useDashboard();
  const [showActiveLoanModal, setShowActiveLoanModal] = useState(false);

  // --- NEW: Take a Loan Click Handler ---
  const handleTakeLoanClick = () => {
    if (dashboardData?.active_loan) {
      // User has an existing active loan
      setShowActiveLoanModal(true);
    } else {
      // User is eligible
      navigate("/take-a-loan/form/loan-amount-purpose");
    }
  };

  // --- Loading/Error States for User Data ---
  if (error) return <div className="p-4 text-red-600">{t("layout.error")}</div>;
  if (!userData) return <PageLoader />;

  return (
    <div className="flex gap-3.5 min-h-screen relative">
      {/* Sidebar for desktop */}
      <aside className="md:w-[30%] hidden lg:block lg:w-[23%]">
        <Sidebar onTakeLoanClick={handleTakeLoanClick} />
      </aside>

      {/* Main content area */}
      <div className="md:w-[75%] w-[95%] mx-auto flex-1 flex flex-col">
        {/* Top bar: HeaderBar on desktop, MobileMenu on mobile */}
        <header>
          <div className="hidden lg:block">
            <HeaderBar userName={userData} />
          </div>
          <div className="lg:hidden">
            <MobileMenu userName={userData} onTakeLoanClick={handleTakeLoanClick} />
          </div>
        </header>

        {/* Page content goes here */}
        <main className="pt-4 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* --- NEW: Modal Overlay for Active Loan --- */}
      {showActiveLoanModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6 text-center">
            <h2 className="text-xl font-bold mb-4 text-[#2D6157]">
              {t("layout.activeLoanModal.title")}
            </h2>
            <p className="mb-6 text-[#444]">
               {t("layout.activeLoanModal.body")}
            </p>
            <button
              onClick={() => {
                setShowActiveLoanModal(false);
                navigate("/dashboard");
              }}
              className="w-full rounded-[50px] text-white font-medium bg-[#439182] py-2 px-3 hover:opacity-80 transition-opacity duration-300"
            >
              {t("layout.activeLoanModal.button")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Layout;
