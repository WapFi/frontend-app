// import plusIcon from "../../assets/plus icon.svg";
// import { Link } from "react-router-dom";
// import NairaIcon from "../../assets/naira icon.svg";
// import CreditScore from "./CreditScore";
// import calendarIcon from "../../assets/calendar icon.svg";
// import RepaymentsSection from "./RepaymentsSection";

// function New_User_Dashboard({ dashboardData }) {
//   return (
//     <div className="text-[18px] text-[#222] flex flex-col items-end md:items-start md:shrink-0 gap-8 py-4 px-2.5 lg:px-[23px]">
//       <p className="font-raleway font-semibold text-[24px] md:text-[32px] self-start">
//         Dashboard
//       </p>
//       {/* <Overview /> */}
//       <div className="hidden rounded-xl md:flex md:flex-col self-stretch justify-center w-full items-start gap-6 border-[rgba(255,255,255,0.80)] border-1 bg-[#fff] p-6">
//         <p className="font-raleway font-semibold md:text-[24px]">Overview</p>
//         <div className="flex items-start gap-6 self-stretch">
//           <div className="flex flex-col justify-center items-start gap-2.5 py-[22px] px-6 grow shrink-0 basis-0 rounded-xl shadow-sm ring-1 ring-[#ECECEE]">
//             <p className="text-[16px] text-[#888] font-medium">
//               Total Loan Taken
//             </p>
//             <div className="flex items-center gap-2">
//               <img src={NairaIcon} alt="Naira Icon" />
//               <p className="text-[30px]">{dashboardData.totalLoanTaken}</p>
//             </div>
//             <p className="text-[14px] text-[#666]">
//               Last Loan: None – You haven't taken any loans yet
//             </p>
//           </div>

//           <div className="flex flex-col justify-center items-start gap-2.5 py-[22px] px-6 grow shrink-0 basis-0 rounded-xl shadow-sm ring-1 ring-[#ECECEE]">
//             <p className="text-[16px] text-[#888] font-medium">Amount Repaid</p>
//             <div className="flex items-center gap-2">
//               <img src={NairaIcon} alt="Naira Icon" />
//               <p className="text-[30px]">{dashboardData.amountRepaid}</p>
//             </div>
//             <p className="text-[14px] text-[#666]">
//               Repayment History: 0 of 0 completed
//             </p>
//           </div>

//           <div className="flex flex-col justify-center items-start gap-2.5 py-[22px] px-6 grow shrink-0 basis-0 rounded-xl shadow-sm ring-1 ring-[#ECECEE]">
//             <p className="text-[16px] text-[#888] font-medium">Active Loan</p>
//             <div className="flex items-center gap-2">
//               <img src={NairaIcon} alt="Naira Icon" />
//               {/* <p className="text-[30px]">{dashboardData.activeLoan?.loan_amount}</p>
//                */}
//               {dashboardData.activeLoan?.loan_amount ? (
//                 <p className="text-[14px]">
//                   Due by:{" "}
//                   {new Date(
//                     dashboardData.activeLoan.due_date
//                   ).toLocaleDateString("en-US", {
//                     year: "numeric",
//                     month: "short",
//                     day: "numeric",
//                   })}
//                 </p>
//               ) : (
//                 <p className="text-[14px]">Due by: — (No current loan)</p>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="rounded-xl flex flex-col self-stretch justify-center w-full items-start gap-6 border-[rgba(255,255,255,0.80)] border-1 bg-[#fff] p-6">
//         {/* DESKTOP HEADER */}
//         <div className="hidden md:flex justify-between items-start self-stretch w-full">
//           <div className="flex justify-between items-center md:w-[45%] relative">
//             <p className="font-raleway font-semibold md:text-[24px]">
//               Repayments
//             </p>
//             <div className="ml-3.5 relative">
//               <div className="hidden lg:flex lg:items-center gap-2.5 pl-3 shrink-0 rounded-[30px] border border-[rgba(0,0,0,0.08)] bg-[rgba(255,255,255,0.80)]">
//                 <p className="text-[16px] text-[rgba(34,34,34,0.80)] font-medium">
//                   {new Date().toLocaleString("default", {
//                     month: "long",
//                     year: "numeric",
//                   })}
//                 </p>
//                 <span className="block p-4 rounded-[50%] bg-[#E6E6E6] cursor-pointer">
//                   <img src={calendarIcon} alt="calendar icon" />
//                 </span>
//               </div>

//               {showCalendar && (
//                 <div className="absolute left-0 mt-2 z-50 bg-white border p-2 rounded shadow-md">
//                   <input
//                     type="month"
//                     className="text-sm outline-none border-none"
//                   />
//                 </div>
//               )}
//             </div>
//           </div>

//           <div className="md:w-[50%] flex justify-between items-center gap-4">
//             <div className="flex items-center justify-between gap-2.5 pl-3 shrink-0 rounded-[30px] w-full md:w-[60%] border border-[rgba(0,0,0,0.08)] bg-[rgba(255,255,255,0.80)]">
//               <input
//                 type="search"
//                 placeholder="Search Loan ID and Amount...."
//                 className="text-[14px] w-[90%] md:text-[16px] text-[rgba(34,34,34,0.50)] rounded-full bg-transparent outline-none border-none"
//               />
//               <button className="cursor-pointer">
//                 <img src={searchIcon} alt="search icon" />
//               </button>
//             </div>
//             <Link className="text-[14px] md:text-[16px] text-[#2D6157] text-center font-semibold shrink-0">
//               View All
//             </Link>
//           </div>
//         </div>

//         {/* MOBILE HEADER */}
//         <div className="flex flex-col md:hidden w-full">
//           <div className="flex justify-between items-center self-stretch mb-4">
//             <p className="font-raleway font-semibold text-[24px]">Repayment</p>
//             <Link className="text-[14px] md:text-[16px] text-[#2D6157] text-center font-semibold">
//               View All
//             </Link>
//           </div>

//           <div className="flex items-center justify-between gap-2.5 pl-3 shrink-0 rounded-[30px] w-full border border-[rgba(0,0,0,0.08)] bg-[rgba(255,255,255,0.80)]">
//             <input
//               type="search"
//               placeholder="Search Loan ID and Amount...."
//               className="text-[14px] w-[90%] md:text-[16px] text-[rgba(34,34,34,0.50)] rounded-full bg-transparent outline-none border-none"
//             />
//             <button className="cursor-pointer">
//               <img src={searchIcon} alt="search icon" />
//             </button>
//           </div>
//         </div>
//         <div className="text-[18px] flex flex-col justify-center items-center gap-6">
//           <p className="text-[#222] text-center">
//             You haven’t taken any loans yet. Apply now to get started!
//           </p>
//           <button className="cursor-pointer flex justify-center items-center gap-2.5 bg-[#439182] rounded-[40px] py-2.5 px-6">
//             <img src={plusIcon} alt="plus icon" />{" "}
//             <span className="text-white text-[16px] font-medium">
//               Take a Loan
//             </span>
//           </button>
//         </div>
//       </div>

//       <CreditScore userCreditScore={dashboardData.creditScore} />
//     </div>
//   );
// }

// export default New_User_Dashboard;

import { useState, useEffect } from "react";
import plusIcon from "../../assets/plus icon.svg";
import { Link } from "react-router-dom";
import NairaIcon from "../../assets/naira icon.svg";
import CreditScore from "./CreditScore";
import calendarIcon from "../../assets/calendar icon.svg";
import searchIcon from "../../assets/search icon.svg";
import { fetchRepayments } from "../../api/apiData";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

function New_User_Dashboard({ dashboardData }) {
  const navigate = useNavigate();

  const { t } = useTranslation();

  console.log("dasboard data: ", dashboardData);


  const [currentMonth, setCurrentMonth] = useState("");
  const [showActiveLoanModal, setShowActiveLoanModal] = useState(false);

  // --- NEW: Take a Loan Click Handler ---
  const handleTakeLoanClick = () => {
    if (dashboardData?.active_loan) {
      // User has an existing active loan
      setShowActiveLoanModal(true);
    } else if (dashboardData.credit_score.current_score === 0) {
      navigate("/take-a-loan/enter-bvn");
    } else {
      // User is eligible
      navigate("/take-a-loan/form/loan-amount-purpose");
    }
  };

  const loadData = async () => {
    try {
      const res = await fetchRepayments();
      if (res.status) {
        // console.log("from payments: ", res.data);
        // setDashboardData(res.data);
      }
    } catch (error) {
      console.log("Unable to load dashboard. Please try again.");
    }
  };
  loadData();

  useEffect(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    setCurrentMonth(`${year}-${month}`);
  }, []);

  // const handleClick = () => {
  //   setTimeout(() => {
  //     navigate("/enter-bvn");
  //   }, 2000);
  // }

  return (
    <div className="text-[18px] text-[#222] flex flex-col items-end md:items-start md:shrink-0 gap-8 py-4 px-2.5 lg:px-[23px]">
      <p className="font-raleway font-semibold text-[24px] md:text-[32px] self-start">
        {t("newUserDashboard.title")}
      </p>

      <div className="hidden rounded-xl md:flex md:flex-col self-stretch justify-center w-full items-start gap-6 border-[rgba(255,255,255,0.80)] border-1 bg-[#fff] p-6">
        <p className="font-raleway font-semibold md:text-[24px]">
          {t("newUserDashboard.overviewTitle")}
        </p>
        <div className="flex items-start gap-6 self-stretch">
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
      </div>

      <div className="rounded-xl flex flex-col self-stretch justify-center w-full items-start gap-6 border-[rgba(255,255,255,0.80)] border-1 bg-[#fff] p-6">
        {/* DESKTOP HEADER */}
        <div className="hidden md:flex justify-between items-start self-stretch w-full">
          <div className="flex justify-between items-center md:w-[45%] relative">
            <p className="font-raleway font-semibold md:text-[24px]">
              {t("newUserRepayments.title")}
            </p>
            <div className="ml-3.5 relative">
              <div className="hidden lg:flex lg:items-center gap-2.5 pl-3 shrink-0 rounded-[30px] border border-[rgba(0,0,0,0.08)] bg-[rgba(255,255,255,0.80)] opacity-50 cursor-not-allowed">
                <p className="text-[16px] text-[rgba(34,34,34,0.80)] font-medium">
                  {new Date(`${currentMonth}-01`).toLocaleString("default", {
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

        {/* MOBILE HEADER */}
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
            onClick={() => handleTakeLoanClick()}
            className="flex justify-center items-center gap-2.5 bg-[#439182] rounded-[40px] py-2.5 px-6 cursor-pointer hover:opacity-80"
          >
            <img src={plusIcon} alt="plus icon" />
            <span className="text-white text-[16px] font-medium">
              {t("newUserRepayments.ctaButton")}
            </span>
          </button>
        </div>
      </div>

      <CreditScore userCreditScore={dashboardData.credit_score} />

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

export default New_User_Dashboard;
