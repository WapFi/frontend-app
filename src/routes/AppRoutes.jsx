import { Routes, Route, Navigate } from "react-router-dom";

import SplashScreen from "../components/SplashScreen";
import SiteLanguage from "../components/SiteLanguage";
import SignUpAccountVerification from "../components/auth/SignUpAccountVerification";
import SignIn from "../components/auth/SignIn";
import ForgotPassword from "../components/auth/ForgotPassword";
import VerifyPhoneEmail from "../components/auth/VerifyPhoneEmail";
import ChangePassword from "../components/auth/ChangePassword";
import Layout from "../components/dashboard/layout/Layout";
import Dashboard from "../components/dashboard/Dashboard";
import LoanDetailsScreenMobile from "../components/dashboard/LoanDetailsScreenMobile";
import PrivateRoute from "./PrivateRoute";

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<SplashScreen />} />
      <Route path="/select-language" element={<SiteLanguage />} />
      <Route path="/sign-up" element={<SignUpAccountVerification />} />
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/change-password" element={<ChangePassword />} />
      <Route path="/verify-code" element={<VerifyPhoneEmail />} />

      {/* Protected layout shell for dashboard routes */}

      <Route
        path=""
        element={
          // <PrivateRoute>
          <Layout />
          // </PrivateRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/repayments/:id" element={<LoanDetailsScreenMobile />} />
      </Route>

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
