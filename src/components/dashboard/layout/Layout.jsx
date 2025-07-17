import { Outlet, useNavigate } from "react-router-dom";
import HeaderBar from "./HeaderBar";
import Sidebar from "./Sidebar";
import MobileMenu from "./MobileMenu";
import { fetchUserMe } from "../../../api/apiData";
import { useState, useEffect } from "react";
import PageLoader from "../../PageLoader";
import { useTranslation } from "react-i18next";
import { useDashboard } from "../../../context/DashboardContext";
import { use_UserData } from "../../../context/UserContext";
// import RepaymentsSection from "../RepaymentsSection";
// import Repayments from "../../repayments/Repayments";

function Layout() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Your existing user data loading
  // const [userData, setUserData] = useState(null);
  const { userData, setUserData } = use_UserData();
  // const [newUserRepayments, setNewUserRepayments] = false;
  const [error, setError] = useState(null);
  const [logoutError, setLogoutError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetchUserMe();
        if (res.status) {
          // localStorage.setItem("bank_account_name", res.data.full_name);
          localStorage.setItem("userData", JSON.stringify(res.data));
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
    console.log("user data: ", userData);
    if (dashboardData?.active_loan) {
      // User has an existing active loan
      setShowActiveLoanModal(true);
    } else if (
      dashboardData?.pending_loan?.status === "PENDING" &&
      userData.phone_verified === true
    ) {
      navigate("/take-a-loan/loan-repayment-overview");
    } else if (dashboardData.credit_score.current_score === 0) {
      navigate("/take-a-loan/enter-bvn");
    } else if (userData.phone_verified === false) {
      navigate("/take-a-loan/verify-phone");
    } else {
      // User is eligible
      navigate("/take-a-loan/form/loan-amount-purpose");
    }
  };

  // --- Loading/Error States for User Data ---
  if (error) return <div className="p-4 text-red-600">{t("layout.error")}</div>;
  if (!userData) return <PageLoader />;

  {
    logoutError && (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 text-center">
        {logoutError}
      </div>
    );
  }

  return (
    <div className="flex gap-3.5 min-h-screen relative">
      {/* Sidebar for desktop */}
      <aside className="md:w-[30%] hidden lg:block lg:w-[23%]">
        <Sidebar
          onTakeLoanClick={handleTakeLoanClick}
          setLogoutError={setLogoutError}
        />
      </aside>

      {/* Main content area */}
      <div className="md:w-[75%] w-[95%] mx-auto flex-1 flex flex-col">
        {/* Top bar: HeaderBar on desktop, MobileMenu on mobile */}
        <header>
          <div className="hidden lg:block">
            <HeaderBar userName={userData} />
          </div>
          <div className="lg:hidden">
            <MobileMenu
              userName={userData}
              onTakeLoanClick={handleTakeLoanClick}
              setLogoutError={setLogoutError}
            />
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
