// src/components/Layout/Layout.jsx
import { Outlet } from "react-router-dom";
import HeaderBar from "./HeaderBar";
import Sidebar from "./Sidebar";
import MobileMenu from "./MobileMenu";
import { fetchUserMe } from "../../../api/apiData";
import { useState, useEffect } from "react";
import PageLoader from "../../PageLoader";
import { useTranslation } from "react-i18next";

function Layout() {
  const { t } = useTranslation();

  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetchUserMe();
        if (res.status) {
          setUserData(res.data);
        }
      } catch (error) {
        // console.log("Failed to load dashboard data: ", error);
        setError(
          "Unable to fetch your personal information. Please try again."
        );
      }
    };

    loadData();
  }, []);

  if (error) return <div className="p-4 text-red-600">{t("layout.error")}</div>;

  if (!userData) return <PageLoader />;

  return (
    <div className="flex gap-3.5 min-h-screen">
      {/* Sidebar for desktop */}
      <aside className="md:w-[30%] hidden lg:block lg:w-[23%]">
        <Sidebar />
      </aside>

      {/* Main content area */}
      <div className="md:w-[75%] w-[95%] mx-auto flex-1 flex flex-col">
        {/* Top bar: HeaderBar on desktop, MobileMenu on mobile */}
        <header>
          <div className="hidden lg:block">
            <HeaderBar userName={userData} />
          </div>
          <div className="lg:hidden">
            <MobileMenu userName={userData} />
          </div>
        </header>

        {/* Page content goes here */}
        <main className="pt-4 flex-1 overflow-y-auto">
          <Outlet />
          {/* <h1>Hi</h1> */}
        </main>
      </div>
    </div>
  );
}

export default Layout;
