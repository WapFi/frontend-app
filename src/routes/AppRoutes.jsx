// import { Routes, Route, Navigate } from "react-router-dom";

// import SplashScreen from "../components/SplashScreen";
// import SiteLanguage from "../components/SiteLanguage";
// import SignUpAccountVerification from "../components/auth/SignUpAccountVerification";
// import SignIn from "../components/auth/SignIn";
// import ForgotPassword from "../components/auth/ForgotPassword";
// import VerifyPhoneEmail from "../components/auth/VerifyPhoneEmail";
// import ChangePassword from "../components/auth/ChangePassword";
// import Layout from "../components/dashboard/layout/Layout";
// // import Dashboard from "../components/dashboard/Dashboard";
// import LoanDetailsScreenMobile from "../components/dashboard/LoanDetailsScreenMobile";
// import PrivateRoute from "./PrivateRoute";
// import DashboardWrapper from "../components/dashboard/DashboardWrapper";
// import EnterBVN from "../components/take a loan/EnterBVN";
// import VerifyPhoneNumber from "../components/take a loan/VerifyPhoneNumber";
// import Step1LoanAmount from "../components/take a loan/Step1LoanAmount";
// import Step2BankAccount from "../components/take a loan/Step2BankAccount";

// function AppRoutes() {
//   return (
//     <Routes>
//       {/* Public routes */}
//       <Route path="/" element={<SplashScreen />} />
//       <Route path="/select-language" element={<SiteLanguage />} />
//       <Route path="/sign-up" element={<SignUpAccountVerification />} />
//       <Route path="/sign-in" element={<SignIn />} />
//       <Route path="/forgot-password" element={<ForgotPassword />} />
//       <Route path="/change-password" element={<ChangePassword />} />
//       <Route path="/verify-code" element={<VerifyPhoneEmail />} />
//       {/* <Route path="/enter-bvn" element={<EnterBVN />} /> */}

//       {/* Protected layout shell for dashboard routes */}

//       <Route
//         path=""
//         element={
//           <PrivateRoute>
//             <Layout />
//           </PrivateRoute>
//         }
//       >
//         <Route path="/dashboard" element={<DashboardWrapper />} />
//         <Route path="/repayments/:id" element={<LoanDetailsScreenMobile />} />
//         <Route path="/take-a-loan/enter-bvn" element={<EnterBVN />} />
//         <Route path="/take-a-loan/verify-phone" element={<VerifyPhoneNumber />} />
//         <Route path="/take-a-loan/loan-amount-purpose" element={<Step1LoanAmount />} />
//         <Route path="/take-a-loan/bank-account-confirmation" element={<Step2BankAccount />} />
//       </Route>

//       {/* Fallback route */}
//       <Route path="*" element={<Navigate to="/" replace />} />
//     </Routes>
//   );
// }

// export default AppRoutes;

// import { Routes, Route, Navigate } from "react-router-dom";

// import SplashScreen from "../components/SplashScreen";
// import SiteLanguage from "../components/SiteLanguage";
// import SignUpAccountVerification from "../components/auth/SignUpAccountVerification";
// import SignIn from "../components/auth/SignIn";
// import ForgotPassword from "../components/auth/ForgotPassword";
// import VerifyPhoneEmail from "../components/auth/VerifyPhoneEmail";
// import ChangePassword from "../components/auth/ChangePassword";
// import Layout from "../components/dashboard/layout/Layout";
// import LoanDetailsScreenMobile from "../components/dashboard/LoanDetailsScreenMobile";
// import PrivateRoute from "./PrivateRoute";
// import DashboardWrapper from "../components/dashboard/DashboardWrapper";

// // Loan form steps
// import { LoanFormProvider } from "../context/LoanFormContext";
// import LoanFlowWrapper from "../components/take a loan/LoanFlowWrapper";
// import EnterBVN from "../components/take a loan/EnterBVN";
// import VerifyPhoneNumber from "../components/take a loan/VerifyPhoneNumber";
// import Step1LoanAmount from "../components/take a loan/Step1LoanAmount";
// import Step2BankAccount from "../components/take a loan/Step2BankAccount";
// import Step3LoanRepayment from "../components/take a loan/Step3LoanRepayment";
// import Step4Summary from "../components/take a loan/Step4Summary";
// // import CancelApplicationModal from "../components/take a loan/CancelApplicationModal";

// function AppRoutes() {
//   return (
//     <Routes>
//       {/* Public routes */}
//       <Route path="/" element={<SplashScreen />} />
//       <Route path="/select-language" element={<SiteLanguage />} />
//       <Route path="/sign-up" element={<SignUpAccountVerification />} />
//       <Route path="/sign-in" element={<SignIn />} />
//       <Route path="/forgot-password" element={<ForgotPassword />} />
//       <Route path="/change-password" element={<ChangePassword />} />
//       <Route path="/verify-code" element={<VerifyPhoneEmail />} />

//       {/* Protected layout shell for dashboard + loan routes */}
//       <Route
//         path=""
//         element={
//           <PrivateRoute>
//             <Layout />
//           </PrivateRoute>
//         }
//       >
//         {/* Dashboard home */}
//         <Route path="/dashboard" element={<DashboardWrapper />} />
//         <Route path="/repayments/:id" element={<LoanDetailsScreenMobile />} />

//         {/* Loan flow */}
//         <Route path="/take-a-loan/enter-bvn" element={<EnterBVN />} />
//         <Route
//           path="/take-a-loan/verify-phone"
//           element={<VerifyPhoneNumber />}
//         />
//         {/* <Route
//           path="/take-a-loan/cancel-application"
//           element={<CancelApplicationModal />}
//         /> */}
//         <Route
//           path="/take-a-loan/form"
//           element={
//             <LoanFormProvider>
//               <LoanFlowWrapper />
//             </LoanFormProvider>
//           }
//         >
//           <Route path="loan-amount-purpose" element={<Step1LoanAmount />} />
//           <Route
//             path="bank-account-confirmation"
//             element={<Step2BankAccount />}
//           />
//           <Route
//             path="loan-repayment-method"
//             element={<Step3LoanRepayment />}
//           />
//           <Route path="loan-form-summary" element={<Step4Summary />} />
//         </Route>
//       </Route>

//       {/* Fallback */}
//       <Route path="*" element={<Navigate to="/" replace />} />
//     </Routes>
//   );
// }

// export default AppRoutes;

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
import DashboardWrapper from "../components/dashboard/DashboardWrapper";

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
// import LoanApprovalModal from "../components/take a loan/LoanApprovalModal";

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
        <Layout />
      </PrivateRoute>
    ),
    children: [
      // Dashboard home
      {
        path: "dashboard",
        element: <DashboardWrapper />,
      },
      {
        path: "repayments/:id",
        element: <LoanDetailsScreenMobile />,
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
        ],
      },
      {
        path: "take-a-loan/loan-repayment-overview",
        element: <LoanRepaymentOverview />,
      },
      // {
      //   path: "take-a-loan/loan-approval-modal",
      //   element: <LoanApprovalModal />,
      // },
    ],
  },

  // Fallback
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

export default router;
