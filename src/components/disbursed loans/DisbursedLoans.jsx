// import { useDisbursedLoans } from "../../context/DisbursedLoansContext";
// import { useDashboard } from "../../context/DashboardContext";
// import { useTranslation } from "react-i18next";
// import LoanDetails from "../dashboard/LoanDetails";
// import DisbursedLoansList from "../dashboard/DisbursedLoansList";
// import { useState, useEffect } from "react";
// import { fetchLoans, getLoanDetails } from "../../api/apiData";
// import calendarIcon from "../../assets/calendar icon.svg";
// import searchIcon from "../../assets/search icon.svg";
// import { useNavigate, Link } from "react-router-dom";
// import plusIcon from "../../assets/plus icon.svg";
// import PageLoader from "../PageLoader";
// import { use_UserData } from "../../context/UserContext";
// import chevronDown from "../../assets/chevron-down.svg";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

// const useDebounce = (value, delay) => {
//   const [debouncedValue, setDebouncedValue] = useState(value);
//   useEffect(() => {
//     const timer = setTimeout(() => setDebouncedValue(value), delay);
//     return () => clearTimeout(timer);
//   }, [value, delay]);
//   return debouncedValue;
// };

// export default function DisbursedLoans() {
//   const navigate = useNavigate();
//   const { t } = useTranslation();
//   const { dashboardData, refreshDashboardData } = useDashboard();
//   const { setDisbursedLoansData } = useDisbursedLoans();
//   const { userData } = use_UserData();

//   const [loanDetails, setLoanDetails] = useState(null);
//   const [selectedLoan, setSelectedLoan] = useState(null);
//   const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024);
//   const [searchPlaceholder, setSearchPlaceholder] = useState(
//     t("repaymentsSection.searchPlaceholder")
//   );

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // filters
//   const [startDate, setStartDate] = useState(null);
//   const [endDate, setEndDate] = useState(null);
//   const [searchQuery, setSearchQuery] = useState("");
//   const debouncedSearchQuery = useDebounce(searchQuery, 300);

//   // pagination
//   const [disbursedLoans, setDisbursedLoans] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalDisbursedLoans, setTotalDisbursedLoans] = useState(0);
//   const [showPerPageDropdown, setShowPerPageDropdown] = useState(false);
//   const perPageOptions = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
//   const [dataLoaded, setDataLoaded] = useState(false);

//   const [showActiveLoanModal, setShowActiveLoanModal] = useState(false);

//   const hasAnyDisbursedLoans = totalDisbursedLoans > 0;
//   const isNewUser = dashboardData.total_loans_taken === 0;
//   const noDisbursedLoans = dataLoaded && !loading && disbursedLoans.length === 0;

//   const formatDate = (date) => {
//     if (!date) return null;
//     return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
//       2,
//       "0"
//     )}-${String(date.getDate()).padStart(2, "0")}`;
//   };

//   const loadDisbursedLoans = async (filters = {}) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await fetchLoans(currentPage, itemsPerPage, {
//         ...filters,
//         status: "COMPLETED,DISBURSED",
//       });
//       if (res?.status) {
//         const list = res.data?.loans || [];
//         setDisbursedLoans(list);
//         setDisbursedLoansData(list);
//         setTotalDisbursedLoans(res.data?.total_loans || 0);
//         setTotalPages(res.data?.total_pages || 1);
//       } else {
//         setError(res?.message);
//         setDisbursedLoans([]);
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || "An error occurred");
//       setDisbursedLoans([]);
//     } finally {
//       setLoading(false);
//       setDataLoaded(true);
//     }
//   };

//   useEffect(() => {
//     loadDisbursedLoans();
//   }, [currentPage, itemsPerPage]);

//   useEffect(() => {
//     refreshDashboardData();
//   }, [refreshDashboardData]);

//   useEffect(() => {
//     const handleResize = () => setIsLargeScreen(window.innerWidth >= 1024);
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   useEffect(() => {
//     const getLoanByID = async (loanID) => {
//       try {
//         const res = await getLoanDetails(loanID);
//         if (res?.status) setLoanDetails(res.data);
//       } catch (err) {
//         console.log("Error: ", err);
//       }
//     };
//     if (selectedLoan) getLoanByID(selectedLoan);
//   }, [selectedLoan]);

//   const handleApplyFilters = () => {
//     const filters = {};
//     if (debouncedSearchQuery.trim())
//       filters.query = debouncedSearchQuery.trim();
//     if (startDate && endDate) {
//       filters.startDate = formatDate(startDate);
//       filters.endDate = formatDate(endDate);
//     }
//     setCurrentPage(1);
//     loadDisbursedLoans(filters);
//   };

//   const handleClearFilters = () => {
//     setSearchQuery("");
//     setStartDate(null);
//     setEndDate(null);
//     setCurrentPage(1);
//     loadDisbursedLoans({});
//   };

//   const handleDateChange = ([start, end]) => {
//     if (start && !end) {
//       setStartDate(start);
//       setEndDate(start);
//     } else {
//       setStartDate(start);
//       setEndDate(end);
//     }
//   };

//   const handleTakeLoanClick = () => {
//     if (dashboardData?.active_loan?.status === "DISBURSED") {
//       setShowActiveLoanModal(true);
//     } else if (
//       dashboardData?.pending_loan?.status === "PENDING" &&
//       userData.phone_verified
//     ) {
//       navigate("/take-a-loan/loan-repayment-overview");
//     } else if (dashboardData.credit_score.current_score === 0) {
//       navigate("/take-a-loan/enter-bvn");
//     } else if (!userData.phone_verified) {
//       navigate("/take-a-loan/verify-phone");
//     } else {
//       navigate("/take-a-loan/form/loan-amount-purpose");
//     }
//   };

//   const selectedDateText = () => {
//     if (startDate && endDate) {
//       if (startDate.getTime() === endDate.getTime()) {
//         return startDate.toLocaleDateString("en-US", {
//           month: "short",
//           day: "numeric",
//           year: "numeric",
//         });
//       }
//       return `${startDate.toLocaleDateString("en-US", {
//         month: "short",
//         day: "numeric",
//         year: "numeric",
//       })} - ${endDate.toLocaleDateString("en-US", {
//         month: "short",
//         day: "numeric",
//         year: "numeric",
//       })}`;
//     }
//     return t("repaymentsSection.selectDate");
//   };

//   return (
//     <div className="w-[95%] mx-auto md:w-[90%] lg:px-6">
//       <p className="hidden font-raleway text-[24px] text-[#222] font-semibold lg:text-[32px] lg:block lg:pb-5">
//         {t("disbursedLoans.title")}
//       </p>

//       <div className="rounded-xl flex flex-col self-stretch justify-center items-start gap-6 lg:bg-[#fff] p-6 lg:mb-14">
//         {/* Desktop header */}
//         <div className="hidden lg:flex justify-between items-start self-stretch w-full">
//           <div className="flex justify-between items-center md:w-[25%] relative">
//             <div
//               className={`ml-3.5 relative ${
//                 !dashboardData.total_loans_taken
//                   ? "opacity-50 cursor-not-allowed"
//                   : ""
//               }`}
//             >
//               <DatePicker
//                 selected={startDate}
//                 onChange={handleDateChange}
//                 startDate={startDate}
//                 endDate={endDate}
//                 selectsRange
//                 maxDate={new Date()}
//                 disabled={!dashboardData.total_loans_taken}
//                 customInput={
//                   <div
//                     className="hidden lg:flex lg:items-center gap-2.5 pl-3 shrink-0 rounded-[30px]
//                       border border-[rgba(0,0,0,0.08)] bg-[rgba(255,255,255,0.80)]
//                       cursor-pointer"
//                   >
//                     <p className="text-[16px] text-[rgba(34,34,34,0.80)] font-medium">
//                       {selectedDateText()}
//                     </p>
//                     <span className="block p-4 rounded-[50%] bg-[#E6E6E6]">
//                       <img src={calendarIcon} alt="calendar icon" />
//                     </span>
//                   </div>
//                 }
//               />
//             </div>
//           </div>

//           <div className="md:w-[90%] flex justify-end items-center gap-4">
//             <div
//               className={`flex items-center justify-between gap-2.5 pl-3 shrink-0 flex-1 rounded-[30px] 
//                 w-full md:w-[60%] border border-[rgba(0,0,0,0.08)] bg-[rgba(255,255,255,0.80)] 
//                 ${
//                   !dashboardData.total_loans_taken
//                     ? "opacity-50 cursor-not-allowed"
//                     : ""
//                 }`}
//             >
//               <input
//                 type="search"
//                 placeholder={searchPlaceholder}
//                 value={searchQuery}
//                 onChange={(e) =>
//                   dashboardData.total_loans_taken &&
//                   setSearchQuery(e.target.value)
//                 }
//                 onFocus={() => setSearchPlaceholder("")}
//                 onBlur={() =>
//                   setSearchPlaceholder(t("repaymentsSection.searchPlaceholder"))
//                 }
//                 disabled={!dashboardData.total_loans_taken}
//                 className="text-[14px] w-[90%] md:text-[16px] bg-transparent outline-none border-none"
//               />

//               <button
//                 className="cursor-pointer"
//                 disabled={!dashboardData.total_loans_taken}
//                 onClick={handleApplyFilters}
//               >
//                 <img src={searchIcon} alt="search icon" />
//               </button>
//             </div>

//             <Link
//               className="text-right text-[18px] text-[#439182] my-4 font-semibold"
//               to="/loans/history"
//             >
//               {t("disbursedLoans.loanHistory.title")}
//             </Link>
//           </div>
//         </div>

//         {/* Mobile / Tablet header */}
//         <div className="flex flex-col lg:hidden w-full">
//           <div className="flex justify-between items-center gap-1.5 self-stretch mb-8">
//             <p className="font-raleway font-semibold text-[24px]">
//               {t("disbursedLoans.title")}
//             </p>

//             <div
//               className={`flex items-center gap-2.5 pl-3 rounded-[30px] border border-[rgba(0,0,0,0.08)]
//               bg-[rgba(255,255,255,0.80)] ${
//                 !dashboardData.total_loans_taken
//                   ? "opacity-50 cursor-not-allowed"
//                   : ""
//               }`}
//             >
//               <DatePicker
//                 selected={startDate}
//                 onChange={handleDateChange}
//                 startDate={startDate}
//                 endDate={endDate}
//                 selectsRange
//                 maxDate={new Date()}
//                 disabled={!dashboardData.total_loans_taken}
//                 customInput={
//                   <div className="flex items-center gap-2.5 w-full cursor-pointer">
//                     <p className="text-[16px] text-[rgba(34,34,34,0.80)] font-medium truncate">
//                       {selectedDateText()}
//                     </p>
//                     <span className="block p-4 rounded-[50%] bg-[#E6E6E6]">
//                       <img src={calendarIcon} alt="calendar icon" />
//                     </span>
//                   </div>
//                 }
//               />
//             </div>
//           </div>

//           <div
//             className={`flex items-center justify-between gap-2.5 pl-3 rounded-[30px] border border-[rgba(0,0,0,0.08)] bg-[rgba(255,255,255,0.80)] ${
//               !dashboardData.total_loans_taken
//                 ? "opacity-50 cursor-not-allowed"
//                 : ""
//             }`}
//           >
//             <input
//               type="search"
//               placeholder={searchPlaceholder}
//               value={searchQuery}
//               onChange={(e) =>
//                 dashboardData.total_loans_taken &&
//                 setSearchQuery(e.target.value)
//               }
//               onFocus={() => setSearchPlaceholder("")}
//               onBlur={() =>
//                 setSearchPlaceholder(t("repaymentsSection.searchPlaceholder"))
//               }
//               disabled={!dashboardData.total_loans_taken}
//               className="text-[14px] w-[90%] md:text-[16px] bg-transparent outline-none border-none"
//             />

//             <button
//               disabled={!dashboardData.total_loans_taken}
//               className={`${
//                 !dashboardData.total_loans_taken
//                   ? "cursor-not-allowed"
//                   : "cursor-pointer"
//               }`}
//               onClick={handleApplyFilters}
//             >
//               <img src={searchIcon} alt="search icon" />
//             </button>
//           </div>
//           <Link
//             className="text-right md:text-[16px] text-[#439182] my-4 font-semibold flex self-end"
//             to="/loans/history"
//           >
//             {t("disbursedLoans.loanHistory.title")}
//           </Link>
//         </div>

//         {/* Apply / Clear */}
//         {dashboardData.total_loans_taken > 0 && (
//           <div className="flex gap-4 w-full md:w-[45%] lg:w-[25%]">
//             <button
//               onClick={handleApplyFilters}
//               className="flex-1 text-[14px] font-semibold text-blue-600"
//             >
//               {t("repaymentsSection.applyFilters")}
//             </button>
//             <button
//               onClick={handleClearFilters}
//               className="flex-1 text-[14px] font-semibold text-gray-600"
//             >
//               {t("repaymentsSection.clearFilters")}
//             </button>
//           </div>
//         )}

//         {/* BODY */}
//         {loading ? (
//           <PageLoader />
//         ) : error ? (
//           <div className="w-full text-center text-red-600 py-10">{error}</div>
//         ) : isNewUser ? (
//           <div className="w-full text-[18px] flex flex-col justify-center items-center gap-6 pt-6 lg:py-36">
//             <p className="text-[#222] text-center">
//               {t("newUserRepayments.ctaMessage")}
//             </p>
//             <button
//               onClick={handleTakeLoanClick}
//               className="flex justify-center items-center gap-2.5 bg-[#439182] rounded-[40px] py-2.5 px-6 cursor-pointer hover:opacity-80"
//             >
//               <img src={plusIcon} alt="plus icon" />
//               <span className="text-white text-[16px] font-medium">
//                 {t("newUserRepayments.ctaButton")}
//               </span>
//             </button>
//           </div>
//         ) : noDisbursedLoans ? (
//           <div className="w-full text-center text-gray-500 py-10">
//             {t("repaymentsSection.noResultsMessage")}
//           </div>
//         ) : (
//           <div className="w-full flex items-start justify-between self-start">
//             {isLargeScreen ? (
//               <>
//                 <DisbursedLoansList
//                   onSelect={setSelectedLoan}
//                   loans={disbursedLoans}
//                   selectedLoan={selectedLoan}
//                 />
//                 {loanDetails && <LoanDetails loanDetails={loanDetails} />}
//               </>
//             ) : !loanDetails ? (
//               <DisbursedLoansList
//                 onSelect={setSelectedLoan}
//                 loans={disbursedLoans}
//                 selectedLoan={selectedLoan}
//               />
//             ) : (
//               <LoanDetails loanDetails={loanDetails} />
//             )}
//           </div>
//         )}
//       </div>

//       {/* PAGINATION */}
//       {hasAnyDisbursedLoans && (
//         <div className="w-[95%] mx-auto md:w-[90%] flex items-center justify-between mt-4 px-3.5 md:px-0 lg:w-full">
//           <button
//             onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
//             disabled={currentPage === 1 || loading}
//             className="text-sm border cursor-pointer px-3 py-1.5 rounded-[8px] bg-white border-[rgba(0,0,0,0.16)] text-[#333] font-semibold disabled:opacity-50"
//           >
//             {t("repaymentsSection.pagination.previous")}
//           </button>

//           <div className="relative">
//             <div
//               className="flex items-center gap-2 rounded-[8px] bg-white border border-[#e5e5e5] px-3 cursor-pointer"
//               onClick={() => setShowPerPageDropdown(!showPerPageDropdown)}
//             >
//               <p className="text-[#999] text-sm py-1">
//                 {t("repaymentsSection.pagination.perPage")}
//               </p>
//               <span className="text-[#333] block border-l border-l-[#e5e5e5] pl-2 py-1">
//                 {itemsPerPage}
//               </span>
//               <img
//                 src={chevronDown}
//                 alt="dropdown icon"
//                 className={`ml-1 w-4 transition-transform ${
//                   showPerPageDropdown ? "rotate-180" : ""
//                 }`}
//               />
//             </div>
//             {showPerPageDropdown && (
//               <div className="absolute top-full left-0 mt-1 bg-white border rounded shadow z-10 w-full max-h-48 overflow-y-auto">
//                 {perPageOptions.map((num) => (
//                   <div
//                     key={num}
//                     className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
//                     onClick={() => {
//                       setItemsPerPage(num);
//                       setCurrentPage(1);
//                       setShowPerPageDropdown(false);
//                     }}
//                   >
//                     {num}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           <button
//             onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
//             disabled={currentPage === totalPages || loading}
//             className="text-sm border cursor-pointer px-3 py-1.5 rounded-[8px] bg-white border-[rgba(0,0,0,0.16)] text-[#333] font-semibold disabled:opacity-50"
//           >
//             {t("repaymentsSection.pagination.next")}
//           </button>
//         </div>
//       )}

//       {/* MODAL */}
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
//               className="w-full rounded-[50px] text-white font-medium bg-[#439182] py-2 hover:opacity-80"
//             >
//               {t("layout.activeLoanModal.button")}
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



// import { useDisbursedLoans } from "../../context/DisbursedLoansContext";
// import { useDashboard } from "../../context/DashboardContext";
// import { useTranslation } from "react-i18next";
// import LoanDetails from "../dashboard/LoanDetails";
// import DisbursedLoansList from "../dashboard/DisbursedLoansList";
// import { useState, useEffect } from "react";
// import { fetchLoans, getLoanDetails } from "../../api/apiData";
// import calendarIcon from "../../assets/calendar icon.svg";
// import searchIcon from "../../assets/search icon.svg";
// import { useNavigate, Link } from "react-router-dom";
// import plusIcon from "../../assets/plus icon.svg";
// import PageLoader from "../PageLoader";
// import { use_UserData } from "../../context/UserContext";
// import chevronDown from "../../assets/chevron-down.svg";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

// const useDebounce = (value, delay) => {
//   const [debouncedValue, setDebouncedValue] = useState(value);
//   useEffect(() => {
//     const timer = setTimeout(() => setDebouncedValue(value), delay);
//     return () => clearTimeout(timer);
//   }, [value, delay]);
//   return debouncedValue;
// };

// export default function DisbursedLoans() {
//   const navigate = useNavigate();
//   const { t } = useTranslation();
//   const { dashboardData, refreshDashboardData } = useDashboard();
//   const { setDisbursedLoansData } = useDisbursedLoans();
//   const { userData } = use_UserData();

//   const [loanDetails, setLoanDetails] = useState(null);
//   const [selectedLoan, setSelectedLoan] = useState(null);
//   const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024);
//   const [searchPlaceholder, setSearchPlaceholder] = useState(
//     t("repaymentsSection.searchPlaceholder")
//   );

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // filters
//   const [startDate, setStartDate] = useState(null);
//   const [endDate, setEndDate] = useState(null);
//   const [searchQuery, setSearchQuery] = useState("");
//   const debouncedSearchQuery = useDebounce(searchQuery, 300);

//   // pagination
//   const [disbursedLoans, setDisbursedLoans] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalDisbursedLoans, setTotalDisbursedLoans] = useState(0);
//   const [showPerPageDropdown, setShowPerPageDropdown] = useState(false);
//   const perPageOptions = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
//   const [dataLoaded, setDataLoaded] = useState(false);

//   const [showActiveLoanModal, setShowActiveLoanModal] = useState(false);

//   const hasAnyDisbursedLoans = totalDisbursedLoans > 0;
//   const isNewUser = dashboardData.total_loans_taken === 0;
//   const noDisbursedLoans = dataLoaded && !loading && disbursedLoans.length === 0;

//   const formatDate = (date) => {
//     if (!date) return null;
//     return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
//       2,
//       "0"
//     )}-${String(date.getDate()).padStart(2, "0")}`;
//   };

//   const loadDisbursedLoans = async (filters = {}) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await fetchLoans(currentPage, itemsPerPage, {
//         ...filters,
//         status: "COMPLETED,DISBURSED",
//       });
//       if (res?.status) {
//         const list = res.data?.loans || [];
//         setDisbursedLoans(list);
//         setDisbursedLoansData(list);
//         setTotalDisbursedLoans(res.data?.total_loans || 0);
//         setTotalPages(res.data?.total_pages || 1);
//         if (list.length > 0) {
//           setSelectedLoan(list[0]._id);
//         } else {
//           setSelectedLoan(null);
//         }
//       } else {
//         setError(res?.message);
//         setDisbursedLoans([]);
//         setSelectedLoan(null);
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || "An error occurred");
//       setDisbursedLoans([]);
//       setSelectedLoan(null);
//     } finally {
//       setLoading(false);
//       setDataLoaded(true);
//     }
//   };

//   useEffect(() => {
//     loadDisbursedLoans();
//   }, [currentPage, itemsPerPage]);

//   useEffect(() => {
//     refreshDashboardData();
//   }, [refreshDashboardData]);

//   useEffect(() => {
//     const handleResize = () => setIsLargeScreen(window.innerWidth >= 1024);
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   useEffect(() => {
//     const getLoanByID = async (loanID) => {
//       try {
//         const res = await getLoanDetails(loanID);
//         if (res?.status) setLoanDetails(res.data);
//         else setLoanDetails(null);
//       } catch (err) {
//         console.log("Error: ", err);
//         setLoanDetails(null);
//       }
//     };
//     if (selectedLoan) getLoanByID(selectedLoan);
//     else setLoanDetails(null);
//   }, [selectedLoan]);

//   const handleApplyFilters = () => {
//     const filters = {};
//     if (debouncedSearchQuery.trim())
//       filters.query = debouncedSearchQuery.trim();
//     if (startDate && endDate) {
//       filters.startDate = formatDate(startDate);
//       filters.endDate = formatDate(endDate);
//     }
//     setCurrentPage(1);
//     loadDisbursedLoans(filters);
//   };

//   const handleClearFilters = () => {
//     setSearchQuery("");
//     setStartDate(null);
//     setEndDate(null);
//     setCurrentPage(1);
//     loadDisbursedLoans({});
//   };

//   const handleDateChange = ([start, end]) => {
//     if (start && !end) {
//       setStartDate(start);
//       setEndDate(start);
//     } else {
//       setStartDate(start);
//       setEndDate(end);
//     }
//   };

//   const handleTakeLoanClick = () => {
//     if (dashboardData?.active_loan?.status === "DISBURSED") {
//       setShowActiveLoanModal(true);
//     } else if (
//       dashboardData?.pending_loan?.status === "PENDING" &&
//       userData.phone_verified
//     ) {
//       navigate("/take-a-loan/loan-repayment-overview");
//     } else if (dashboardData.credit_score.current_score === 0) {
//       navigate("/take-a-loan/enter-bvn");
//     } else if (!userData.phone_verified) {
//       navigate("/take-a-loan/verify-phone");
//     } else {
//       navigate("/take-a-loan/form/loan-amount-purpose");
//     }
//   };

//   const selectedDateText = () => {
//     if (startDate && endDate) {
//       if (startDate.getTime() === endDate.getTime()) {
//         return startDate.toLocaleDateString("en-US", {
//           month: "short",
//           day: "numeric",
//           year: "numeric",
//         });
//       }
//       return `${startDate.toLocaleDateString("en-US", {
//         month: "short",
//         day: "numeric",
//         year: "numeric",
//       })} - ${endDate.toLocaleDateString("en-US", {
//         month: "short",
//         day: "numeric",
//         year: "numeric",
//       })}`;
//     }
//     return t("repaymentsSection.selectDate");
//   };

//   const handleLoanSelect = (loanId) => {
//     if (isLargeScreen) {
//       setSelectedLoan(loanId);
//     } else {
//       navigate(`/loans/disbursed/${loanId}`);
//     }
//   };

//   return (
//     <div className="w-[95%] mx-auto md:w-[90%] lg:px-6">
//       <p className="hidden font-raleway text-[24px] text-[#222] font-semibold lg:text-[32px] lg:block lg:pb-5">
//         {t("disbursedLoansSection.title")}
//       </p>

//       <div className="rounded-xl flex flex-col self-stretch justify-center items-start gap-6 lg:bg-[#fff] p-6 lg:mb-14">
//         {/* Desktop header */}
//         <div className="hidden lg:flex justify-between items-start self-stretch w-full">
//           <div className="flex justify-between items-center md:w-[25%] relative">
//             <div
//               className={`ml-3.5 relative ${
//                 !dashboardData.total_loans_taken
//                   ? "opacity-50 cursor-not-allowed"
//                   : ""
//               }`}
//             >
//               <DatePicker
//                 selected={startDate}
//                 onChange={handleDateChange}
//                 startDate={startDate}
//                 endDate={endDate}
//                 selectsRange
//                 maxDate={new Date()}
//                 disabled={!dashboardData.total_loans_taken}
//                 customInput={
//                   <div
//                     className="hidden lg:flex lg:items-center gap-2.5 pl-3 shrink-0 rounded-[30px]
//                      border border-[rgba(0,0,0,0.08)] bg-[rgba(255,255,255,0.80)]
//                      cursor-pointer"
//                   >
//                     <p className="text-[16px] text-[rgba(34,34,34,0.80)] font-medium">
//                       {selectedDateText()}
//                     </p>
//                     <span className="block p-4 rounded-[50%] bg-[#E6E6E6]">
//                       <img src={calendarIcon} alt="calendar icon" />
//                     </span>
//                   </div>
//                 }
//               />
//             </div>
//           </div>

//           <div className="md:w-[90%] flex justify-end items-center gap-4">
//             <div
//               className={`flex items-center justify-between gap-2.5 pl-3 shrink-0 flex-1 rounded-[30px] 
//                 w-full md:w-[60%] border border-[rgba(0,0,0,0.08)] bg-[rgba(255,255,255,0.80)] 
//                 ${
//                   !dashboardData.total_loans_taken
//                     ? "opacity-50 cursor-not-allowed"
//                     : ""
//                 }`}
//             >
//               <input
//                 type="search"
//                 placeholder={searchPlaceholder}
//                 value={searchQuery}
//                 onChange={(e) =>
//                   dashboardData.total_loans_taken &&
//                   setSearchQuery(e.target.value)
//                 }
//                 onFocus={() => setSearchPlaceholder("")}
//                 onBlur={() =>
//                   setSearchPlaceholder(t("repaymentsSection.searchPlaceholder"))
//                 }
//                 disabled={!dashboardData.total_loans_taken}
//                 className="text-[14px] w-[90%] md:text-[16px] bg-transparent outline-none border-none"
//               />

//               <button
//                 className="cursor-pointer"
//                 disabled={!dashboardData.total_loans_taken}
//                 onClick={handleApplyFilters}
//               >
//                 <img src={searchIcon} alt="search icon" />
//               </button>
//             </div>

//             <Link
//               className="text-right text-[18px] text-[#439182] my-4 font-semibold"
//               to="/loans/history"
//             >
//               {t("disbursedLoans.loanHistory.title")}
//             </Link>
//           </div>
//         </div>

//         {/* Mobile / Tablet header */}
//         <div className="flex flex-col lg:hidden w-full">
//           <div className="flex justify-between items-center gap-1.5 self-stretch mb-8">
//             <p className="font-raleway font-semibold text-[24px]">
//               {t("disbursedLoans.title")}
//             </p>

//             <div
//               className={`flex items-center gap-2.5 pl-3 rounded-[30px] border border-[rgba(0,0,0,0.08)]
//               bg-[rgba(255,255,255,0.80)] ${
//                 !dashboardData.total_loans_taken
//                   ? "opacity-50 cursor-not-allowed"
//                   : ""
//               }`}
//             >
//               <DatePicker
//                 selected={startDate}
//                 onChange={handleDateChange}
//                 startDate={startDate}
//                 endDate={endDate}
//                 selectsRange
//                 maxDate={new Date()}
//                 disabled={!dashboardData.total_loans_taken}
//                 customInput={
//                   <div className="flex items-center gap-2.5 w-full cursor-pointer">
//                     <p className="text-[16px] text-[rgba(34,34,34,0.80)] font-medium truncate">
//                       {selectedDateText()}
//                     </p>
//                     <span className="block p-4 rounded-[50%] bg-[#E6E6E6]">
//                       <img src={calendarIcon} alt="calendar icon" />
//                     </span>
//                   </div>
//                 }
//               />
//             </div>
//           </div>

//           <div
//             className={`flex items-center justify-between gap-2.5 pl-3 rounded-[30px] border border-[rgba(0,0,0,0.08)] bg-[rgba(255,255,255,0.80)] ${
//               !dashboardData.total_loans_taken
//                 ? "opacity-50 cursor-not-allowed"
//                 : ""
//             }`}
//           >
//             <input
//               type="search"
//               placeholder={searchPlaceholder}
//               value={searchQuery}
//               onChange={(e) =>
//                 dashboardData.total_loans_taken &&
//                 setSearchQuery(e.target.value)
//               }
//               onFocus={() => setSearchPlaceholder("")}
//               onBlur={() =>
//                 setSearchPlaceholder(t("repaymentsSection.searchPlaceholder"))
//               }
//               disabled={!dashboardData.total_loans_taken}
//               className="text-[14px] w-[90%] md:text-[16px] bg-transparent outline-none border-none"
//             />

//             <button
//               disabled={!dashboardData.total_loans_taken}
//               className={`${
//                 !dashboardData.total_loans_taken
//                   ? "cursor-not-allowed"
//                   : "cursor-pointer"
//               }`}
//               onClick={handleApplyFilters}
//             >
//               <img src={searchIcon} alt="search icon" />
//             </button>
//           </div>
//           <Link
//             className="text-right md:text-[16px] text-[#439182] my-4 font-semibold flex self-end"
//             to="/loans/history"
//           >
//             {t("disbursedLoans.loanHistory.title")}
//           </Link>
//         </div>

//         {/* Apply / Clear */}
//         {dashboardData.total_loans_taken > 0 && (
//           <div className="flex gap-4 w-full md:w-[45%] lg:w-[25%]">
//             <button
//               onClick={handleApplyFilters}
//               className="flex-1 text-[14px] font-semibold text-blue-600"
//             >
//               {t("repaymentsSection.applyFilters")}
//             </button>
//             <button
//               onClick={handleClearFilters}
//               className="flex-1 text-[14px] font-semibold text-gray-600"
//             >
//               {t("repaymentsSection.clearFilters")}
//             </button>
//           </div>
//         )}

//         {/* BODY */}
//         {loading ? (
//           <PageLoader />
//         ) : error ? (
//           <div className="w-full text-center text-red-600 py-10">{error}</div>
//         ) : isNewUser ? (
//           <div className="w-full text-[18px] flex flex-col justify-center items-center gap-6 pt-6 lg:py-36">
//             <p className="text-[#222] text-center">
//               {t("newUserRepayments.ctaMessage")}
//             </p>
//             <button
//               onClick={handleTakeLoanClick}
//               className="flex justify-center items-center gap-2.5 bg-[#439182] rounded-[40px] py-2.5 px-6 cursor-pointer hover:opacity-80"
//             >
//               <img src={plusIcon} alt="plus icon" />
//               <span className="text-white text-[16px] font-medium">
//                 {t("newUserRepayments.ctaButton")}
//               </span>
//             </button>
//           </div>
//         ) : noDisbursedLoans ? (
//           <div className="w-full text-center text-gray-500 py-10">
//             {t("repaymentsSection.noResultsMessage")}
//           </div>
//         ) : (
//           <div className="w-full flex items-start justify-between self-start">
//             {/* Conditional rendering based on screen size */}
//             {isLargeScreen ? (
//               <>
//                 {/* Left side - List of Loans */}
//                 <DisbursedLoansList
//                   onSelect={handleLoanSelect}
//                   loans={disbursedLoans}
//                   selectedLoanId={selectedLoan}
//                   isLargeScreen={isLargeScreen}
//                 />
//                 {/* Right side - Loan Details */}
//                 {loanDetails && <LoanDetails loanDetails={loanDetails} />}
//               </>
//             ) : (
//               // Mobile view always shows the list and navigates on select
//               <DisbursedLoansList
//                 onSelect={handleLoanSelect}
//                 loans={disbursedLoans}
//                 selectedLoanId={selectedLoan}
//                 isLargeScreen={isLargeScreen}
//               />
//             )}
//           </div>
//         )}
//       </div>

//       {/* PAGINATION */}
//       {hasAnyDisbursedLoans && (
//         <div className="w-[95%] mx-auto md:w-[90%] flex items-center justify-between mt-4 px-3.5 md:px-0 lg:w-full">
//           <button
//             onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
//             disabled={currentPage === 1 || loading}
//             className="text-sm border cursor-pointer px-3 py-1.5 rounded-[8px] bg-white border-[rgba(0,0,0,0.16)] text-[#333] font-semibold disabled:opacity-50"
//           >
//             {t("repaymentsSection.pagination.previous")}
//           </button>

//           <div className="relative">
//             <div
//               className="flex items-center gap-2 rounded-[8px] bg-white border border-[#e5e5e5] px-3 cursor-pointer"
//               onClick={() => setShowPerPageDropdown(!showPerPageDropdown)}
//             >
//               <p className="text-[#999] text-sm py-1">
//                 {t("repaymentsSection.pagination.perPage")}
//               </p>
//               <span className="text-[#333] block border-l border-l-[#e5e5e5] pl-2 py-1">
//                 {itemsPerPage}
//               </span>
//               <img
//                 src={chevronDown}
//                 alt="dropdown icon"
//                 className={`ml-1 w-4 transition-transform ${
//                   showPerPageDropdown ? "rotate-180" : ""
//                 }`}
//               />
//             </div>
//             {showPerPageDropdown && (
//               <div className="absolute top-full left-0 mt-1 bg-white border rounded shadow z-10 w-full max-h-48 overflow-y-auto">
//                 {perPageOptions.map((num) => (
//                   <div
//                     key={num}
//                     className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
//                     onClick={() => {
//                       setItemsPerPage(num);
//                       setCurrentPage(1);
//                       setShowPerPageDropdown(false);
//                     }}
//                   >
//                     {num}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           <button
//             onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
//             disabled={currentPage === totalPages || loading}
//             className="text-sm border cursor-pointer px-3 py-1.5 rounded-[8px] bg-white border-[rgba(0,0,0,0.16)] text-[#333] font-semibold disabled:opacity-50"
//           >
//             {t("repaymentsSection.pagination.next")}
//           </button>
//         </div>
//       )}

//       {/* MODAL */}
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
//               className="w-full rounded-[50px] text-white font-medium bg-[#439182] py-2 hover:opacity-80"
//             >
//               {t("layout.activeLoanModal.button")}
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
import { useDisbursedLoans } from "../../context/DisbursedLoansContext";
import { useDashboard } from "../../context/DashboardContext";
import { useTranslation } from "react-i18next";
import LoanDetails from "../dashboard/LoanDetails";
import DisbursedLoansList from "../dashboard/DisbursedLoansList";
import { useState, useEffect } from "react";
import { fetchLoans, getLoanDetails } from "../../api/apiData";
import calendarIcon from "../../assets/calendar icon.svg";
import searchIcon from "../../assets/search icon.svg";
import { useNavigate, Link } from "react-router-dom";
import plusIcon from "../../assets/plus icon.svg";
import PageLoader from "../PageLoader";
import { use_UserData } from "../../context/UserContext";
import chevronDown from "../../assets/chevron-down.svg";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
};

export default function DisbursedLoans() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { dashboardData, refreshDashboardData } = useDashboard();
  const { setDisbursedLoansData } = useDisbursedLoans();
  const { userData } = use_UserData();

  const [loanDetails, setLoanDetails] = useState(null);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024);
  
  // -- NEW STATE FOR INPUT FOCUS --
  const [isInputFocused, setIsInputFocused] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // filters
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // pagination
  const [disbursedLoans, setDisbursedLoans] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDisbursedLoans, setTotalDisbursedLoans] = useState(0);
  const [showPerPageDropdown, setShowPerPageDropdown] = useState(false);
  const perPageOptions = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  const [dataLoaded, setDataLoaded] = useState(false);

  const [showActiveLoanModal, setShowActiveLoanModal] = useState(false);

  const hasAnyDisbursedLoans = totalDisbursedLoans > 0;
  const isNewUser = dashboardData.total_loans_taken === 0;
  const noDisbursedLoans = dataLoaded && !loading && disbursedLoans.length === 0;

  const formatDate = (date) => {
    if (!date) return null;
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
  };

  const loadDisbursedLoans = async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchLoans(currentPage, itemsPerPage, {
        ...filters,
        status: "COMPLETED,DISBURSED",
      });
      if (res?.status) {
        const list = res.data?.loans || [];
        setDisbursedLoans(list);
        setDisbursedLoansData(list);
        setTotalDisbursedLoans(res.data?.total_loans || 0);
        setTotalPages(res.data?.total_pages || 1);
        if (list.length > 0) {
          setSelectedLoan(list[0]._id);
        } else {
          setSelectedLoan(null);
        }
      } else {
        setError(res?.message);
        setDisbursedLoans([]);
        setSelectedLoan(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
      setDisbursedLoans([]);
      setSelectedLoan(null);
    } finally {
      setLoading(false);
      setDataLoaded(true);
    }
  };

  useEffect(() => {
    loadDisbursedLoans();
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    refreshDashboardData();
  }, [refreshDashboardData]);

  useEffect(() => {
    const handleResize = () => setIsLargeScreen(window.innerWidth >= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const getLoanByID = async (loanID) => {
      try {
        const res = await getLoanDetails(loanID);
        if (res?.status) setLoanDetails(res.data);
        else setLoanDetails(null);
      } catch (err) {
        console.log("Error: ", err);
        setLoanDetails(null);
      }
    };
    if (selectedLoan) getLoanByID(selectedLoan);
    else setLoanDetails(null);
  }, [selectedLoan]);

  const handleApplyFilters = () => {
    const filters = {};
    if (debouncedSearchQuery.trim())
      filters.query = debouncedSearchQuery.trim();
    if (startDate && endDate) {
      filters.startDate = formatDate(startDate);
      filters.endDate = formatDate(endDate);
    }
    setCurrentPage(1);
    loadDisbursedLoans(filters);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setStartDate(null);
    setEndDate(null);
    setCurrentPage(1);
    loadDisbursedLoans({});
  };

  const handleDateChange = ([start, end]) => {
    if (start && !end) {
      setStartDate(start);
      setEndDate(start);
    } else {
      setStartDate(start);
      setEndDate(end);
    }
  };

  const handleTakeLoanClick = () => {
    if (dashboardData?.active_loan?.status === "DISBURSED") {
      setShowActiveLoanModal(true);
    } else if (
      dashboardData?.pending_loan?.status === "PENDING" &&
      userData.phone_verified
    ) {
      navigate("/take-a-loan/loan-repayment-overview");
    } else if (dashboardData.credit_score.current_score === 0) {
      navigate("/take-a-loan/enter-bvn");
    } else if (!userData.phone_verified) {
      navigate("/take-a-loan/verify-phone");
    } else {
      navigate("/take-a-loan/form/loan-amount-purpose");
    }
  };

  const selectedDateText = () => {
    if (startDate && endDate) {
      if (startDate.getTime() === endDate.getTime()) {
        return startDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
      }
      return `${startDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })} - ${endDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })}`;
    }
    return t("disbursedLoans.selectDate");
  };

  const handleLoanSelect = (loanId) => {
    if (isLargeScreen) {
      setSelectedLoan(loanId);
    } else {
      navigate(`/loans/disbursed/${loanId}`);
    }
  };

  const placeholderText = t("disbursedLoans.searchPlaceholder");

  return (
    <div className="w-[95%] mx-auto md:w-[90%] lg:px-6">
      <p className="hidden font-raleway text-[24px] text-[#222] font-semibold lg:text-[32px] lg:block lg:pb-5">
        {t("disbursedLoans.title")}
      </p>

      <div className="rounded-xl flex flex-col self-stretch justify-center items-start gap-6 lg:bg-[#fff] p-6 lg:mb-14">
        {/* Desktop header */}
        <div className="hidden lg:flex justify-between items-start self-stretch w-full">
          <div className="flex justify-between items-center md:w-[25%] relative">
            <div
              className={`ml-3.5 relative ${
                !dashboardData.total_loans_taken
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              <DatePicker
                selected={startDate}
                onChange={handleDateChange}
                startDate={startDate}
                endDate={endDate}
                selectsRange
                maxDate={new Date()}
                disabled={!dashboardData.total_loans_taken}
                customInput={
                  <div
                    className="hidden lg:flex lg:items-center gap-2.5 pl-3 shrink-0 rounded-[30px]
                     border border-[rgba(0,0,0,0.08)] bg-[rgba(255,255,255,0.80)]
                     cursor-pointer"
                  >
                    <p className="text-[16px] text-[rgba(34,34,34,0.80)] font-medium">
                      {selectedDateText()}
                    </p>
                    <span className="block p-4 rounded-[50%] bg-[#E6E6E6]">
                      <img src={calendarIcon} alt="calendar icon" />
                    </span>
                  </div>
                }
              />
            </div>
          </div>

          <div className="md:w-[90%] flex justify-end items-center gap-4">
            <div
              className={`flex items-center justify-between gap-2.5 pl-3 shrink-0 flex-1 rounded-[30px] 
               w-full md:w-[60%] border border-[rgba(0,0,0,0.08)] bg-[rgba(255,255,255,0.80)] 
               ${
                 !dashboardData.total_loans_taken
                   ? "opacity-50 cursor-not-allowed"
                   : ""
               }`}
            >
              <input
                type="search"
                placeholder={isInputFocused ? "" : placeholderText}
                value={searchQuery}
                onChange={(e) =>
                  dashboardData.total_loans_taken &&
                  setSearchQuery(e.target.value)
                }
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
                disabled={!dashboardData.total_loans_taken}
                className="text-[14px] w-[90%] md:text-[16px] bg-transparent outline-none border-none"
              />

              <button
                className="cursor-pointer"
                disabled={!dashboardData.total_loans_taken}
                onClick={handleApplyFilters}
              >
                <img src={searchIcon} alt="search icon" />
              </button>
            </div>

            <Link
              className="text-right text-[18px] text-[#439182] my-4 font-semibold"
              to="/loans/history"
            >
              {t("disbursedLoans.loanHistory.title")}
            </Link>
          </div>
        </div>

        {/* Mobile / Tablet header */}
        <div className="flex flex-col lg:hidden w-full">
          <div className="flex justify-between items-center gap-1.5 self-stretch mb-8">
            <p className="font-raleway font-semibold text-[24px]">
              {t("disbursedLoans.title")}
            </p>

            <div
              className={`flex items-center gap-2.5 pl-3 rounded-[30px] border border-[rgba(0,0,0,0.08)]
               bg-[rgba(255,255,255,0.80)] ${
                 !dashboardData.total_loans_taken
                   ? "opacity-50 cursor-not-allowed"
                   : ""
               }`}
            >
              <DatePicker
                selected={startDate}
                onChange={handleDateChange}
                startDate={startDate}
                endDate={endDate}
                selectsRange
                maxDate={new Date()}
                disabled={!dashboardData.total_loans_taken}
                customInput={
                  <div className="flex items-center gap-2.5 w-full cursor-pointer">
                    <p className="text-[16px] text-[rgba(34,34,34,0.80)] font-medium truncate">
                      {selectedDateText()}
                    </p>
                    <span className="block p-4 rounded-[50%] bg-[#E6E6E6]">
                      <img src={calendarIcon} alt="calendar icon" />
                    </span>
                  </div>
                }
              />
            </div>
          </div>

          <div
            className={`flex items-center justify-between gap-2.5 pl-3 rounded-[30px] border border-[rgba(0,0,0,0.08)] bg-[rgba(255,255,255,0.80)] ${
              !dashboardData.total_loans_taken
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            <input
              type="search"
              placeholder={isInputFocused ? "" : placeholderText}
              value={searchQuery}
              onChange={(e) =>
                dashboardData.total_loans_taken &&
                setSearchQuery(e.target.value)
              }
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
              disabled={!dashboardData.total_loans_taken}
              className="text-[14px] w-[90%] md:text-[16px] bg-transparent outline-none border-none"
            />

            <button
              disabled={!dashboardData.total_loans_taken}
              className={`${
                !dashboardData.total_loans_taken
                  ? "cursor-not-allowed"
                  : "cursor-pointer"
              }`}
              onClick={handleApplyFilters}
            >
              <img src={searchIcon} alt="search icon" />
            </button>
          </div>
          <Link
            className="text-right md:text-[16px] text-[#439182] my-4 font-semibold flex self-end"
            to="/loans/history"
          >
            {t("disbursedLoans.loanHistory.title")}
          </Link>
        </div>

        {/* Apply / Clear */}
        {dashboardData.total_loans_taken > 0 && (
          <div className="flex gap-4 w-full md:w-[45%] lg:w-[25%]">
            <button
              onClick={handleApplyFilters}
              className="flex-1 text-[14px] font-semibold text-blue-600"
            >
              {t("disbursedLoans.applyFilters")}
            </button>
            <button
              onClick={handleClearFilters}
              className="flex-1 text-[14px] font-semibold text-gray-600"
            >
              {t("disbursedLoans.clearFilters")}
            </button>
          </div>
        )}

        {/* BODY */}
        {loading ? (
          <PageLoader />
        ) : error ? (
          <div className="w-full text-center text-red-600 py-10">{error}</div>
        ) : isNewUser ? (
          <div className="w-full text-[18px] flex flex-col justify-center items-center gap-6 pt-6 lg:py-36">
            <p className="text-[#222] text-center">
              {t("disbursedLoans.newUserCtaMessage")}
            </p>
            <button
              onClick={handleTakeLoanClick}
              className="flex justify-center items-center gap-2.5 bg-[#439182] rounded-[40px] py-2.5 px-6 cursor-pointer hover:opacity-80"
            >
              <img src={plusIcon} alt="plus icon" />
              <span className="text-white text-[16px] font-medium">
                {t("disbursedLoans.newUserCtaButton")}
              </span>
            </button>
          </div>
        ) : noDisbursedLoans ? (
          <div className="w-full text-center text-gray-500 py-10">
            {t("disbursedLoansList.noResultsMessage")}
          </div>
        ) : (
          <div className="w-full flex items-start justify-between self-start">
            {/* Conditional rendering based on screen size */}
            {isLargeScreen ? (
              <>
                {/* Left side - List of Loans */}
                <DisbursedLoansList
                  onSelect={handleLoanSelect}
                  loans={disbursedLoans}
                  selectedLoanId={selectedLoan}
                  isLargeScreen={isLargeScreen}
                />
                {/* Right side - Loan Details */}
                {loanDetails && <LoanDetails loanDetails={loanDetails} />}
              </>
            ) : (
              // Mobile view always shows the list and navigates on select
              <DisbursedLoansList
                onSelect={handleLoanSelect}
                loans={disbursedLoans}
                selectedLoanId={selectedLoan}
                isLargeScreen={isLargeScreen}
              />
            )}
          </div>
        )}
      </div>

      {/* PAGINATION */}
      {hasAnyDisbursedLoans && (
        <div className="w-[95%] mx-auto md:w-[90%] flex items-center justify-between mt-4 px-3.5 md:px-0 lg:w-full">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1 || loading}
            className="text-sm border cursor-pointer px-3 py-1.5 rounded-[8px] bg-white border-[rgba(0,0,0,0.16)] text-[#333] font-semibold disabled:opacity-50"
          >
            {t("disbursedLoans.pagination.previous")}
          </button>

          <div className="relative">
            <div
              className="flex items-center gap-2 rounded-[8px] bg-white border border-[#e5e5e5] px-3 cursor-pointer"
              onClick={() => setShowPerPageDropdown(!showPerPageDropdown)}
            >
              <p className="text-[#999] text-sm py-1">
                {t("disbursedLoans.pagination.perPage")}
              </p>
              <span className="text-[#333] block border-l border-l-[#e5e5e5] pl-2 py-1">
                {itemsPerPage}
              </span>
              <img
                src={chevronDown}
                alt="dropdown icon"
                className={`ml-1 w-4 transition-transform ${
                  showPerPageDropdown ? "rotate-180" : ""
                }`}
              />
            </div>
            {showPerPageDropdown && (
              <div className="absolute top-full left-0 mt-1 bg-white border rounded shadow z-10 w-full max-h-48 overflow-y-auto">
                {perPageOptions.map((num) => (
                  <div
                    key={num}
                    className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setItemsPerPage(num);
                      setCurrentPage(1);
                      setShowPerPageDropdown(false);
                    }}
                  >
                    {num}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages || loading}
            className="text-sm border cursor-pointer px-3 py-1.5 rounded-[8px] bg-white border-[rgba(0,0,0,0.16)] text-[#333] font-semibold disabled:opacity-50"
          >
            {t("disbursedLoans.pagination.next")}
          </button>
        </div>
      )}

      {/* MODAL */}
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
              className="w-full rounded-[50px] text-white font-medium bg-[#439182] py-2 hover:opacity-80"
            >
              {t("layout.activeLoanModal.button")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}