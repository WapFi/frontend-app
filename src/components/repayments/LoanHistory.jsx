// import searchIcon from "../../assets/search icon.svg";
// import calendarIcon from "../../assets/calendar icon.svg";
// import { useTranslation } from "react-i18next";
// import NairaIcon from "../../assets/naira icon.svg";
// import VerifiedIcon from "../../assets/verified icon.svg";
// import FailedIcon from "../../assets/failed icon.svg";
// import PendingIcon from "../../assets/pending icon.svg";
// import OverdueIcon from "../../assets/overdue icon.svg";
// import chevronDown from "../../assets/chevron-down.svg";
// import PageLoader from "../PageLoader";
// import { fetchLoans } from "../../api/apiData";

// import { useState, useEffect } from "react";

// export default function LoanHistory() {
//   const { t } = useTranslation();
//   const [showCalendar, setShowCalendar] = useState(false);
//   const [selectedMonth, setSelectedMonth] = useState("");

//   const [loans, setLoans] = useState([]); // Raw loans fetched from API for the current page
//   // const [filteredLoans, setFilteredLoans] = useState([]); // Loans after client-side filtering (search/month)
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // Pagination states
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalLoans, setTotalLoans] = useState(0);

//   // State for "Per page" dropdown visibility
//   const [showPerPageDropdown, setShowPerPageDropdown] = useState(false);

//   // Per page options as per API limit doc (10, max 100)
//   const perPageOptions = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

//   // 1. State to track if we are in mobile view
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 768); // Initialize based on current width

//   // 2. useEffect to add and remove event listener for window resize
//   useEffect(() => {
//     const handleResize = () => {
//       // Update isMobile state whenever the window is resized
//       setIsMobile(window.innerWidth < 768);
//     };

//     // Add event listener when component mounts
//     window.addEventListener("resize", handleResize);

//     // Remove event listener when component unmounts to prevent memory leaks
//     return () => {
//       window.removeEventListener("resize", handleResize);
//     };
//   }, []);

//   useEffect(() => {
//     // fetch loan history when dependency array items change
//     const getLoans = async () => {
//       setLoading(true);
//       try {
//         const response = await fetchLoans(currentPage, itemsPerPage);
//         console.log(response);
//         if (response.status === true) {
//           setLoans(response.data?.loans);
//           setTotalLoans(response.data?.total_loans);
//           setTotalPages(response.data?.total_pages);
//         } else {
//           setError(response.data?.message);
//         }
//       } catch (error) {
//         setError(error.response?.data?.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     getLoans();
//   }, [currentPage, itemsPerPage]);

//   if (loading) {
//     return <PageLoader />;
//   }

//   // Pagination Handlers
//   const handlePreviousPage = () => {
//     setCurrentPage((prev) => Math.max(prev - 1, 1));
//   };

//   const handleNextPage = () => {
//     setCurrentPage((prev) => Math.min(prev + 1, totalPages));
//   };

//   const handlePerPageChange = (value) => {
//     setItemsPerPage(value);
//     setCurrentPage(1); // reset to page 1 when changing items per page
//     setShowPerPageDropdown(false);
//   };

//   return (
//     <div className="w-[95%] mx-auto  md:w-[90%] lg:px-6">
//       {/* HEADER - Renders differently based on screen size */}
//       {isMobile ? (
//         // Mobile Header
//         <div>
//           <div className="flex justify-between items-center mb-6 relative">
//             <p className="font-raleway font-semibold text-[#222] text-[24px]">
//               Loan History
//             </p>

//             <div className="ml-3.5 relative">
//               <div className="flex items-center gap-2.5 pl-3 shrink-0 rounded-[30px] border border-[rgba(0,0,0,0.08)] bg-[rgba(255,255,255,0.80)]">
//                 <p className="text-[16px] text-[rgba(34,34,34,0.80)] font-medium">
//                   {selectedMonth
//                     ? new Date(`${selectedMonth}-01`).toLocaleString(
//                         "default",
//                         {
//                           month: "long",
//                           year: "numeric",
//                         }
//                       )
//                     : t("loanDetailsMobile.selectMonth")}
//                 </p>
//                 <span
//                   className="block p-4 rounded-[50%] bg-[#E6E6E6] cursor-pointer"
//                   onClick={() => setShowCalendar((prev) => !prev)}
//                 >
//                   <img src={calendarIcon} alt="calendar icon" />
//                 </span>
//               </div>

//               {showCalendar && (
//                 <input
//                   type="month"
//                   value={selectedMonth}
//                   onChange={(e) => {
//                     setSelectedMonth(e.target.value);
//                     setShowCalendar(false);
//                   }}
//                   className="absolute right-0 mt-2 z-50 bg-white border rounded w-[160px] h-[40px] text-sm"
//                 />
//               )}
//             </div>
//           </div>
//           <div className="flex items-center justify-between mb-5 gap-2.5 pl-3 flex-1 shrink-0 rounded-[30px] w-full border border-[rgba(0,0,0,0.08)] bg-[rgba(255,255,255,0.80)]">
//             <input
//               type="search"
//               placeholder={t("repaymentsSection.searchPlaceholder")}
//               className="text-[14px] w-[90%] md:text-[16px] text-[rgba(34,34,34,0.50)] rounded-full bg-transparent outline-none border-none"
//             />
//             <button className="cursor-pointer">
//               <img src={searchIcon} alt="search icon" />
//             </button>
//           </div>
//           {error && <p className="text-red-500 mb-3 text-center">{error}</p>}
//         </div>
//       ) : (
//         // Desktop Header
//         <div>
//           <p className="font-raleway font-semibold md:text-[24px] text-[#222] md:my-7 lg:my-10">
//             Loan History
//           </p>
//           {error && <p className="text-red-500 mb-3 text-center">{error}</p>}
//         </div>
//       )}
//       {/* LOAN LISTINGS - Conditional Rendering */}
//       {isMobile ? (
//         // Mobile View (Stacked Cards)
//         <div className="flex flex-col gap-4">
//           {loans.map((loan) => (
//             <div
//               key={loan._id}
//               className="bg-white rounded-[12px] p-4 text-[#222] font-medium"
//             >
//               <div className="flex justify-between items-center mb-2">
//                 <span>Loan Amount:</span>
//                 <div className="flex items-center gap-1">
//                   <img src={NairaIcon} alt="naira icon" />
//                   <span className="text-[#484747] font-normal">
//                     {new Intl.NumberFormat("en-NG").format(loan.loan_amount)}
//                   </span>
//                 </div>
//               </div>
//               <div className="flex justify-between items-center mb-2">
//                 <span>Status:</span>
//                 {loan.status === "DISBURSED" && (
//                   <div className="text-[#16A34A] bg-[#F2FDF5] border border-[#D3F3DF] rounded-md text-sm md:text-sm flex gap-0.5 w-fit py-0.5 px-1.5">
//                     <img src={VerifiedIcon} alt="disbursed loan icon" />
//                     <span className="capitalize">
//                       {loan.status.toLowerCase()}
//                     </span>
//                   </div>
//                 )}

//                 {loan.status === "REPAID" && (
//                   <div className="text-[#16A34A] bg-[#F2FDF5] border border-[#D3F3DF] rounded-md text-sm md:text-sm flex gap-0.5 w-fit py-0.5 px-1.5">
//                     <img src={VerifiedIcon} alt="repaid loan icon" />
//                     <span className="capitalize">
//                       {loan.status.toLowerCase()}
//                     </span>
//                   </div>
//                 )}

//                 {loan.status === "OVERDUE" && (
//                   <div className="text-[#B91C1C] bg-[rgba(185,28,28,0.14)] border border-[rgba(185,28,28,0.60)] rounded-md text-sm md:text-sm flex gap-0.5 w-fit py-0.5 px-1.5">
//                     <img src={OverdueIcon} alt="overdue loan icon" />
//                     <span className="capitalize">
//                       {loan.status.toLowerCase()}
//                     </span>
//                   </div>
//                 )}

//                 {loan.status === "REJECTED" && (
//                   <div className="text-[#EF4444] bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.15)] rounded-md text-sm md:text-sm flex gap-0.5 w-fit py-0.5 px-1.5">
//                     <img src={FailedIcon} alt="rejected loan icon" />
//                     <span className="capitalize">
//                       {loan.status.toLowerCase()}
//                     </span>
//                   </div>
//                 )}

//                 {loan.status === "PENDING" && (
//                   <div className="text-[#D99100] bg-[rgba(217,145,0,0.14)] border border-[rgba(217,145,0,0.60)] rounded-md text-sm md:text-sm flex gap-0.5 w-fit py-0.5 px-1.5">
//                     <img src={PendingIcon} alt="pending loan icon" />
//                     <span>{loan.status.toLowerCase()}</span>
//                   </div>
//                 )}
//               </div>
//               <div className="flex justify-between items-center mb-2">
//                 <span>Applied On:</span>
//                 <span className="font-normal">
//                   {(() => {
//                     const date = new Date(loan.application_date);
//                     const day = date.toLocaleDateString("en-NG", {
//                       day: "numeric",
//                     });
//                     const month = date.toLocaleDateString("en-NG", {
//                       month: "short",
//                     });
//                     const year = date.toLocaleDateString("en-NG", {
//                       year: "numeric",
//                     });
//                     return `${day} ${month}, ${year}`;
//                   })()}
//                 </span>
//               </div>
//               <div className="flex justify-between items-center mb-2">
//                 <span>Amount Repaid:</span>
//                 <div className="flex items-center gap-1">
//                   <img src={NairaIcon} alt="naira icon" />

//                   <span className="font-normal">
//                     {new Intl.NumberFormat("en-NG").format(loan.amount_paid)}
//                   </span>
//                 </div>
//               </div>
//               <div className="flex justify-between items-center">
//                 <span>Method:</span>
//                 <span className="font-normal">{loan.repayment_method}</span>
//               </div>
//             </div>
//           ))}
//           {/* Placeholder for individual loan cards (mobile) */}
//         </div>
//       ) : (
//         // Desktop View (Table)
//         <div className="bg-white rounded-[18px] py-6 px-4 overflow-x-auto font-medium">
//           <div className="flex justify-between gap-4 md:gap-6 lg:gap-9 py-5">
//             <div className="relative">
//               <div className="flex items-center gap-2.5 pl-3 shrink-0 rounded-[30px] border border-[rgba(0,0,0,0.08)] bg-[rgba(255,255,255,0.80)]">
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
//             <div className="flex items-center justify-between gap-2.5 pl-3 flex-1 shrink-0 rounded-[30px] w-full md:w-[60%] border border-[rgba(0,0,0,0.08)] bg-[rgba(255,255,255,0.80)]">
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
//           <table className="min-w-full divide-y">
//             {/* column headings */}
//             <thead className="border-b-[#E6E6E6]">
//               <tr>
//                 <th
//                   scope="col"
//                   className="px-6 py-3 text-left text-[18px] font-medium text-[#222] capitalize tracking-wider"
//                 >
//                   Loan Amount
//                 </th>
//                 <th
//                   scope="col"
//                   className="px-6 py-3 text-left text-[18px] font-medium text-[#222] capitalize tracking-wider"
//                 >
//                   Status
//                 </th>
//                 <th
//                   scope="col"
//                   className="px-6 py-3 text-left text-[18px] font-medium text-[#222] capitalize tracking-wider"
//                 >
//                   Applied On
//                 </th>
//                 <th
//                   scope="col"
//                   className="px-6 py-3 text-left text-[18px] font-medium text-[#222] capitalize tracking-wider"
//                 >
//                   Amount Repaid
//                 </th>
//                 <th
//                   scope="col"
//                   className="px-6 py-3 text-left text-[18px] font-medium text-[#222] capitalize tracking-wider"
//                 >
//                   Method
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y text-[#484747] font-medium text-[18px]">
//               {/* Placeholder for table rows (desktop) */}
//               {loans.map((loan) => (
//                 <tr className="h-20" key={loan._id}>
//                   <td className="px-6 py-4 whitespace-nowrap text-[18px]">
//                     <div className="flex items-center gap-1">
//                       <img src={NairaIcon} alt="naira icon" />
//                       <span>
//                         {new Intl.NumberFormat("en-NG").format(
//                           loan.loan_amount
//                         )}
//                       </span>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     {loan.status === "DISBURSED" && (
//                       <div className="text-[#16A34A] bg-[#F2FDF5] border border-[#D3F3DF] rounded-md text-sm md:text-sm flex gap-0.5 w-fit py-0.5 px-1.5">
//                         <img src={VerifiedIcon} alt="disbursed loan icon" />
//                         <span className="capitalize">
//                           {loan.status.toLowerCase()}
//                         </span>
//                       </div>
//                     )}

//                     {loan.status === "REPAID" && (
//                       <div className="text-[#16A34A] bg-[#F2FDF5] border border-[#D3F3DF] rounded-md text-sm md:text-sm flex gap-0.5 w-fit py-0.5 px-1.5">
//                         <img src={VerifiedIcon} alt="repaid loan icon" />
//                         <span className="capitalize">
//                           {loan.status.toLowerCase()}
//                         </span>
//                       </div>
//                     )}

//                     {loan.status === "OVERDUE" && (
//                       <div className="text-[#B91C1C] bg-[rgba(185,28,28,0.14)] border border-[rgba(185,28,28,0.60)] rounded-md text-sm md:text-sm flex gap-0.5 w-fit py-0.5 px-1.5">
//                         <img src={OverdueIcon} alt="overdue loan icon" />
//                         <span className="capitalize">
//                           {loan.status.toLowerCase()}
//                         </span>
//                       </div>
//                     )}

//                     {loan.status === "REJECTED" && (
//                       <div className="text-[#EF4444] bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.15)] rounded-md text-sm md:text-sm flex gap-0.5 w-fit py-0.5 px-1.5">
//                         <img src={FailedIcon} alt="rejected loan icon" />
//                         <span className="capitalize">
//                           {loan.status.toLowerCase()}
//                         </span>
//                       </div>
//                     )}

//                     {loan.status === "PENDING" && (
//                       <div className="text-[#D99100] bg-[rgba(217,145,0,0.14)] border border-[rgba(217,145,0,0.60)] rounded-md text-sm md:text-sm flex gap-0.5 w-fit py-0.5 px-1.5">
//                         <img src={PendingIcon} alt="pending loan icon" />
//                         <span>{loan.status.toLowerCase()}</span>
//                       </div>
//                     )}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     {(() => {
//                       const date = new Date(loan.application_date);
//                       const day = date.toLocaleDateString("en-NG", {
//                         day: "numeric",
//                       });
//                       const month = date.toLocaleDateString("en-NG", {
//                         month: "short",
//                       });
//                       const year = date.toLocaleDateString("en-NG", {
//                         year: "numeric",
//                       });
//                       return `${day} ${month}, ${year}`;
//                     })()}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="flex items-center gap-1">
//                       <img src={NairaIcon} alt="naira icon" />
//                       <span>
//                         {new Intl.NumberFormat("en-NG").format(
//                           loan.amount_paid
//                         )}
//                       </span>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     {loan.repayment_method}
//                   </td>
//                 </tr>
//               ))}
//               {/* You would map over your actual loan data here to render multiple rows */}
//             </tbody>
//           </table>
//         </div>
//       )}
//       {/* PAGINATION - Common for both mobile and desktop */}

//       <div className="flex items-center justify-between mt-4">
//         <button
//           onClick={handlePreviousPage}
//           disabled={currentPage === 1 || loading}
//           className="text-sm border cursor-pointer px-3 py-1.5 rounded-[8px] bg-white border-[rgba(0,0,0,0.16)] text-[#333] font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
//         >
//           Previous
//         </button>

//         <div className="relative">
//           <div
//             className="flex items-center gap-2 rounded-[8px] bg-white border border-[#e5e5e5] px-3 cursor-pointer"
//             onClick={() => setShowPerPageDropdown(!showPerPageDropdown)}
//           >
//             <p className="text-[#999] text-sm py-1">Per page</p>
//             <span className="text-[#333] block border-l border-l-[#e5e5e5] pl-2.5 py-1">
//               {itemsPerPage}
//             </span>
//             <img
//               src={chevronDown}
//               alt="dropdown icon"
//               className={`ml-1 w-4 block transition-transform duration-200 ${
//                 showPerPageDropdown ? "rotate-180" : "rotate-0"
//               }`}
//             />
//           </div>

//           {showPerPageDropdown && (
//             <div className="absolute top-full left-0 mb-1 bg-white border rounded shadow z-10 w-full max-h-48 overflow-y-auto">
//               {perPageOptions.map((num) => (
//                 <div
//                   key={num}
//                   className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
//                   onClick={() => handlePerPageChange(num)}
//                 >
//                   {num}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         <button
//           onClick={handleNextPage}
//           disabled={currentPage === totalPages || loading}
//           className="text-sm border cursor-pointer px-3 py-1.5 rounded-[8px] bg-white border-[rgba(0,0,0,0.16)] text-[#333] font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// }

import searchIcon from "../../assets/search icon.svg";
import calendarIcon from "../../assets/calendar icon.svg";
import { useTranslation } from "react-i18next";
import NairaIcon from "../../assets/naira icon.svg";
import VerifiedIcon from "../../assets/verified icon.svg";
import FailedIcon from "../../assets/failed icon.svg";
import PendingIcon from "../../assets/pending icon.svg";
import OverdueIcon from "../../assets/overdue icon.svg";
import chevronDown from "../../assets/chevron-down.svg";
import PageLoader from "../PageLoader";
import { fetchLoans } from "../../api/apiData";
import plusIcon from "../../assets/plus icon.svg";
import { use_UserData } from "../../context/UserContext";
import { useDashboard } from "../../context/DashboardContext";

import { useState, useEffect } from "react";

export default function LoanHistory() {
  const { t } = useTranslation();

  const { userData, refreshUserData } = use_UserData();
  const { dashboardData, refreshDashboardData } = useDashboard();

  const [showCalendar, setShowCalendar] = useState(false);

  // Initialize selectedMonth with the current month and year
  const getCurrentMonthYear = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-indexed
    return `${year}-${month}`;
  };
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthYear());

  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLoans, setTotalLoans] = useState(0);

  const [showPerPageDropdown, setShowPerPageDropdown] = useState(false);
  const perPageOptions = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    refreshUserData();
    refreshDashboardData();
  }, [refreshUserData, refreshDashboardData]);

  useEffect(() => {
    const getLoans = async () => {
      setLoading(true);
      setError(null); // Clear previous errors on new fetch attempt
      try {
        const response = await fetchLoans(currentPage, itemsPerPage);
        console.log(response);

        if (response.status === true) {
          setLoans(response.data?.loans || []);
          setTotalLoans(response.data?.total_loans);
          setTotalPages(response.data?.total_pages);
        } else {
          setError(response.data?.message);
        }
      } catch (error) {
        setError(error.response?.data?.message);
      } finally {
        setLoading(false);
      }
    };
    getLoans();
  }, [currentPage, itemsPerPage]);

  if (loading) {
    return <PageLoader />;
  }

  // Define a reusable date formatting function
  const formatLoanDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);

    const day = date.toLocaleDateString("en-NG", { day: "numeric" });
    const month = date.toLocaleDateString("en-NG", { month: "short" });
    const year = date.toLocaleDateString("en-NG", { year: "numeric" });

    // Manually construct the string with the desired comma
    return `${day} ${month}, ${year}`;
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
    setShowPerPageDropdown(false);
  };

  const handleTakeLoanClick = () => {
    if (
      dashboardData?.pending_loan?.status === "PENDING" &&
      userData.phone_verified === true
    ) {
      navigate("/take-a-loan/loan-repayment-overview");
    } else if (userData.bvn_verified === false) {
      navigate("/take-a-loan/enter-bvn");
    } else if (userData.phone_verified === false) {
      navigate("/take-a-loan/verify-phone");
    } else {
      navigate("/take-a-loan/form/loan-amount-purpose");
    }
  };

  return (
    <div className="w-[95%] mx-auto md:w-[90%] lg:px-6">
      {/* HEADER - Renders differently based on screen size */}
      {isMobile ? (
        // Mobile Header
        <div>
          <div className="flex justify-between items-center mb-6 relative">
            <p className="font-raleway font-semibold text-[#222] text-[24px]">
              Loan History
            </p>

            <div className="ml-3.5 relative">
              <div className="flex items-center gap-2.5 pl-3 shrink-0 rounded-[30px] border border-[rgba(0,0,0,0.08)] bg-[rgba(255,255,255,0.80)]">
                <p className="text-[16px] text-[rgba(34,34,34,0.80)] font-medium">
                  {new Date(`${selectedMonth}-01`).toLocaleString("default", {
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <span
                  className="block p-4 rounded-[50%] bg-[#E6E6E6] cursor-pointer"
                  onClick={() => setShowCalendar((prev) => !prev)}
                >
                  <img src={calendarIcon} alt="calendar icon" />
                </span>
              </div>

              {showCalendar && (
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => {
                    setSelectedMonth(e.target.value);
                    setShowCalendar(false);
                  }}
                  className="absolute right-0 mt-2 z-50 bg-white border rounded w-[160px] h-[40px] text-sm"
                />
              )}
            </div>
          </div>
          <div className="flex items-center justify-between mb-5 gap-2.5 pl-3 flex-1 shrink-0 rounded-[30px] w-full border border-[rgba(0,0,0,0.08)] bg-[rgba(255,255,255,0.80)]">
            <input
              type="search"
              placeholder={t("repaymentsSection.searchPlaceholder")}
              className="text-[14px] w-[90%] md:text-[16px] text-[rgba(34,34,34,0.50)] rounded-full bg-transparent outline-none border-none"
            />
            <button className="cursor-pointer">
              <img src={searchIcon} alt="search icon" />
            </button>
          </div>
          {error && <p className="text-red-500 mb-3 text-center">{error}</p>}
        </div>
      ) : (
        // Desktop Header
        <div>
          <p className="font-raleway font-semibold md:text-[24px] text-[#222] md:my-7 lg:my-10">
            Loan History
          </p>
          {error && <p className="text-red-500 mb-3 text-center">{error}</p>}
        </div>
      )}

      {/* Conditional Rendering for Loan Listings or No Loans Message */}
      {totalLoans > 0 ? (
        // If there are loans, render the listing (table/cards)
        isMobile ? (
          // Mobile View (Stacked Cards)
          <div className="flex flex-col gap-4">
            {loans.map((loan) => (
              <div
                key={loan._id}
                className="bg-white rounded-[12px] p-4 text-[#222] font-medium"
              >
                <div className="flex justify-between items-center mb-2">
                  <span>Loan Amount:</span>
                  <div className="flex items-center gap-1">
                    <img src={NairaIcon} alt="naira icon" />
                    <span className="text-[#484747] font-normal">
                      {new Intl.NumberFormat("en-NG").format(loan.loan_amount)}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span>Status:</span>
                  {loan.status === "DISBURSED" && (
                    <div className="text-[#16A34A] bg-[#F2FDF5] border border-[#D3F3DF] rounded-md text-sm md:text-sm flex gap-0.5 w-fit py-0.5 px-1.5">
                      <img src={VerifiedIcon} alt="disbursed loan icon" />
                      <span className="capitalize">
                        {loan.status.toLowerCase()}
                      </span>
                    </div>
                  )}
                  {loan.status === "REPAID" && (
                    <div className="text-[#16A34A] bg-[#F2FDF5] border border-[#D3F3DF] rounded-md text-sm md:text-sm flex gap-0.5 w-fit py-0.5 px-1.5">
                      <img src={VerifiedIcon} alt="repaid loan icon" />
                      <span className="capitalize">
                        {loan.status.toLowerCase()}
                      </span>
                    </div>
                  )}
                  {loan.status === "OVERDUE" && (
                    <div className="text-[#B91C1C] bg-[rgba(185,28,28,0.14)] border border-[rgba(185,28,28,0.60)] rounded-md text-sm md:text-sm flex gap-0.5 w-fit py-0.5 px-1.5">
                      <img src={OverdueIcon} alt="overdue loan icon" />
                      <span className="capitalize">
                        {loan.status.toLowerCase()}
                      </span>
                    </div>
                  )}
                  {loan.status === "REJECTED" && (
                    <div className="text-[#EF4444] bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.15)] rounded-md text-sm md:text-sm flex gap-0.5 w-fit py-0.5 px-1.5">
                      <img src={FailedIcon} alt="rejected loan icon" />
                      <span className="capitalize">
                        {loan.status.toLowerCase()}
                      </span>
                    </div>
                  )}
                  {loan.status === "PENDING" && (
                    <div className="text-[#D99100] bg-[rgba(217,145,0,0.14)] border border-[rgba(217,145,0,0.60)] rounded-md text-sm md:text-sm flex gap-0.5 w-fit py-0.5 px-1.5">
                      <img src={PendingIcon} alt="pending loan icon" />
                      <span>{loan.status.toLowerCase()}</span>
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span>Applied On:</span>
                  <span className="font-normal">
                    {formatLoanDate(loan.application_date)}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span>Amount Repaid:</span>
                  <div className="flex items-center gap-1">
                    <img src={NairaIcon} alt="naira icon" />
                    <span className="font-normal">
                      {new Intl.NumberFormat("en-NG").format(loan.amount_paid)}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Method:</span>
                  <span className="font-normal">{loan.repayment_method}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Desktop View (Table)
          <div className="bg-white rounded-[18px] py-6 px-4 overflow-x-auto font-medium">
            <div className="flex justify-between gap-4 md:gap-6 lg:gap-9 py-5">
              <div className="relative">
                <div className="flex items-center gap-2.5 pl-3 shrink-0 rounded-[30px] border border-[rgba(0,0,0,0.08)] bg-[rgba(255,255,255,0.80)]">
                  <p className="text-[16px] text-[rgba(34,34,34,0.80)] font-medium">
                    {new Date(`${selectedMonth}-01`).toLocaleString("default", {
                      month: "long",
                      year: "numeric",
                    })}
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
              <div className="flex items-center justify-between gap-2.5 pl-3 flex-1 shrink-0 rounded-[30px] w-full md:w-[60%] border border-[rgba(0,0,0,0.08)] bg-[rgba(255,255,255,0.80)]">
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
            <table className="min-w-full divide-y">
              {/* column headings */}
              <thead className="border-b-[#E6E6E6]">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-[18px] font-medium text-[#222] capitalize tracking-wider"
                  >
                    Loan Amount
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-[18px] font-medium text-[#222] capitalize tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-[18px] font-medium text-[#222] capitalize tracking-wider"
                  >
                    Applied On
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-[18px] font-medium text-[#222] capitalize tracking-wider"
                  >
                    Amount Repaid
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-[18px] font-medium text-[#222] capitalize tracking-wider"
                  >
                    Method
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y text-[#484747] font-medium text-[18px]">
                {loans.map((loan) => (
                  <tr className="h-20" key={loan._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-[18px]">
                      <div className="flex items-center gap-1">
                        <img src={NairaIcon} alt="naira icon" />
                        <span>
                          {new Intl.NumberFormat("en-NG").format(
                            loan.loan_amount
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {loan.status === "DISBURSED" && (
                        <div className="text-[#16A34A] bg-[#F2FDF5] border border-[#D3F3DF] rounded-md text-sm md:text-sm flex gap-0.5 w-fit py-0.5 px-1.5">
                          <img src={VerifiedIcon} alt="disbursed loan icon" />
                          <span className="capitalize">
                            {loan.status.toLowerCase()}
                          </span>
                        </div>
                      )}
                      {loan.status === "REPAID" && (
                        <div className="text-[#16A34A] bg-[#F2FDF5] border border-[#D3F3DF] rounded-md text-sm md:text-sm flex gap-0.5 w-fit py-0.5 px-1.5">
                          <img src={VerifiedIcon} alt="repaid loan icon" />
                          <span className="capitalize">
                            {loan.status.toLowerCase()}
                          </span>
                        </div>
                      )}
                      {loan.status === "OVERDUE" && (
                        <div className="text-[#B91C1C] bg-[rgba(185,28,28,0.14)] border border-[rgba(185,28,28,0.60)] rounded-md text-sm md:text-sm flex gap-0.5 w-fit py-0.5 px-1.5">
                          <img src={OverdueIcon} alt="overdue loan icon" />
                          <span className="capitalize">
                            {loan.status.toLowerCase()}
                          </span>
                        </div>
                      )}
                      {loan.status === "REJECTED" && (
                        <div className="text-[#EF4444] bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.15)] rounded-md text-sm md:text-sm flex gap-0.5 w-fit py-0.5 px-1.5">
                          <img src={FailedIcon} alt="rejected loan icon" />
                          <span className="capitalize">
                            {loan.status.toLowerCase()}
                          </span>
                        </div>
                      )}
                      {loan.status === "PENDING" && (
                        <div className="text-[#D99100] bg-[rgba(217,145,0,0.14)] border border-[rgba(217,145,0,0.60)] rounded-md text-sm md:text-sm flex gap-0.5 w-fit py-0.5 px-1.5">
                          <img src={PendingIcon} alt="pending loan icon" />
                          <span>{loan.status.toLowerCase()}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatLoanDate(loan.application_date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <img src={NairaIcon} alt="naira icon" />
                        <span>
                          {new Intl.NumberFormat("en-NG").format(
                            loan.amount_paid
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {loan.repayment_method}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : (
        // If no loans, show the message, but only if not loading and no error
        !loading &&
        !error && (
          <div className="w-full text-[18px] flex flex-col justify-center items-center gap-6 py-12 lg:py-20">
            <p className="text-[#222] text-center">
              You haven't taken any loans yet.
            </p>
            <button
              onClick={() => handleTakeLoanClick()}
              className="flex justify-center items-center gap-2.5 bg-[#439182] rounded-[40px] py-2.5 px-6 cursor-pointer hover:opacity-80"
            >
              <img src={plusIcon} alt="plus icon" />
              <span className="text-white text-[16px] font-medium">
                Take a Loan
              </span>
            </button>
          </div>
        )
      )}

      {/* PAGINATION - Common for both mobile and desktop - Only show if there are loans */}
      {totalLoans > 0 && (
        <div className="flex items-center justify-between mt-4">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1 || loading}
            className="text-sm border cursor-pointer px-3 py-1.5 rounded-[8px] bg-white border-[rgba(0,0,0,0.16)] text-[#333] font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <div className="relative">
            <div
              className="flex items-center gap-2 rounded-[8px] bg-white border border-[#e5e5e5] px-3 cursor-pointer"
              onClick={() => setShowPerPageDropdown(!showPerPageDropdown)}
            >
              <p className="text-[#999] text-sm py-1">Per page</p>
              <span className="text-[#333] block border-l border-l-[#e5e5e5] pl-2.5 py-1">
                {itemsPerPage}
              </span>
              <img
                src={chevronDown}
                alt="dropdown icon"
                className={`ml-1 w-4 block transition-transform duration-200 ${
                  showPerPageDropdown ? "rotate-180" : "rotate-0"
                }`}
              />
            </div>

            {showPerPageDropdown && (
              <div className="absolute top-full left-0 mt-1 bg-white border rounded shadow z-10 w-full max-h-48 overflow-y-auto">
                {perPageOptions.map((num) => (
                  <div
                    key={num}
                    className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                    onClick={() => handlePerPageChange(num)}
                  >
                    {num}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages || loading}
            className="text-sm border cursor-pointer px-3 py-1.5 rounded-[8px] bg-white border-[rgba(0,0,0,0.16)] text-[#333] font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
