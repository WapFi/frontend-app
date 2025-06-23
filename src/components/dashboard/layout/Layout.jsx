// src/components/Layout/Layout.jsx
import { Outlet } from "react-router-dom";
import HeaderBar from "./HeaderBar";
import Sidebar from "./Sidebar";
import MobileMenu from "./MobileMenu";

function Layout() {
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
            <HeaderBar />
          </div>
          <div className="lg:hidden">
            <MobileMenu />
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
