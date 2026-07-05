import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import PageLoader from "../components/PageLoader";

// Structural components — always needed immediately, not lazy-loaded
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";
import Layout from "../components/dashboard/layout/Layout";
import AdminLayout from "../components/admin/layout/AdminLayout";
import { LoanFormProvider } from "../context/LoanFormContext";
import { DisbursedLoansProvider } from "../context/DisbursedLoansContext";
import { UserContextProvider } from "../context/UserContext";
import { NotificationProvider } from "../context/NotificationContext";

// Lazy-loaded page components
const SplashScreen = lazy(() => import("../components/SplashScreen"));
const SiteLanguage = lazy(() => import("../components/SiteLanguage"));
const SignUpAccountVerification = lazy(() => import("../components/auth/SignUpAccountVerification"));
const SignIn = lazy(() => import("../components/auth/SignIn"));
const SignOut = lazy(() => import("../components/auth/SignOut"));
const ForgotPassword = lazy(() => import("../components/auth/ForgotPassword"));
const VerifyPhoneEmail = lazy(() => import("../components/auth/VerifyPhoneEmail"));
const ChangePassword = lazy(() => import("../components/auth/ChangePassword"));
const LoanDetailsScreenMobile = lazy(() => import("../components/dashboard/LoanDetailsScreenMobile"));
const DashboardWrapper = lazy(() => import("../components/dashboard/DashboardWrapper"));

// Admin pages
const AdminDashboard = lazy(() => import("../components/admin/dashboard/AdminDashboard"));
const UserManagement = lazy(() => import("../components/admin/user-management/UserManagement"));
const AdminManagement = lazy(() => import("../components/admin/admin-management/AdminManagement"));
const BVNVerification = lazy(() => import("../components/admin/kyc/BVNVerification"));
const NINVerification = lazy(() => import("../components/admin/kyc/NINVerification"));
const LoanApplications = lazy(() => import("../components/admin/loans/LoanApplications"));
const LoanRepaymentManagement = lazy(() => import("../components/admin/repayments/LoanRepaymentManagement"));
const AddRepayment = lazy(() => import("../components/admin/repayments/AddRepayment"));
const Analytics = lazy(() => import("../components/admin/analytics/Analytics"));

// Loan flow pages
const LoanFlowWrapper = lazy(() => import("../components/take a loan/LoanFlowWrapper"));
const EnterBVN = lazy(() => import("../components/take a loan/EnterBVN"));
const VerifyPhoneNumber = lazy(() => import("../components/take a loan/VerifyPhoneNumber"));
const Step1LoanAmount = lazy(() => import("../components/take a loan/Step1LoanAmount"));
const Step2BankAccount = lazy(() => import("../components/take a loan/Step2BankAccount"));
const Step3LoanRepayment = lazy(() => import("../components/take a loan/Step3LoanRepayment"));
const Step4Summary = lazy(() => import("../components/take a loan/Step4Summary"));
const LoanRepaymentOverview = lazy(() => import("../components/take a loan/LoanRepaymentOverview"));
const LoanHistory = lazy(() => import("../components/repayments/LoanHistory"));

// Repayments
const RepaymentsHistoryWrapper = lazy(() => import("../components/repayments/RepaymentsHistoryWrapper"));

// Disbursed loans
const DisbursedLoans = lazy(() => import("../components/disbursed loans/DisbursedLoans"));

// Credit score
const CreditScore = lazy(() => import("../components/credit score/CreditScore"));

// Settings
const SettingsWrapper = lazy(() => import("../components/settings/SettingsWrapper"));
const IdentityVerification = lazy(() => import("../components/settings/IdentityVerification"));
const SettingsChangePassword = lazy(() => import("../components/settings/SettingsChangePassword"));
const SettingsForgotPassword = lazy(() => import("../components/settings/SettingsForgotPassword"));
const SettingsVerifyEmailPhone = lazy(() => import("../components/settings/SettingsVerifyEmailPhone"));
const PasswordResetForm = lazy(() => import("../components/settings/PasswordResetForm"));
const Notifications = lazy(() => import("../components/settings/Notifications"));
const Support = lazy(() => import("../components/settings/Support"));

// Tiny helper to avoid repeating Suspense on every route element
const S = ({ children }) => (
  <Suspense fallback={<PageLoader />}>{children}</Suspense>
);

const router = createBrowserRouter([
  // Public routes
  {
    path: "/",
    element: <S><SplashScreen /></S>,
  },
  {
    path: "/select-language",
    element: <S><SiteLanguage /></S>,
  },
  {
    path: "/sign-up",
    element: <S><SignUpAccountVerification /></S>,
  },
  {
    path: "/sign-in",
    element: <S><SignIn /></S>,
  },
  {
  path: "/sign-out",
  element: <S><SignOut /></S>,
  },
  {
    path: "/forgot-password",
    element: <S><ForgotPassword /></S>,
  },
  {
    path: "/change-password",
    element: <S><ChangePassword /></S>,
  },
  {
    path: "/verify-code",
    element: <S><VerifyPhoneEmail /></S>,
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
      {
        path: "dashboard",
        element: <S><DashboardWrapper /></S>,
      },

      // disbursed loans routes
      {
        path: "/loans/disbursed-loans",
        element: (
          <DisbursedLoansProvider>
            <S><DisbursedLoans /></S>
          </DisbursedLoansProvider>
        ),
      },
      {
        path: "/loans/disbursed-loans/:id",
        element: (
          <DisbursedLoansProvider>
            <S><LoanDetailsScreenMobile /></S>
          </DisbursedLoansProvider>
        ),
      },
      {
        path: "/loans/repayments/repayment-history/:id",
        element: <S><RepaymentsHistoryWrapper /></S>
      },
      {
        path: "/loans/history",
        element: <S><LoanHistory /></S>,
      },

      // Loan flow
      {
        path: "take-a-loan/enter-bvn",
        element: <S><EnterBVN /></S>,
      },
      {
        path: "take-a-loan/verify-phone",
        element: <S><VerifyPhoneNumber /></S>,
      },
      {
        path: "take-a-loan/form",
        element: (
          <LoanFormProvider>
            <S><LoanFlowWrapper /></S>
          </LoanFormProvider>
        ),
        children: [
          {
            path: "loan-amount-purpose",
            element: <S><Step1LoanAmount /></S>,
          },
          {
            path: "bank-account-confirmation",
            element: <S><Step2BankAccount /></S>,
          },
          {
            path: "loan-repayment-method",
            element: <S><Step3LoanRepayment /></S>,
          },
          {
            path: "loan-form-summary",
            element: <S><Step4Summary /></S>,
          },
        ],
      },
      {
        path: "take-a-loan/loan-repayment-overview",
        element: (
          <LoanFormProvider>
            <S><LoanRepaymentOverview /></S>
          </LoanFormProvider>
        ),
      },

      // credit score
      {
        path: "/credit-score",
        element: <S><CreditScore /></S>,
      },

      // settings
      {
        path: "settings",
        element: <S><SettingsWrapper /></S>,
        children: [
          {
            path: "identity-verification",
            element: (
              <UserContextProvider>
                <S><IdentityVerification /></S>
              </UserContextProvider>
            ),
          },
          {
            path: "change-password",
            element: <S><SettingsChangePassword /></S>,
          },
          {
            path: "forgot-password",
            element: <S><SettingsForgotPassword /></S>,
          },
          {
            path: "verify-phone-email",
            element: <S><SettingsVerifyEmailPhone /></S>,
          },
          {
            path: "reset-password",
            element: <S><PasswordResetForm /></S>,
          },
          {
            path: "notifications",
            element: <S><Notifications /></S>,
          },
          {
            path: "support",
            element: <S><Support /></S>,
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
        element: <S><AdminDashboard /></S>,
      },
      {
        path: "user-management",
        element: <S><UserManagement /></S>,
      },
      {
        path: "admin-management",
        element: <S><AdminManagement /></S>,
      },
      {
        path: "bvn-verification",
        element: <S><BVNVerification /></S>,
      },
      {
        path: "nin-verification",
        element: <S><NINVerification /></S>,
      },
      {
        path: "loan-applications",
        element: <S><LoanApplications /></S>,
      },
      {
        path: "loan-repayment",
        element: <S><LoanRepaymentManagement /></S>,
      },
      {
        path: "add-repayment",
        element: <S><AddRepayment /></S>,
      },
      {
        path: "analytics",
        element: <S><Analytics /></S>,
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
