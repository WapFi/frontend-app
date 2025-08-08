// import { useNavigate } from "react-router-dom";
// import NairaIcon from "../../assets/naira icon.svg";
// import RepaymentsSection from "./RepaymentsSection";
// import RepaymentProgressBar from "./RepaymentProgressBar";
// import CountdownTimer from "./CountdownTimer";
// import CreditScore from "./CreditScore";
// import Overview from "./Overview";
// import { useTranslation } from "react-i18next";
// import { RepaymentsProvider } from "../../context/RepaymentsContext";

// function Dashboard({ dashboardData }) {
//   const navigate = useNavigate();
//   const { t } = useTranslation();

//   const handleRepaymentHistoryClick = () => {
//     // retrieve loan ID and repayments
//     const loanID = dashboardData.active_loan._id;

//     // navigate to repayments history page and pass the loanID
//     navigate(`/repayments/repayment-history/${loanID}`);
//   };

//   console.log("dashboard data: ", dashboardData);

//   const dueDate = new Date(dashboardData.active_loan.due_date);
//   const targetTime = dueDate.getTime();

//   const initialTimeLeft = dashboardData.active_loan.time_left;

//   return (
//     <div className="text-[18px] text-[#222] flex flex-col items-end md:items-start md:shrink-0 gap-8 py-4 px-2.5 lg:px-[23px]">
//       <p className="font-raleway font-semibold text-[24px] md:text-[32px] self-start">
//         {t("dashboard.title")}
//       </p>

//       {dashboardData.active_loan.status === "DISBURSED" && (
//         <div className="rounded-xl flex flex-col self-start justify-center w-full items-start gap-6 border-[#008F4C] border-[1.2px] bg-[#fff] pt-6 pr-[18px] pb-8 pl-[18px]">
//           {/* <div className="md:flex self-stretch items-center gap-4">
//           <p>Time left to next repayment:</p>
//           <p>Days</p>
//         </div> */}
//           <CountdownTimer
//             targetTime={targetTime}
//             initialDays={initialTimeLeft.days}
//             initialHours={initialTimeLeft.hours}
//             initialMinutes={initialTimeLeft.minutes}
//             initialSeconds={initialTimeLeft.seconds}
//           />
//           <div className="flex flex-col flex-start gap-2">
//             <p>{t("dashboard.outstandingLoanBalance")}</p>
//             {/* <div className="flex items-center gap-2">
//               <img src={NairaIcon} alt="Naira Icon" />
//               <p className="md:text-[24px] font-semibold">
//                 {dashboardData.active_loan.outstanding_balance}
//               </p>
//             </div> */}
//             <div className="flex items-center gap-1">
//               <img src={NairaIcon} alt="naira icon" />
//               <span>
//                 {new Intl.NumberFormat("en-NG", {
//                   style: "decimal",

//                   maximumFractionDigits: 2,
//                 }).format(dashboardData.active_loan.outstanding_balance)}
//               </span>
//             </div>
//           </div>
//           {/* <div className="relative">
//           <p className="absolute left-[71%] md:left-[74%] top-[30%] flex gap-1 items-center font-raleway font-medium text-[#444]">
//             <img src={NairaIcon} alt="naira icon" />
//             <span>20,000</span>
//           </p>
//           <RepaymentProgressBar />
//         </div> */}
//           <div className="w-full">
//             <div className="flex justify-between items-center mb-2">
//               {/* <p className="flex gap-1 items-center font-raleway font-medium text-[#444]">
//               <img src={NairaIcon} alt="naira icon" />
//               <span>20,000</span>
//             </p> */}
//             </div>
//             <RepaymentProgressBar
//               amountRepaid={dashboardData.active_loan.amount_paid}
//               loanAmount={dashboardData.active_loan.loan_amount}
//             />
//           </div>
//           {/* <div className="relative">
//           <p className="absolute left-[71%] md:left-[74%] top-[30%] flex gap-1 items-center font-raleway font-medium text-[#444]">
//             <img src={NairaIcon} alt="naira icon" />
//             <span>20,000</span>
//           </p>
//           <RepaymentProgressBar />
//         </div> */}

//           <button
//             className="text-[14px] flex self-end font-medium text-[#2D6157] cursor-pointer"
//             role="button"
//             tabIndex={0}
//             onClick={() => handleRepaymentHistoryClick()}
//           >
//             {t("dashboard.repaymentHistory")}
//           </button>
//         </div>
//       )}

//       {dashboardData.active_loan.status === "DISBURSED" && (
//         <Overview
//           totalLoanTaken={dashboardData.total_loans_taken}
//           amountRepaid={dashboardData.amount_repaid}
//           activeLoan={dashboardData.active_loan}
//         />
//       )}

//       {/* <RepaymentsSection /> */}
//       <RepaymentsProvider>
//         <RepaymentsSection />
//       </RepaymentsProvider>

//       {/* Credit Score Section */}

//       <CreditScore userCreditScore={dashboardData.credit_score} />
//     </div>
//   );
// }

// export default Dashboard;


import { useNavigate } from "react-router-dom";
import NairaIcon from "../../assets/naira icon.svg";
import RepaymentsSection from "./RepaymentsSection";
import RepaymentProgressBar from "./RepaymentProgressBar";
import CountdownTimer from "./CountdownTimer";
import CreditScore from "./CreditScore";
import Overview from "./Overview"; 
import { useTranslation } from "react-i18next";
import plusIcon from "../../assets/plus icon.svg";
import calendarIcon from "../../assets/calendar icon.svg";
import searchIcon from "../../assets/search icon.svg";
import { Link } from "react-router-dom";
import { use_UserData } from "../../context/UserContext";
import { RepaymentsProvider } from "../../context/RepaymentsContext";
import { useState } from "react";

function Dashboard({ dashboardData }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { userData } = use_UserData();
  const [showActiveLoanModal, setShowActiveLoanModal] = useState(false);

  // REVISED: The condition for a new user
  const isNewUser = dashboardData.credit_score.current_score === 0;

  console.log("dashboard data: ", dashboardData);

  // Handles the "Take a Loan" button click for all user types
  const handleTakeLoanClick = () => {
    if (dashboardData?.active_loan) {
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
      navigate("/take-a-loan/form/loan-amount-purpose");
    }
  };

  const handleRepaymentHistoryClick = () => {
    // retrieve loan ID and repayments
    const loanID = dashboardData.active_loan._id;

    // navigate to repayments history page and pass the loanID
    navigate(`/repayments/repayment-history/${loanID}`);
  };

  // UI elements that are always present or have a consistent structure
  const renderDashboardTitle = () => (
    <p className="font-raleway font-semibold text-[24px] md:text-[32px] self-start">
     {t("dashboard.title")}
    </p>
  );

  const renderOverviewSection = () => {
    if (isNewUser) {
      return (
        <div className="flex items-start gap-6 self-stretch bg-[#fff] p-6 rounded-[12px]">
          <div className="flex flex-col justify-center items-start gap-2.5 py-[22px] px-6 grow shrink-0 basis-0 rounded-xl shadow-sm ring-1 ring-[#ECECEE]">
            <p className="text-[16px] text-[#888] font-medium">
              {t("newUserDashboard.totalLoanTaken")}
            </p>
            <div className="flex items-center gap-2">
              <img src={NairaIcon} alt="Naira Icon" />
              <p className="text-[30px] font-semibold text-[#222]">0.00</p>
            </div>
            <p className="text-[14px] text-[#666]">
              {t("newUserDashboard.lastLoan")}
            </p>
          </div>
          <div className="flex flex-col justify-center items-start gap-2.5 py-[22px] px-6 grow shrink-0 basis-0 rounded-xl shadow-sm ring-1 ring-[#ECECEE]">
            <p className="text-[16px] text-[#888] font-medium">
              {t("newUserDashboard.amountRepaid")}
            </p>
            <div className="flex items-center gap-2">
              <img src={NairaIcon} alt="Naira Icon" />
              <p className="text-[30px] font-semibold text-[#222]">0.00</p>
            </div>
            <p className="text-[14px] text-[#666]">
              {t("newUserDashboard.repaymentHistory")}
            </p>
          </div>
          <div className="flex flex-col justify-center items-start gap-2.5 py-[22px] px-6 grow shrink-0 basis-0 rounded-xl shadow-sm ring-1 ring-[#ECECEE]">
            <p className="text-[16px] text-[#888] font-medium">
              {t("newUserDashboard.activeLoan")}
            </p>
            <div className="flex items-center gap-2">
              <img src={NairaIcon} alt="Naira Icon" />
              <p className="text-[30px] font-semibold text-[#222]">0.00</p>
            </div>
            <p className="text-[14px]">{t("newUserDashboard.dueBy")}</p>
          </div>
        </div>
      );
    }
    // Returning user overview
    return (
      <Overview
        totalLoanTaken={dashboardData.total_loans_taken}
        amountRepaid={dashboardData.amount_repaid}
        activeLoan={dashboardData.active_loan}
        lastLoan={dashboardData.last_loan}
      />
    );
  };

  const renderRepaymentsSection = () => {
    if (isNewUser) {
      return (
        <>
          <div className="hidden md:flex justify-between items-start self-stretch w-full">
            <div className="flex justify-between items-center md:w-[45%] relative">
              <p className="font-raleway font-semibold md:text-[24px]">
                {t("newUserRepayments.title")}
              </p>
              <div className="ml-3.5 relative">
                <div className="hidden lg:flex lg:items-center gap-2.5 pl-3 shrink-0 rounded-[30px] border border-[rgba(0,0,0,0.08)] bg-[rgba(255,255,255,0.80)] opacity-50 cursor-not-allowed">
                  <p className="text-[16px] text-[rgba(34,34,34,0.80)] font-medium">
                    {new Date().toLocaleString("default", {
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <span className="block p-4 rounded-[50%] bg-[#E6E6E6]">
                    <img src={calendarIcon} alt="calendar icon" />
                  </span>
                </div>
              </div>
            </div>
            <div className="md:w-[50%] flex justify-between items-center gap-4">
              <div className="flex items-center justify-between gap-2.5 pl-3 shrink-0 rounded-[30px] w-full md:w-[60%] border border-[rgba(0,0,0,0.08)] bg-[rgba(255,255,255,0.80)] opacity-50 cursor-not-allowed">
                <input
                  type="search"
                  disabled
                  placeholder={t("newUserRepayments.searchPlaceholder")}
                  className="text-[14px] w-[90%] md:text-[16px] text-[rgba(34,34,34,0.50)] rounded-full bg-transparent outline-none border-none"
                />
                <button className="cursor-not-allowed" disabled>
                  <img src={searchIcon} alt="search icon" />
                </button>
              </div>
              <Link
                className="text-[14px] md:text-[16px] text-[#2D6157] text-center font-semibold shrink-0 opacity-50 pointer-events-none"
                onClick={(e) => e.preventDefault()}
              >
                {t("newUserRepayments.viewAll")}
              </Link>
            </div>
          </div>
          <div className="flex flex-col md:hidden w-full">
            <div className="flex justify-between items-center self-stretch mb-4">
              <p className="font-raleway font-semibold text-[24px]">
                {t("newUserRepayments.title")}
              </p>
              <Link
                className="text-[14px] md:text-[16px] text-[#2D6157] text-center font-semibold opacity-50 pointer-events-none"
                onClick={(e) => e.preventDefault()}
              >
                {t("newUserRepayments.viewAll")}
              </Link>
            </div>
            <div className="flex items-center justify-between gap-2.5 pl-3 shrink-0 rounded-[30px] w-full border border-[rgba(0,0,0,0.08)] bg-[rgba(255,255,255,0.80)] opacity-50 cursor-not-allowed">
              <input
                type="search"
                disabled
                placeholder={t("newUserRepayments.searchPlaceholder")}
                className="text-[14px] w-[90%] md:text-[16px] text-[rgba(34,34,34,0.50)] rounded-full bg-transparent outline-none border-none"
              />
              <button className="cursor-not-allowed" disabled>
                <img src={searchIcon} alt="search icon" />
              </button>
            </div>
          </div>
          <div className="w-full text-[18px] flex flex-col justify-center items-center gap-6 py-12 lg:py-20">
            <p className="text-[#222] text-center">
              {t("newUserRepayments.ctaMessage")}
            </p>
            <button
              onClick={handleTakeLoanClick}
              className="flex justify-center items-center gap-2.5 bg-[#439182] rounded-[40px] py-2.5 px-6 cursor-pointer hover:opacity-80"
            >
              <img src={plusIcon} alt="plus icon" />
              <span className="text-white text-[16px] font-medium">
                {t("newUserRepayments.ctaButton")}
              </span>
            </button>
          </div>
        </>
      );
    }
    // Returning user repayments
    return (
      <RepaymentsProvider>
        <RepaymentsSection />
      </RepaymentsProvider>
    );
  };

  // Renders the modal directly in the component
  const renderActiveLoanModal = () => {
    if (showActiveLoanModal) {
      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6 text-center">
            <h2 className="text-xl font-bold mb-4 text-[#2D6157]">
              {t("layout.activeLoanModal.title")}
            </h2>
            <p className="mb-6 text-[#444]">
              {t("layout.activeLoanModal.body")}
            </p>
            <button
              onClick={() => setShowActiveLoanModal(false)}
              className="w-full rounded-[50px] text-white font-medium bg-[#439182] py-2 px-3 hover:opacity-80 transition-opacity duration-300"
            >
              {t("layout.activeLoanModal.button")}
            </button>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="text-[18px] text-[#222] flex flex-col items-end md:items-start md:shrink-0 gap-8 py-4 px-2.5 lg:px-[23px]">
      {renderDashboardTitle()}

      {/* Conditional Rendering for Returning User Loan Info */}
      {!isNewUser && dashboardData.active_loan?.status === "DISBURSED" && (
        <div className="rounded-xl flex flex-col self-start justify-center w-full items-start gap-6 border-[#008F4C] border-[1.2px] bg-[#fff] pt-6 pr-[18px] pb-8 pl-[18px]">
          <CountdownTimer
            targetTime={new Date(dashboardData.active_loan.due_date).getTime()}
            initialDays={dashboardData.active_loan.time_left.days}
            initialHours={dashboardData.active_loan.time_left.hours}
            initialMinutes={dashboardData.active_loan.time_left.minutes}
            initialSeconds={dashboardData.active_loan.time_left.seconds}
          />
          <div className="flex flex-col flex-start gap-2">
            <p>{t("dashboard.outstandingLoanBalance")}</p>
            <div className="flex items-center gap-1">
              <img src={NairaIcon} alt="naira icon" />
              <span>
                {new Intl.NumberFormat("en-NG", {
                  style: "decimal",
                  maximumFractionDigits: 2,
                }).format(dashboardData.active_loan.outstanding_balance)}
              </span>
            </div>
          </div>
          <div className="w-full">
            <RepaymentProgressBar
              amountRepaid={dashboardData.active_loan.amount_paid}
              loanAmount={dashboardData.active_loan.loan_amount}
            />
          </div>
          <button
            className="text-[14px] flex self-end font-medium text-[#2D6157] cursor-pointer"
            role="button"
            tabIndex={0}
            onClick={handleRepaymentHistoryClick}
          >
            {t("dashboard.repaymentHistory")}
          </button>
        </div>
      )}

      {/* Overview Section */}
      
        {renderOverviewSection()}
    

      {/* Repayments Section */}
      <div className="rounded-xl flex flex-col self-stretch justify-center w-full items-start gap-6 border-[rgba(255,255,255,0.80)] border-1 bg-[#fff] p-6">
        {renderRepaymentsSection()}
      </div>

      {/* Credit Score Section */}
      <CreditScore userCreditScore={dashboardData.credit_score} />
      
      {/* Active Loan Modal */}
      {renderActiveLoanModal()}
    </div>
  );
}

export default Dashboard;
