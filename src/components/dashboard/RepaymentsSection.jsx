// import React from "react";
// import { Link } from "react-router-dom";
// import calendarIcon from "../../assets/calendar icon.svg";
// import searchIcon from "../../assets/search icon.svg";
// import RepaymentsList from "./RepaymentsList";
// import LoanDetails from "./LoanDetails";
// import No_Loan_Repayment from "./No_Loan_Repayment";

// function RepaymentsSection() {
//   return (
//     <div className="rounded-xl flex flex-col self-stretch justify-center w-full items-start gap-6 border-[rgba(255,255,255,0.80)] border-1 bg-[#fff] p-6">
//       {/* DESKTOP HEADER - Hidden on mobile, flex on md and up */}
//       <div className="hidden md:flex justify-between items-start self-stretch w-full">
//         <div className="flex justify-between items-center md:w-[45%]">
//           <p className="font-raleway font-semibold md:text-[24px]">
//             Repayments
//           </p>

//           <div className="ml-3.5 flex md:items-center gap-2.5 pl-3 shrink-0 rounded-[30px] border border-[rgba(0,0,0,0.08)] bg-[rgba(255,255,255,0.80)]">
//             <p className="text-[16px] text-[rgba(34,34,34,0.80)] font-medium">
//               May 2025
//             </p>
//             <span className="block p-4 rounded-[50%] bg-[#E6E6E6] cursor-pointer">
//               <img src={calendarIcon} alt="calendar icon" />
//             </span>
//           </div>
//         </div>

//         <div className="md:w-[50%] flex justify-between items-center gap-4">
//           <div className="flex items-center justify-between gap-2.5 pl-3 shrink-0 rounded-[30px] w-full md:w-[60%] border border-[rgba(0,0,0,0.08)] bg-[rgba(255,255,255,0.80)]">
//             <input
//               type="search"
//               name=""
//               id=""
//               placeholder="Search Loan ID and Amount...."
//               className="text-[14px] w-[90%] md:text-[16px] text-[rgba(34,34,34,0.50)]"
//             />
//             <button className="cursor-pointer">
//               <img src={searchIcon} alt="search icon" />
//             </button>
//           </div>

//           <Link className="text-[14px] md:text-[16px] text-[#2D6157] text-center font-semibold shrink-0">
//             View All
//           </Link>
//         </div>
//       </div>

//       {/* MOBILE HEADER - Hidden on md and up, flex-col on mobile */}
//       <div className="flex flex-col md:hidden w-full">
//         <div className="flex justify-between items-center self-stretch mb-4">
//           <p className="font-raleway font-semibold text-[24px]">Repayment</p>
//           <Link className="text-[14px] md:text-[16px] text-[#2D6157] text-center font-semibold">
//             View All
//           </Link>
//         </div>

//         <div className="flex items-center justify-between gap-2.5 pl-3 shrink-0 rounded-[30px] w-full border border-[rgba(0,0,0,0.08)] bg-[rgba(255,255,255,0.80)]">
//           <input
//             type="search"
//             name=""
//             id=""
//             placeholder="Search Loan ID and Amount...."
//             className="text-[14px] w-[90%] md:text-[16px] text-[rgba(34,34,34,0.50)]"
//           />
//           <button className="cursor-pointer">
//             <img src={searchIcon} alt="search icon" />
//           </button>
//         </div>
//       </div>

//       <div className="w-full flex items-start justify-between self-start">
//         {/* <div>repayments</div>
//         <div>loan details</div> */}
//         <RepaymentsList />
//       <LoanDetails />
//       </div>
//     </div>
//   );
// }

// export default RepaymentsSection;

// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import calendarIcon from "../../assets/calendar icon.svg";
// import searchIcon from "../../assets/search icon.svg";
// import RepaymentsList from "./RepaymentsList";
// import LoanDetails from "./LoanDetails";

// function RepaymentsSection() {
//   const [selectedLoan, setSelectedLoan] = useState(null);
//   const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024); // lg: 1024px+
//   const [showCalendar, setShowCalendar] = useState(false);

//   useEffect(() => {
//     const handleResize = () => {
//       setIsLargeScreen(window.innerWidth >= 1024);
//     };

//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   const handleSelectLoan = (loanId) => {
//     setSelectedLoan(loanId);
//   };

//   return (
//     <div className="rounded-xl flex flex-col self-stretch justify-center w-full items-start gap-6 border-[rgba(255,255,255,0.80)] border-1 bg-[#fff] p-6">
//       {/* DESKTOP HEADER */}
//       <div className="hidden md:flex justify-between items-start self-stretch w-full">
//         <div className="flex justify-between items-center md:w-[45%]">
//           <p className="font-raleway font-semibold md:text-[24px]">
//             Repayments
//           </p>
//           <div className="ml-3.5 flex md:items-center gap-2.5 pl-3 shrink-0 rounded-[30px] border border-[rgba(0,0,0,0.08)] bg-[rgba(255,255,255,0.80)]">
//             <p className="text-[16px] text-[rgba(34,34,34,0.80)] font-medium">
//               May 2025
//             </p>
//             <span
//               className="block p-4 rounded-[50%] bg-[#E6E6E6] cursor-pointer"
//               onClick={() => setShowCalendar((prev) => !prev)}
//             >
//               <img src={calendarIcon} alt="calendar icon" />
//             </span>
//           </div>
//         </div>
//         {showCalendar && (
//           <input
//             type="month"
//             className="mt-2 border p-2 rounded"
//             onChange={(e) => console.log("Selected:", e.target.value)}
//           />
//         )}

//         <div className="md:w-[50%] flex justify-between items-center gap-4">
//           <div className="flex items-center justify-between gap-2.5 pl-3 shrink-0 rounded-[30px] w-full md:w-[60%] border border-[rgba(0,0,0,0.08)] bg-[rgba(255,255,255,0.80)]">
//             <input
//               type="search"
//               placeholder="Search Loan ID and Amount...."
//               // className="text-[14px] md:text-[16px] text-[rgba(34,34,34,0.50)] block bg-transparent w-full outline-none border-none"
//               className="text-[14px] w-[90%] md:text-[16px] text-[rgba(34,34,34,0.50)] rounded-full bg-transparent outline-none border-none"
//             />
//             <button className="cursor-pointer">
//               <img src={searchIcon} alt="search icon" />
//             </button>
//           </div>
//           <Link className="text-[14px] md:text-[16px] text-[#2D6157] text-center font-semibold shrink-0">
//             View All
//           </Link>
//         </div>
//       </div>

//       {/* MOBILE HEADER */}
//       <div className="flex flex-col md:hidden w-full">
//         <div className="flex justify-between items-center self-stretch mb-4">
//           <p className="font-raleway font-semibold text-[24px]">Repayment</p>
//           <Link className="text-[14px] md:text-[16px] text-[#2D6157] text-center font-semibold">
//             View All
//           </Link>
//         </div>

//         <div className="flex items-center justify-between gap-2.5 pl-3 shrink-0 rounded-[30px] w-full border border-[rgba(0,0,0,0.08)] bg-[rgba(255,255,255,0.80)]">
//           <input
//             type="search"
//             placeholder="Search Loan ID and Amount...."
//             // className="text-[14px] md:text-[16px] text-[rgba(34,34,34,0.50)] bg-transparent w-full outline-none border-none rounded-full"
//             className="text-[14px] w-[90%] md:text-[16px] text-[rgba(34,34,34,0.50)] rounded-full bg-transparent outline-none border-none"
//           />
//           <button className="cursor-pointer">
//             <img src={searchIcon} alt="search icon" />
//           </button>
//         </div>
//       </div>

//       <div className="w-full flex items-start justify-between self-start">
//         {isLargeScreen ? (
//           <>
//             <RepaymentsList onSelect={handleSelectLoan} />
//             {selectedLoan && <LoanDetails />}
//           </>
//         ) : (
//           <>
//             {!selectedLoan ? (
//               <RepaymentsList onSelect={handleSelectLoan} />
//             ) : (
//               <LoanDetails />
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// export default RepaymentsSection;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import calendarIcon from "../../assets/calendar icon.svg";
import searchIcon from "../../assets/search icon.svg";
import RepaymentsList from "./RepaymentsList";
import LoanDetails from "./LoanDetails";
import { fetchRepayments } from "../../api/apiData";
import { useTranslation } from "react-i18next";
import { recordPayment } from "../../api/apiData";
import { getLoanDetails } from "../../api/apiData";
import { useDashboard } from "../../context/DashboardContext";
import { useRepayments } from "../../context/RepaymentsContext";
import PageLoader from "../PageLoader";

function RepaymentsSection() {
  const navigate = useNavigate();
  const { dashboardData, setDashboardData } = useDashboard();
  const { setRepaymentsData } = useRepayments();

  const { t } = useTranslation();

  const [selectedLoan, setSelectedLoan] = useState(null);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [loanDetails, setLoanDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // get loan by ID and render loan details
    const getLoanByID = async (loanID) => {
      try {
        const response = await getLoanDetails(loanID);
        if (response) {
          setLoanDetails(response.data);
          // console.log("Loan Details: ", response.data);
        }
      } catch (error) {
        console.log("Error: ", error);
      }
    };
    if (selectedLoan) {
      getLoanByID(selectedLoan);
    }
  }, [selectedLoan]);

  // useEffect(() => {
  //   const testRecordPayment = async () => {
  //     try {
  //       const response = await recordPayment(dashboardData);
  //       // console.log("I'm here");
  //       if (response) {
  //         // console.log(response.data);
  //       }
  //     } catch (error) {
  //       console.log("Error making payment: ", error);
  //     }

  //     navigate("/dashboard");
  //   };
  //   testRecordPayment();
  // }, []);

  // Get latest repayment month once
  useEffect(() => {
    fetchRepayments()
      .then((res) => {
        if (res.status && res.data.repayments.length > 0) {
          setRepaymentsData(res.data.repayments);
          const sorted = [...res.data.repayments].sort(
            (a, b) => new Date(b.repayment_date) - new Date(a.repayment_date)
          );
          const latestDate = new Date(sorted[0].repayment_date);
          const monthString = `${latestDate.getFullYear()}-${String(
            latestDate.getMonth() + 1
          ).padStart(2, "0")}`;
          setSelectedMonth(monthString);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const handleSelectLoan = (loanId) => {
    setSelectedLoan(loanId);
  };

  if (loading) return <PageLoader />;

  return (
    <div className="rounded-xl flex flex-col self-stretch justify-center w-full items-start gap-6 border-[rgba(255,255,255,0.80)] border-1 bg-[#fff] p-6">
      {/* DESKTOP HEADER */}
      <div className="hidden md:flex justify-between items-start self-stretch w-full">
        <div className="flex justify-between items-center md:w-[45%] relative">
          <p className="font-raleway font-semibold md:text-[24px]">
            {t("repaymentsSection.title")}
          </p>
          <div className="ml-3.5 relative">
            <div className="hidden lg:flex lg:items-center gap-2.5 pl-3 shrink-0 rounded-[30px] border border-[rgba(0,0,0,0.08)] bg-[rgba(255,255,255,0.80)]">
              <p className="text-[16px] text-[rgba(34,34,34,0.80)] font-medium">
                {selectedMonth
                  ? new Date(`${selectedMonth}-01`).toLocaleString("default", {
                      month: "long",
                      year: "numeric",
                    })
                  : t("repaymentsSection.selectMonth")}
              </p>
              <span
                className="block p-4 rounded-[50%] bg-[#E6E6E6] cursor-pointer"
                onClick={() => setShowCalendar((prev) => !prev)}
              >
                <img src={calendarIcon} alt="calendar icon" />
              </span>
            </div>

            {showCalendar && (
              <div className="absolute left-0 mt-2 z-50 bg-white border p-2 rounded shadow-md">
                <input
                  type="month"
                  className="text-sm outline-none border-none"
                  value={selectedMonth}
                  onChange={(e) => {
                    setSelectedMonth(e.target.value);
                    setShowCalendar(false);
                  }}
                />
              </div>
            )}
          </div>
        </div>

        <div className="md:w-[50%] flex justify-between items-center gap-4">
          <div className="flex items-center justify-between gap-2.5 pl-3 shrink-0 rounded-[30px] w-full md:w-[60%] border border-[rgba(0,0,0,0.08)] bg-[rgba(255,255,255,0.80)]">
            <input
              type="search"
              placeholder={t("repaymentsSection.searchPlaceholder")}
              className="text-[14px] w-[90%] md:text-[16px] text-[rgba(34,34,34,0.50)] rounded-full bg-transparent outline-none border-none"
            />
            <button className="cursor-pointer">
              <img src={searchIcon} alt="search icon" />
            </button>
          </div>
          <Link className="text-[14px] md:text-[16px] text-[#2D6157] text-center font-semibold shrink-0">
            {t("repaymentsSection.viewAll")}
          </Link>
        </div>
      </div>

      {/* MOBILE HEADER */}
      <div className="flex flex-col md:hidden w-full">
        <div className="flex justify-between items-center self-stretch mb-4">
          <p className="font-raleway font-semibold text-[24px]">
            {t("repaymentsSection.mobileTitle")}
          </p>
          <Link className="text-[14px] md:text-[16px] text-[#2D6157] text-center font-semibold">
            {t("repaymentsSection.viewAll")}
          </Link>
        </div>

        <div className="flex items-center justify-between gap-2.5 pl-3 shrink-0 rounded-[30px] w-full border border-[rgba(0,0,0,0.08)] bg-[rgba(255,255,255,0.80)]">
          <input
            type="search"
            placeholder={t("repaymentsSection.searchPlaceholder")}
            className="text-[14px] w-[90%] md:text-[16px] text-[rgba(34,34,34,0.50)] rounded-full bg-transparent outline-none border-none"
          />
          <button className="cursor-pointer">
            <img src={searchIcon} alt="search icon" />
          </button>
        </div>
      </div>

      {/* Repayment Body */}
      <div className="w-full flex items-start justify-between self-start">
        {isLargeScreen ? (
          <>
            <RepaymentsList
              onSelect={handleSelectLoan}
              selectedMonth={selectedMonth}
            />
            {loanDetails && <LoanDetails loanDetails={loanDetails} />}
          </>
        ) : (
          <>
            {!loanDetails ? (
              <RepaymentsList
                onSelect={handleSelectLoan}
                selectedMonth={selectedMonth}
              />
            ) : (
              <LoanDetails loanDetails={loanDetails} />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default RepaymentsSection;
