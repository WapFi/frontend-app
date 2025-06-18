import { Routes, Route, Navigate } from "react-router-dom";

import SplashScreen from "../components/SplashScreen";
import SiteLanguage from "../components/SiteLanguage";
import SignUpAccountVerification from "../components/auth/SignUpAccountVerification";
import SignIn from "../components/auth/SignIn";
import ForgotPassword from "../components/auth/ForgotPassword";
import VerifyPhoneEmail from "../components/auth/VerifyPhoneEmail";
import ChangePassword from "../components/auth/ChangePassword";
import Dashboard from "../components/Dashboard";
import Sidebar from "../components/dashboard/layout/Sidebar";
import HeaderBar from "../components/dashboard/layout/HeaderBar";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<SplashScreen />} />
      <Route path="/select-language" element={<SiteLanguage />} />
      <Route path="/sign-up" element={<SignUpAccountVerification />} />
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/change-password" element={<ChangePassword />} />
      <Route path="/verify-code" element={<VerifyPhoneEmail />} />
      <Route path="/sidebar" element={<Sidebar />} />
      <Route path="/header-bar" element={<HeaderBar />} />

      {/* Redirect unknown paths to splash */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
