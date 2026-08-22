import { lazy, Suspense, useEffect } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import PageLoader from "../components/PageLoader";

// Structural components — always needed immediately, not lazy-loaded
import AdminLayout from "../components/admin/layout/AdminLayout";
import SignOut from "../components/auth/SignOut";
import Layout from "../components/dashboard/layout/Layout";
import LazyLoadErrorBoundary from "../components/LazyLoadErrorBoundary";
import { DisbursedLoansProvider } from "../context/DisbursedLoansContext";
import { LoanFormProvider } from "../context/LoanFormContext";
import { NotificationProvider } from "../context/NotificationContext";
import { UserContextProvider } from "../context/UserContext";
import AdminRoute from "./AdminRoute";
import PrivateRoute from "./PrivateRoute";

// Lazy-loaded page components
const SplashScreen = lazy(() => import("../components/SplashScreen"));
const SiteLanguage = lazy(() => import("../components/SiteLanguage"));
const SignUpAccountVerification = lazy(
  () => import("../components/auth/SignUpAccountVerification"),
);
const SignIn = lazy(() => import("../components/auth/SignIn"));
// const SignOut = lazy(() => import("../components/auth/SignOut"));
const ForgotPassword = lazy(() => import("../components/auth/ForgotPassword"));
const VerifyPhoneEmail = lazy(
  () => import("../components/auth/VerifyPhoneEmail"),
);
const ChangePassword = lazy(() => import("../components/auth/ChangePassword"));
const LoanDetailsScreenMobile = lazy(
  () => import("../components/dashboard/LoanDetailsScreenMobile"),
);
const DashboardWrapper = lazy(
  () => import("../components/dashboard/DashboardWrapper"),
);

// Admin pages
const AdminDashboard = lazy(
  () => import("../components/admin/dashboard/AdminDashboard"),
);
const UserManagement = lazy(
  () => import("../components/admin/user-management/UserManagement"),
);
const AdminManagement = lazy(
  () => import("../components/admin/admin-management/AdminManagement"),
);
const Sponsors = lazy(() => import("../components/admin/funding/Sponsors"));
const Funds = lazy(() => import("../components/admin/funding/Funds"));
const FundLedger = lazy(() => import("../components/admin/funding/FundLedger"));
const BVNVerification = lazy(
  () => import("../components/admin/kyc/BVNVerification"),
);
const NINVerification = lazy(
  () => import("../components/admin/kyc/NINVerification"),
);
const LoanApplications = lazy(
  () => import("../components/admin/loans/LoanApplications"),
);
const LoanRepaymentManagement = lazy(
  () => import("../components/admin/repayments/LoanRepaymentManagement"),
);
const AddRepayment = lazy(
  () => import("../components/admin/repayments/AddRepayment"),
);
const Analytics = lazy(() => import("../components/admin/analytics/Analytics"));

// Loan flow pages
const LoanFlowWrapper = lazy(
  () => import("../components/take a loan/LoanFlowWrapper"),
);
// const EnterBVN = lazy(() => import("../components/take a loan/EnterBVN"));
// const VerifyPhoneNumber = lazy(
//   () => import("../components/take a loan/VerifyPhoneNumber"),
// );
const Step1LoanAmount = lazy(
  () => import("../components/take a loan/Step1LoanAmount"),
);
const Step2BankAccount = lazy(
  () => import("../components/take a loan/Step2BankAccount"),
);
const Step3LoanRepayment = lazy(
  () => import("../components/take a loan/Step3LoanRepayment"),
);
const Step4Summary = lazy(
  () => import("../components/take a loan/Step4Summary"),
);
const LoanRepaymentOverview = lazy(
  () => import("../components/take a loan/LoanRepaymentOverview"),
);
const LoanHistory = lazy(() => import("../components/repayments/LoanHistory"));

// Repayments
const RepaymentsHistoryWrapper = lazy(
  () => import("../components/repayments/RepaymentsHistoryWrapper"),
);

// Disbursed loans
const DisbursedLoans = lazy(
  () => import("../components/disbursed loans/DisbursedLoans"),
);

// Credit score
const CreditScore = lazy(
  () => import("../components/credit score/CreditScore"),
);

// Settings
const SettingsWrapper = lazy(
  () => import("../components/settings/SettingsWrapper"),
);
const IdentityVerification = lazy(
  () => import("../components/settings/IdentityVerification"),
);
const SettingsChangePassword = lazy(
  () => import("../components/settings/SettingsChangePassword"),
);
const SettingsForgotPassword = lazy(
  () => import("../components/settings/SettingsForgotPassword"),
);
const SettingsVerifyEmailPhone = lazy(
  () => import("../components/settings/SettingsVerifyEmailPhone"),
);
const PasswordResetForm = lazy(
  () => import("../components/settings/PasswordResetForm"),
);
const Notifications = lazy(
  () => import("../components/settings/Notifications"),
);
const Support = lazy(() => import("../components/settings/Support"));

// // Tiny helper to avoid repeating Suspense on every route element
// const S = ({ children }) => (
//   <Suspense fallback={<PageLoader />}>{children}</Suspense>
// );

const S = ({ children }) => (
  <LazyLoadErrorBoundary>
    <Suspense fallback={<PageLoader />}>{children}</Suspense>
  </LazyLoadErrorBoundary>
);

const PageTitle = ({ title, children }) => {
  useEffect(() => {
    document.title = `${title} | Wapfi`;
  }, [title]);

  return children;
};

const router = createBrowserRouter([
  // Public routes
  {
    path: "/",
    element: (
      <PageTitle title="Welcome">
        <S>
          <SplashScreen />
        </S>
      </PageTitle>
    ),
  },
  {
    path: "/select-language",
    element: (
      <PageTitle title="Select Language">
        <S>
          <SiteLanguage />
        </S>
      </PageTitle>
    ),
  },
  {
    path: "/sign-up",
    element: (
      <PageTitle title="Sign Up">
        <S>
          <SignUpAccountVerification />
        </S>
      </PageTitle>
    ),
  },
  {
    path: "/sign-in",
    element: (
      <PageTitle title="Sign In">
        <S>
          <SignIn />
        </S>
      </PageTitle>
    ),
  },
  {
    path: "/sign-out",
    element: (
      <PageTitle title="Signing Out">
        <S>
          <SignOut />
        </S>
      </PageTitle>
    ),
  },
  {
    path: "/forgot-password",
    element: (
      <PageTitle title="Forgot Password">
        <S>
          <ForgotPassword />
        </S>
      </PageTitle>
    ),
  },
  {
    path: "/change-password",
    element: (
      <PageTitle title="Change Password">
        <S>
          <ChangePassword />
        </S>
      </PageTitle>
    ),
  },
  {
    path: "/verify-code",
    element: (
      <PageTitle title="Verify Code">
        <S>
          <VerifyPhoneEmail />
        </S>
      </PageTitle>
    ),
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
        element: (
          <PageTitle title="Dashboard">
            <S>
              <DashboardWrapper />
            </S>
          </PageTitle>
        ),
      },

      // disbursed loans routes
      {
        path: "/loans/disbursed-loans",
        element: (
          <PageTitle title="Disbursed Loans">
            <DisbursedLoansProvider>
              <S>
                <DisbursedLoans />
              </S>
            </DisbursedLoansProvider>
          </PageTitle>
        ),
      },
      {
        path: "/loans/disbursed-loans/:id",
        element: (
          <PageTitle title="Loan Details">
            <DisbursedLoansProvider>
              <S>
                <LoanDetailsScreenMobile />
              </S>
            </DisbursedLoansProvider>
          </PageTitle>
        ),
      },
      {
        path: "/loans/repayments/repayment-history/:id",
        element: (
          <PageTitle title="Repayment History">
            <S>
              <RepaymentsHistoryWrapper />
            </S>
          </PageTitle>
        ),
      },
      {
        path: "/loans/history",
        element: (
          <PageTitle title="Loan History">
            <S>
              <LoanHistory />
            </S>
          </PageTitle>
        ),
      },

      // TEMPORARY PILOT BYPASS:
      // Redirect identity-verification routes to Step 1 until BVN/phone verification is restored.

      // Loan flow
      // {
      //   path: "take-a-loan/enter-bvn",
      //   element: (
      //     <PageTitle title="Enter BVN">
      //       <S>
      //         <EnterBVN />
      //       </S>
      //     </PageTitle>
      //   ),
      // },
      {
        path: "take-a-loan/enter-bvn",
        element: (
          <Navigate to="/take-a-loan/form/loan-amount-purpose" replace />
        ),
      },
      // {
      //   path: "take-a-loan/verify-phone",
      //   element: (
      //     <PageTitle title="Verify Phone">
      //       <S>
      //         <VerifyPhoneNumber />
      //       </S>
      //     </PageTitle>
      //   ),
      // },
      {
        path: "take-a-loan/verify-phone",
        element: (
          <Navigate to="/take-a-loan/form/loan-amount-purpose" replace />
        ),
      },
      {
        path: "take-a-loan/form",
        element: (
          <LoanFormProvider>
            <S>
              <LoanFlowWrapper />
            </S>
          </LoanFormProvider>
        ),
        children: [
          {
            path: "loan-amount-purpose",
            element: (
              <PageTitle title="Loan Amount & Purpose">
                <S>
                  <Step1LoanAmount />
                </S>
              </PageTitle>
            ),
          },
          {
            path: "bank-account-confirmation",
            element: (
              <PageTitle title="Bank Account Confirmation">
                <S>
                  <Step2BankAccount />
                </S>
              </PageTitle>
            ),
          },
          {
            path: "loan-repayment-method",
            element: (
              <PageTitle title="Loan Repayment Method">
                <S>
                  <Step3LoanRepayment />
                </S>
              </PageTitle>
            ),
          },
          {
            path: "loan-form-summary",
            element: (
              <PageTitle title="Loan Summary">
                <S>
                  <Step4Summary />
                </S>
              </PageTitle>
            ),
          },
        ],
      },
      {
        path: "take-a-loan/loan-repayment-overview",
        element: (
          <PageTitle title="Loan Repayment Overview">
            <LoanFormProvider>
              <S>
                <LoanRepaymentOverview />
              </S>
            </LoanFormProvider>
          </PageTitle>
        ),
      },

      // credit score
      {
        path: "/credit-score",
        element: (
          <PageTitle title="Credit Score">
            <S>
              <CreditScore />
            </S>
          </PageTitle>
        ),
      },

      // settings
      {
        path: "settings",
        element: (
          <S>
            <SettingsWrapper />
          </S>
        ),
        children: [
          {
            path: "identity-verification",
            element: (
              <PageTitle title="Identity Verification">
                <UserContextProvider>
                  <S>
                    <IdentityVerification />
                  </S>
                </UserContextProvider>
              </PageTitle>
            ),
          },
          {
            path: "change-password",
            element: (
              <PageTitle title="Settings - Change Password">
                <S>
                  <SettingsChangePassword />
                </S>
              </PageTitle>
            ),
          },
          {
            path: "forgot-password",
            element: (
              <PageTitle title="Settings - Forgot Password">
                <S>
                  <SettingsForgotPassword />
                </S>
              </PageTitle>
            ),
          },
          {
            path: "verify-phone-email",
            element: (
              <PageTitle title="Settings - Verify Code">
                <S>
                  <SettingsVerifyEmailPhone />
                </S>
              </PageTitle>
            ),
          },
          {
            path: "reset-password",
            element: (
              <PageTitle title="Settings - Reset Password">
                <S>
                  <PasswordResetForm />
                </S>
              </PageTitle>
            ),
          },
          {
            path: "notifications",
            element: (
              <PageTitle title="Notifications">
                <S>
                  <Notifications />
                </S>
              </PageTitle>
            ),
          },
          {
            path: "support",
            element: (
              <PageTitle title="Support">
                <S>
                  <Support />
                </S>
              </PageTitle>
            ),
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
        element: (
          <PageTitle title="Admin Dashboard">
            <S>
              <AdminDashboard />
            </S>
          </PageTitle>
        ),
      },
      {
        path: "user-management",
        element: (
          <PageTitle title="User Management">
            <S>
              <UserManagement />
            </S>
          </PageTitle>
        ),
      },
      {
        path: "admin-management",
        element: (
          <PageTitle title="Admin Management">
            <S>
              <AdminManagement />
            </S>
          </PageTitle>
        ),
      },
      {
        path: "sponsors",
        element: (
          <PageTitle title="Sponsors">
            <S>
              <Sponsors />
            </S>
          </PageTitle>
        ),
      },
      {
        path: "funds",
        element: (
          <PageTitle title="Funds">
            <S>
              <Funds />
            </S>
          </PageTitle>
        ),
      },
      {
        path: "funds/:fundId/ledger",
        element: (
          <PageTitle title="Fund Ledger">
            <S>
              <FundLedger />
            </S>
          </PageTitle>
        ),
      },
      {
        path: "bvn-verification",
        element: (
          <PageTitle title="BVN Verification">
            <S>
              <BVNVerification />
            </S>
          </PageTitle>
        ),
      },
      {
        path: "nin-verification",
        element: (
          <PageTitle title="NIN Verification">
            <S>
              <NINVerification />
            </S>
          </PageTitle>
        ),
      },
      {
        path: "loan-applications",
        element: (
          <PageTitle title="Loan Applications">
            <S>
              <LoanApplications />
            </S>
          </PageTitle>
        ),
      },
      {
        path: "loan-repayment",
        element: (
          <PageTitle title="Loan Repayment Management">
            <S>
              <LoanRepaymentManagement />
            </S>
          </PageTitle>
        ),
      },
      {
        path: "add-repayment",
        element: (
          <PageTitle title="Add Repayment">
            <S>
              <AddRepayment />
            </S>
          </PageTitle>
        ),
      },
      {
        path: "analytics",
        element: (
          <PageTitle title="Analytics">
            <S>
              <Analytics />
            </S>
          </PageTitle>
        ),
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
