import { createBrowserRouter, Navigate } from "react-router-dom";
import SplashScreen from "../components/SplashScreen";
import SiteLanguage from "../components/SiteLanguage";
import SignUpAccountVerification from "../components/auth/SignUpAccountVerification";
import SignIn from "../components/auth/SignIn";
import ForgotPassword from "../components/auth/ForgotPassword";
import VerifyPhoneEmail from "../components/auth/VerifyPhoneEmail";
import ChangePassword from "../components/auth/ChangePassword";
import Layout from "../components/dashboard/layout/Layout";
import LoanDetailsScreenMobile from "../components/dashboard/LoanDetailsScreenMobile";
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";
import DashboardWrapper from "../components/dashboard/DashboardWrapper";

// Admin components
import AdminLayout from "../components/admin/layout/AdminLayout";
import AdminDashboard from "../components/admin/dashboard/AdminDashboard";
import UserManagement from "../components/admin/user-management/UserManagement";
import AdminManagement from "../components/admin/admin-management/AdminManagement";
import BVNVerification from "../components/admin/kyc/BVNVerification";
import NINVerification from "../components/admin/kyc/NINVerification";
import LoanApplications from "../components/admin/loans/LoanApplications";
import LoanRepaymentManagement from "../components/admin/repayments/LoanRepaymentManagement";
import AddRepayment from "../components/admin/repayments/AddRepayment";
import Analytics from "../components/admin/analytics/Analytics";

// Loan form steps
import { LoanFormProvider } from "../context/LoanFormContext";
import LoanFlowWrapper from "../components/take a loan/LoanFlowWrapper";
import EnterBVN from "../components/take a loan/EnterBVN";
import VerifyPhoneNumber from "../components/take a loan/VerifyPhoneNumber";
import Step1LoanAmount from "../components/take a loan/Step1LoanAmount";
import Step2BankAccount from "../components/take a loan/Step2BankAccount";
import Step3LoanRepayment from "../components/take a loan/Step3LoanRepayment";
import Step4Summary from "../components/take a loan/Step4Summary";
import LoanRepaymentOverview from "../components/take a loan/LoanRepaymentOverview";
import LoanHistory from "../components/repayments/LoanHistory";

// repayments
import { RepaymentsProvider } from "../context/RepaymentsContext";
import Repayments from "../components/repayments/Repayments";
// import RecyclablesRepaymentTable from "../components/repayments/RecyclabesRepaymentTable";
import RepaymentsHistoryWrapper from "../components/repayments/RepaymentsHistoryWrapper";

// credit scores
import CreditScore from "../components/credit score/CreditScore";
import SettingsWrapper from "../components/settings/SettingsWrapper";

// settings
import IdentityVerification from "../components/settings/IdentityVerification";
import { UserContextProvider } from "../context/UserContext";
import SettingsChangePassword from "../components/settings/SettingsChangePassword";
import SettingsForgotPassword from "../components/settings/SettingsForgotPassword";
import SettingsVerifyEmailPhone from "../components/settings/SettingsVerifyEmailPhone";
import PasswordResetForm from "../components/settings/PasswordResetForm";
import Notifications from "../components/settings/Notifications";
import Support from "../components/settings/Support";

// profile
// import ProfileNotifications from "../components/profile/ProfileNotifications";
import { NotificationProvider } from "../context/NotificationContext";

const router = createBrowserRouter([
  // Public routes
  {
    path: "/",
    element: <SplashScreen />,
  },
  {
    path: "/select-language",
    element: <SiteLanguage />,
  },
  {
    path: "/sign-up",
    element: <SignUpAccountVerification />,
  },
  {
    path: "/sign-in",
    element: <SignIn />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/change-password",
    element: <ChangePassword />,
  },
  {
    path: "/verify-code",
    element: <VerifyPhoneEmail />,
  },

  // Protected layout shell for dashboard + loan routes
  {
    path: "/",
    element: (
      <PrivateRoute>
        <NotificationProvider>
          <Layout />
        </NotificationProvider>
      </PrivateRoute>
    ),
    children: [
      // Dashboard
      {
        path: "dashboard",
        element: <DashboardWrapper />,
      },

      // repayments routes
      {
        path: "repayments",
        element: (
          <RepaymentsProvider>
            <Repayments />
          </RepaymentsProvider>
        ),
      },

      {
        path: "repayments/:id",
        element: (
          <RepaymentsProvider>
            <LoanDetailsScreenMobile />
          </RepaymentsProvider>
        ),
      },
      {
        path: "repayments/repayment-history/:id",
        element: (
          <RepaymentsProvider>
            <RepaymentsHistoryWrapper />
          </RepaymentsProvider>
        ),
      },
      {
        path: "/repayments/loans/history",
        element: <LoanHistory />,
      },

      // Loan flow
      {
        path: "take-a-loan/enter-bvn",
        element: <EnterBVN />,
      },
      {
        path: "take-a-loan/verify-phone",
        element: <VerifyPhoneNumber />,
      },
      // {
      //   path: "/repayments-header",
      //   element: <RecyclablesRepaymentTable />,
      // },
      {
        path: "take-a-loan/form",
        element: (
          <LoanFormProvider>
            <LoanFlowWrapper />
          </LoanFormProvider>
        ),
        children: [
          {
            path: "loan-amount-purpose",
            element: <Step1LoanAmount />,
          },
          {
            path: "bank-account-confirmation",
            element: <Step2BankAccount />,
          },
          {
            path: "loan-repayment-method",
            element: <Step3LoanRepayment />,
          },
          {
            path: "loan-form-summary",
            element: <Step4Summary />,
          },
          // {
          //   path: "loan-repayment-overview",
          //   element: <LoanRepaymentOverview />,
          // },
        ],
      },
      {
        // path: "take-a-loan/form/loan-repayment-overview",
        // element: <LoanRepaymentOverview />,
        path: "take-a-loan/loan-repayment-overview",
        element: (
          <LoanFormProvider>
            <LoanRepaymentOverview />
          </LoanFormProvider>
        ),
      },

      // credit score routes
      {
        path: "/credit-score",
        element: <CreditScore />,
      },

     
      {
        path: "settings",
        element: <SettingsWrapper></SettingsWrapper>,
        children: [
          {
            path: "identity-verification",
            element: (
              <UserContextProvider>
                <IdentityVerification />,
              </UserContextProvider>
            ),
          },
          {
            path: "change-password",
            element: <SettingsChangePassword />,
          },
          {
            path: "forgot-password",
            element: <SettingsForgotPassword />,
          },
          {
            path: "verify-phone-email",
            element: <SettingsVerifyEmailPhone />,
          },
          {
            path: "reset-password",
            element: <PasswordResetForm />,
          },
          {
            path: "notifications",
            element: <Notifications />,
          },
          {
            path: "support",
            element: <Support />,
          },
         
        ],
      },
    ],
  },

  // Admin routes
  {
    path: "/admin",
    element: (
      <AdminRoute>
        <NotificationProvider>
          <AdminLayout />
        </NotificationProvider>
      </AdminRoute>
    ),
    children: [
      {
        path: "dashboard",
        element: <AdminDashboard />,
      },
      {
        path: "user-management",
        element: <UserManagement />,
      },
      {
        path: "admin-management",
        element: <AdminManagement />,
      },
      {
        path: "bvn-verification",
        element: <BVNVerification />,
      },
      {
        path: "nin-verification",
        element: <NINVerification />,
      },
      {
        path: "loan-applications",
        element: <LoanApplications />,
      },
      {
        path: "loan-repayment",
        element: <LoanRepaymentManagement />,
      },
      {
        path: "add-repayment",
        element: <AddRepayment />,
      },
      {
        path: "analytics",
        element: <Analytics />,
      },
    ],
  },

  // Fallback
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

export default router;
