// import { useRepayments } from "../../context/RepaymentsContext";
// import { useDashboard } from "../../context/DashboardContext";
// import { useTranslation } from "react-i18next";
// import LoanDetails from "../dashboard/LoanDetails";
// import RepaymentsList from "../dashboard/RepaymentsList";
// import { useState, useEffect } from "react";
// import { fetchRepayments } from "../../api/apiData";
// import { getLoanDetails } from "../../api/apiData";
// import calendarIcon from "../../assets/calendar icon.svg";
// import searchIcon from "../../assets/search icon.svg";
// import { useNavigate } from "react-router-dom";
// import plusIcon from "../../assets/plus icon.svg";
// import PageLoader from "../PageLoader";
// import { use_UserData } from "../../context/UserContext";

// export default function Repayments() {
//   const navigate = useNavigate();
//   const { t } = useTranslation();
//   const [loanDetails, setLoanDetails] = useState(null);
//   const [selectedLoan, setSelectedLoan] = useState(null);
//   const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024);
//   const [showCalendar, setShowCalendar] = useState(false);
//   const [selectedMonth, setSelectedMonth] = useState("");
//   const { dashboardData, setDashboardData } = useDashboard();

//   const [loading, setLoading] = useState(true);

//   const { repaymentsData, setRepaymentsData } = useRepayments();

//   const [showActiveLoanModal, setShowActiveLoanModal] = useState(false);
//   const { userData } = use_UserData();

//   const handleTakeLoanClick = () => {
//     console.log("user data: ", userData);
//     console.log("dashboard data: ", dashboardData);
//     if (dashboardData?.active_loan?.status === "DISBURSED") {
//       // User has an existing active loan
//       setShowActiveLoanModal(true);
//     } else if (
//       dashboardData?.active_loan?.status === "PENDING" &&
//       userData.phone_verified === true
//     ) {
//       navigate("/take-a-loan/loan-repayment-overview");
//     } else if (dashboardData.credit_score.current_score === 0) {
//       navigate("/take-a-loan/enter-bvn");
//     } else if (userData.phone_verified === false) {
//       navigate("/take-a-loan/verify-phone");
//     } else {
//       // User is eligible
//       navigate("/take-a-loan/form/loan-amount-purpose");
//     }
//   };

//   const getFilteredRepayments = () => {
//     if (!selectedMonth) return repaymentsData;
//     return repaymentsData.filter((repayment) => {
//       const date = new Date(repayment.repayment_date);
//       const monthString = `${date.getFullYear()}-${String(
//         date.getMonth() + 1
//       ).padStart(2, "0")}`;
//       return monthString === selectedMonth;
//     });
//   };

//   useEffect(() => {
//     const loadRepayments = async () => {
//       try {
//         const res = await fetchRepayments();
//         setRepaymentsData(res.status ? res.data.repayments : []);
//       } catch (error) {
//         setRepaymentsData([]);
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadRepayments();
//   }, [setRepaymentsData]);

//   useEffect(() => {
//     const handleResize = () => {
//       setIsLargeScreen(window.innerWidth >= 1024);
//     };

//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   useEffect(() => {
//     // get loan by ID and render loan details
//     const getLoanByID = async (loanID) => {
//       try {
//         const response = await getLoanDetails(loanID);
//         if (response) {
//           setLoanDetails(response.data);
//           console.log("Loan Details: ", response.data);
//         }
//       } catch (error) {
//         console.log("Error: ", error);
//       }
//     };
//     if (selectedLoan) {
//       getLoanByID(selectedLoan);
//     }
//   }, [selectedLoan]);

//   const handleSelectLoan = (loanId) => {
//     setSelectedLoan(loanId);
//   };

//   return (
//     <div className="lg:px-[28px] lg:pt-7">
//       <p className="hidden font-raleway text-[24px] text-[#222] font-semibold lg:text-[32px] lg:block lg:pb-5">
//         {t("repaymentsSection.title")}
//       </p>
//       <div className="rounded-xl flex flex-col self-stretch justify-center items-start gap-6 border-[rgba(255,255,255,0.80)] border-1 lg:bg-[#fff] p-6 lg:mb-14">
//         {/* DESKTOP HEADER */}
//         <div className="hidden lg:flex justify-between items-start self-stretch w-full">
//           <div className="flex justify-between items-center md:w-[65%] relative">
//             <p className="font-raleway font-semibold md:text-[24px]">
//               {t("repaymentsSection.title")}
//             </p>
//             <div className="ml-3.5 relative">
//               <div className="hidden lg:flex lg:items-center gap-2.5 pl-3 shrink-0 rounded-[30px] border border-[rgba(0,0,0,0.08)] bg-[rgba(255,255,255,0.80)]">
//                 <p className="text-[16px] text-[rgba(34,34,34,0.80)] font-medium">
//                   {selectedMonth
//                     ? new Date(`${selectedMonth}-01`).toLocaleString(
//                         "default",
//                         {
//                           month: "long",
//                           year: "numeric",
//                         }
//                       )
//                     : t("repaymentsSection.selectMonth")}
//                 </p>
//                 <span
//                   className="block p-4 rounded-[50%] bg-[#E6E6E6] cursor-pointer"
//                   onClick={() => setShowCalendar((prev) => !prev)}
//                 >
//                   <img src={calendarIcon} alt="calendar icon" />
//                 </span>
//               </div>

//               {showCalendar && (
//                 <div className="absolute left-0 mt-2 z-50 bg-white border p-2 rounded shadow-md">
//                   <input
//                     type="month"
//                     className="text-sm outline-none border-none"
//                     value={selectedMonth}
//                     onChange={(e) => {
//                       setSelectedMonth(e.target.value);
//                       setShowCalendar(false);
//                     }}
//                   />
//                 </div>
//               )}
//             </div>
//           </div>

//           <div className="md:w-[90%] flex justify-end items-center gap-4">
//             <div className="flex items-center justify-between  gap-2.5 pl-3 shrink-0 rounded-[30px] w-full md:w-[60%] border border-[rgba(0,0,0,0.08)] bg-[rgba(255,255,255,0.80)]">
//               <input
//                 type="search"
//                 placeholder={t("repaymentsSection.searchPlaceholder")}
//                 className="text-[14px] w-[90%] md:text-[16px] text-[rgba(34,34,34,0.50)] rounded-full bg-transparent outline-none border-none"
//               />
//               <button className="cursor-pointer">
//                 <img src={searchIcon} alt="search icon" />
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* MOBILE HEADER */}
//         <div className="flex flex-col lg:hidden w-full">
//           <div className="flex justify-between items-center self-stretch mb-8">
//             <p className="font-raleway font-semibold text-[24px]">
//               {t("repaymentsSection.title")}
//             </p>

//             <div className="flex items-center gap-2.5 pl-3 shrink-0 rounded-[30px] border border-[rgba(0,0,0,0.08)] bg-[rgba(255,255,255,0.80)]">
//               <p className="text-[16px] text-[rgba(34,34,34,0.80)] font-medium">
//                 {selectedMonth
//                   ? new Date(`${selectedMonth}-01`).toLocaleString("default", {
//                       month: "long",
//                       year: "numeric",
//                     })
//                   : t("loanDetailsMobile.selectMonth")}
//               </p>
//               <span
//                 className="block p-4 rounded-[50%] bg-[#E6E6E6] cursor-pointer"
//                 onClick={() => setShowCalendar((prev) => !prev)}
//               >
//                 <img src={calendarIcon} alt="calendar icon" />
//               </span>
//             </div>
//           </div>

//           <div className="flex items-center justify-between gap-2.5 pl-3 shrink-0 rounded-[30px] w-full border border-[rgba(0,0,0,0.08)] bg-[rgba(255,255,255,0.80)]">
//             <input
//               type="search"
//               placeholder={t("repaymentsSection.searchPlaceholder")}
//               className="text-[14px] w-[90%] md:text-[16px] text-[rgba(34,34,34,0.50)] rounded-full bg-transparent outline-none border-none"
//             />
//             <button className="cursor-pointer">
//               <img src={searchIcon} alt="search icon" />
//             </button>
//           </div>
//         </div>

//         {/* Repayment Body */}
//         {/* to be displayed when there are repayments */}
//         {loading ? (
//           <PageLoader />
//         ) : repaymentsData.length > 0 ? (
//           <div className="w-full flex items-start justify-between self-start">
//             {isLargeScreen ? (
//               <>
//                 <RepaymentsList
//                   onSelect={handleSelectLoan}
//                   selectedMonth={selectedMonth}
//                 />
//                 {loanDetails && <LoanDetails loanDetails={loanDetails} />}
//               </>
//             ) : (
//               <>
//                 {!loanDetails ? (
//                   <RepaymentsList
//                     onSelect={handleSelectLoan}
//                     selectedMonth={selectedMonth}
//                   />
//                 ) : (
//                   <LoanDetails loanDetails={loanDetails} />
//                 )}
//               </>
//             )}
//           </div>
//         ) : (
//           (!dashboardData.active_loan ||
//             dashboardData.active_loan.status === "PENDING") && (
//             <div className="w-full text-[18px] flex flex-col justify-center items-center gap-6 pt-40 lg:py-40">
//               <p className="text-[#222] text-center">
//                 {t("newUserRepayments.ctaMessage")}
//               </p>
//               <button
//                 onClick={() => handleTakeLoanClick()}
//                 className="flex justify-center items-center gap-2.5 bg-[#439182] rounded-[40px] py-2.5 px-6 cursor-pointer hover:opacity-80"
//               >
//                 <img src={plusIcon} alt="plus icon" />
//                 <span className="text-white text-[16px] font-medium">
//                   {t("newUserRepayments.ctaButton")}
//                 </span>
//               </button>
//             </div>
//           )

//           // <div className="w-full text-[18px] flex flex-col justify-center items-center gap-6 pt-40 lg:py-40">
//           //   <p className="text-[#222] text-center">
//           //     {t("newUserRepayments.ctaMessage")}
//           //   </p>
//           //   <button
//           //     onClick={() => handleTakeLoanClick()}
//           //     className="flex justify-center items-center gap-2.5 bg-[#439182] rounded-[40px] py-2.5 px-6 cursor-pointer hover:opacity-80"
//           //   >
//           //     <img src={plusIcon} alt="plus icon" />
//           //     <span className="text-white text-[16px] font-medium">
//           //       {t("newUserRepayments.ctaButton")}
//           //     </span>
//           //   </button>
//           // </div>
//         )}
//       </div>

//       {/* --- NEW: Modal Overlay for Active Loan --- */}
//       {showActiveLoanModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6 text-center">
//             <h2 className="text-xl font-bold mb-4 text-[#2D6157]">
//               {t("layout.activeLoanModal.title")}
//             </h2>
//             <p className="mb-6 text-[#444]">
//               {t("layout.activeLoanModal.body")}
//             </p>
//             <button
//               onClick={() => {
//                 setShowActiveLoanModal(false);
//                 navigate("/dashboard");
//               }}
//               className="w-full rounded-[50px] text-white font-medium bg-[#439182] py-2 px-3 hover:opacity-80 transition-opacity duration-300"
//             >
//               {t("layout.activeLoanModal.button")}
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import { useRepayments } from "../../context/RepaymentsContext";
import { useDashboard } from "../../context/DashboardContext";
import { useTranslation } from "react-i18next";
import LoanDetails from "../dashboard/LoanDetails";
import RepaymentsList from "../dashboard/RepaymentsList";
import { useState, useEffect } from "react";
import { fetchRepayments } from "../../api/apiData";
import { getLoanDetails } from "../../api/apiData";
import calendarIcon from "../../assets/calendar icon.svg";
import searchIcon from "../../assets/search icon.svg";
import { useNavigate } from "react-router-dom";
import plusIcon from "../../assets/plus icon.svg";
import PageLoader from "../PageLoader";
import { use_UserData } from "../../context/UserContext";
import { Link } from "react-router-dom";

export default function Repayments() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loanDetails, setLoanDetails] = useState(null);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("");
  const { dashboardData, refreshDashboardData } = useDashboard();
  const [loading, setLoading] = useState(true);
  const { repaymentsData, setRepaymentsData } = useRepayments();
  const [showActiveLoanModal, setShowActiveLoanModal] = useState(false);
  const { userData } = use_UserData();

  const handleTakeLoanClick = () => {
    if (dashboardData?.active_loan?.status === "DISBURSED") {
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

  const getFilteredRepayments = () => {
    if (!selectedMonth) return repaymentsData;
    return repaymentsData.filter((repayment) => {
      const date = new Date(repayment.repayment_date);
      const monthString = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;
      return monthString === selectedMonth;
    });
  };

  const filteredRepayments = getFilteredRepayments();
  const hasAnyRepayments = repaymentsData.length > 0;
  const loanIsPendingOrNone =
    !dashboardData.active_loan ||
    dashboardData.pending_loan?.status === "PENDING";

  // useEffect(() => {
  //   const loadRepayments = async () => {
  //     try {
  //       const res = await fetchRepayments();
  //       console.log("list: ", res.data.repayments);
  //       setRepaymentsData(res.status ? res.data.repayments : []);
  //     } catch (error) {
  //       setRepaymentsData([]);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   loadRepayments();
  // }, [setRepaymentsData]);

  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      await refreshDashboardData(); // refresh dashboard data
      const res = await fetchRepayments(); // then fetch repayments
      if (res.status) {
        setRepaymentsData(res.data.repayments);
      } else {
        setRepaymentsData([]);
      }
      setLoading(false);
    };

    loadAllData();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const getLoanByID = async (loanID) => {
      try {
        const response = await getLoanDetails(loanID);
        if (response) {
          setLoanDetails(response.data);
        }
      } catch (error) {
        console.log("Error: ", error);
      }
    };
    if (selectedLoan) {
      getLoanByID(selectedLoan);
    }
  }, [selectedLoan]);

  const handleSelectLoan = (loanId) => {
    setSelectedLoan(loanId);
  };

  return (
    <div className="lg:px-[28px] lg:pt-7">
      <p className="hidden font-raleway text-[24px] text-[#222] font-semibold lg:text-[32px] lg:block lg:pb-5">
        {t("repaymentsSection.title")}
      </p>

      <div className="rounded-xl flex flex-col self-stretch justify-center items-start gap-6 lg:bg-[#fff] p-6 lg:mb-14">
        {/* -- Desktop Header -- */}
        <div className="hidden lg:flex justify-between items-start self-stretch w-full">
          <div className="flex justify-between items-center md:w-[25%] relative">
            {/* <p className="font-raleway font-semibold md:text-[24px]">
              {t("repaymentsSection.title")}
            </p> */}
            <div className="ml-3.5 relative">
              <div className="hidden lg:flex lg:items-center gap-2.5 pl-3 shrink-0 rounded-[30px] border border-[rgba(0,0,0,0.08)] bg-[rgba(255,255,255,0.80)]">
                <p className="text-[16px] text-[rgba(34,34,34,0.80)] font-medium">
                  {selectedMonth
                    ? new Date(`${selectedMonth}-01`).toLocaleString(
                        "default",
                        {
                          month: "long",
                          year: "numeric",
                        }
                      )
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

          <div className="md:w-[90%] flex justify-end items-center gap-4">
            <div className="flex items-center justify-between gap-2.5 pl-3 shrink-0 flex-1 rounded-[30px] w-full md:w-[60%] border border-[rgba(0,0,0,0.08)] bg-[rgba(255,255,255,0.80)]">
              <input
                type="search"
                placeholder={t("repaymentsSection.searchPlaceholder")}
                className="text-[14px] w-[90%] md:text-[16px] text-[rgba(34,34,34,0.50)] rounded-full bg-transparent outline-none border-none"
              />
              <button className="cursor-pointer">
                <img src={searchIcon} alt="search icon" />
              </button>
            </div>
            <Link
              className="text-right text-[18px] text-[#439182] my-4 font-semibold"
              to="/repayments/loans/history"
            >
              Loan History
            </Link>
          </div>
        </div>

        {/* -- Mobile Header -- */}
        <div className="flex flex-col lg:hidden w-full">
          <div className="flex justify-between items-center self-stretch mb-8">
            <p className="font-raleway font-semibold text-[24px]">
              {t("repaymentsSection.title")}
            </p>

            <div className="flex items-center gap-2.5 pl-3 shrink-0 rounded-[30px] border border-[rgba(0,0,0,0.08)] bg-[rgba(255,255,255,0.80)]">
              <p className="text-[16px] text-[rgba(34,34,34,0.80)] font-medium">
                {selectedMonth
                  ? new Date(`${selectedMonth}-01`).toLocaleString("default", {
                      month: "long",
                      year: "numeric",
                    })
                  : t("loanDetailsMobile.selectMonth")}
              </p>
              <span
                className="block p-4 rounded-[50%] bg-[#E6E6E6] cursor-pointer"
                onClick={() => setShowCalendar((prev) => !prev)}
              >
                <img src={calendarIcon} alt="calendar icon" />
              </span>
            </div>
          </div>

          {showCalendar && (
            <div className="mt-2 bg-white border p-2 rounded shadow-md z-50">
              <input
                type="month"
                className="text-sm w-full outline-none border-none"
                value={selectedMonth}
                onChange={(e) => {
                  setSelectedMonth(e.target.value);
                  setShowCalendar(false);
                }}
              />
            </div>
          )}

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
          <Link
            className="text-right md:text-[16px] text-[#439182] my-4 font-semibold"
            to="/repayments/loans/history"
          >
            Loan History
          </Link>
        </div>

        {/* -- Body -- */}
        {loading ? (
          <PageLoader />
        ) : !hasAnyRepayments && loanIsPendingOrNone ? (
          <div className="w-full text-[18px] flex flex-col justify-center items-center gap-6 pt-40 lg:py-40">
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
        ) : (
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
        )}
      </div>

      {/* -- Modal -- */}
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
