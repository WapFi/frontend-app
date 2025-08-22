// import { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import calendarIcon from "../../assets/calendar icon.svg";
// import searchIcon from "../../assets/search icon.svg";
// import DisbursedLoansList from "./DisbursedLoansList";
// import LoanDetails from "./LoanDetails";
// import { fetchLoans, getLoanDetails } from "../../api/apiData";
// import { useTranslation } from "react-i18next";
// import { useDisbursedLoans } from "../../context/DisbursedLoansContext";
// import PageLoader from "../PageLoader";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

// // Simple debounce
// const useDebounce = (value, delay) => {
//   const [debouncedValue, setDebouncedValue] = useState(value);
//   useEffect(() => {
//     const timer = setTimeout(() => setDebouncedValue(value), delay);
//     return () => clearTimeout(timer);
//   }, [value, delay]);
//   return debouncedValue;
// };

// function DisbursedLoansSection({ totalLoansTaken }) {
//   const { setDisbursedLoansData } = useDisbursedLoans();
//   const { t } = useTranslation();

//   const [selectedLoan, setSelectedLoan] = useState(null);
//   const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024);
//   const [startDate, setStartDate] = useState(null);
//   const [endDate, setEndDate] = useState(null);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [loans, setLoans] = useState([]);
//   const [error, setError] = useState(null);
//   const [loanDetails, setLoanDetails] = useState(null);
//   const [loanDetailsLoading, setLoanDetailsLoading] = useState(false);
//   const [searchPlaceholder, setSearchPlaceholder] = useState(
//     t("repaymentsSection.searchPlaceholder")
//   );

//   const debouncedSearchQuery = useDebounce(searchQuery, 400);

//   useEffect(() => {
//     const handleResize = () => setIsLargeScreen(window.innerWidth >= 1024);
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   // Fetch loan details on select
//   useEffect(() => {
//     const getLoanByID = async (id) => {
//       setLoanDetailsLoading(true);
//       setLoanDetails(null);
//       try {
//         const res = await getLoanDetails(id);
//         if (res?.status) setLoanDetails(res.data);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoanDetailsLoading(false);
//       }
//     };
//     if (selectedLoan) getLoanByID(selectedLoan);
//   }, [selectedLoan]);

//   const formatDate = (date) => {
//     if (!date) return null;
//     return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
//       2,
//       "0"
//     )}-${String(date.getDate()).padStart(2, "0")}`;
//   };

//   const fetchFilteredLoans = async (filters = {}) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await fetchLoans(1, 10, { ...filters, status: "COMPLETED,DISBURSED" });
//       if (res?.status) {
//         const data = res.data.loans || [];
//         setLoans(data);
//         setDisbursedLoansData(data);
//         if (!data.length && res.data?.message) setError(res.data.message);
//       } else {
//         setError(res.message);
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || "An unexpected error occurred.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Initial fetch
//   useEffect(() => {
//     fetchFilteredLoans();
//   }, []);

//   const handleApplyFilters = () => {
//     const filters = {};
//     if (debouncedSearchQuery.trim()) {
//       filters.query = debouncedSearchQuery.trim();
//     }
//     if (startDate && endDate) {
//       filters.startDate = formatDate(startDate);
//       filters.endDate = formatDate(endDate);
//     }
//     fetchFilteredLoans(filters);
//   };

//   const handleClearFilters = () => {
//     setSearchQuery("");
//     setStartDate(null);
//     setEndDate(null);
//     fetchFilteredLoans({});
//   };

//   const handleSelectLoan = (loanId) => setSelectedLoan(loanId);

//   const handleDateChange = ([start, end]) => {
//     // console.log("in here")
//     if (start && !end) {
//       setStartDate(start);
//       setEndDate(start);
//     } else {
//       setStartDate(start);
//       setEndDate(end);
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

//   if (loading) return <PageLoader />;

//   const noLoans = loans.length === 0;
//   const noLoansTaken = totalLoansTaken === 0;

//   return (
//     <div className="rounded-xl flex flex-col self-stretch justify-center w-full items-start gap-6 bg-[#fff] lg:p-6">
//       {/* DESKTOP/TABLET HEADER */}
//       <div className="hidden md:flex justify-between items-start self-stretch w-full gap-6">
//         {/* Date Picker */}
//         <div className="flex justify-between items-center md:w-[45%] relative">
//           <p className="font-raleway font-semibold md:text-[24px]">
//             {/* {t("repaymentsSection.title")} */}
//             Disbursed Loans
//           </p>
//           <div className="ml-3.5 relative">
//             <DatePicker
//               selected={startDate}
//               onChange={handleDateChange}
//               startDate={startDate}
//               endDate={endDate}
//               selectsRange
//               maxDate={new Date()}
//               customInput={
//                 <div
//                   className={`hidden md:flex md:items-center gap-2.5 pl-3 shrink-0 rounded-[30px] border border-[rgba(0,0,0,0.08)] bg-[rgba(255,255,255,0.80)] cursor-pointer ${
//                     noLoansTaken ? "cursor-not-allowed" : ""
//                   }`}
//                 >
//                   <p className="text-[16px] text-[rgba(34,34,34,0.80)] font-medium">
//                     {selectedDateText()}
//                   </p>
//                   <span className="block p-4 rounded-[50%] bg-[#E6E6E6]">
//                     <img src={calendarIcon} alt="calendar" />
//                   </span>
//                 </div>
//               }
//               disabled={noLoansTaken}
//             />
//           </div>
//         </div>

//         {/* Search + View All */}
//         <div
//           className={`md:w-[50%] flex justify-between items-center gap-10 ${
//             noLoansTaken ? "opacity-50" : ""
//           }`}
//         >
//           <div
//             className="flex items-center justify-between gap-2.5 pl-3 shrink-0 
//               rounded-[30px] w-full md:w-[70%] border border-[rgba(0,0,0,0.08)] 
//               bg-[rgba(255,255,255,0.80)]"
//           >
//             <input
//               type="search"
//               placeholder={searchPlaceholder}
//               onFocus={() => setSearchPlaceholder("")}
//               onBlur={() =>
//                 setSearchPlaceholder(t("repaymentsSection.searchPlaceholder"))
//               }
//               className="text-[14px] w-[90%] md:text-[16px] text-[rgba(34,34,34,0.50)] 
//               rounded-full bg-transparent outline-none border-none"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               autoComplete="off"
//               disabled={noLoansTaken}
//             />
//             <button
//               className="cursor-pointer"
//               onClick={handleApplyFilters}
//               disabled={noLoansTaken}
//             >
//               <img src={searchIcon} alt="search" />
//             </button>
//           </div>
//           <Link
//             to={noLoansTaken ? "#" : "/loans/disbursed-loans"}
//             className={`text-[14px] md:text-[16px] text-[#2D6157] font-semibold ${
//               noLoansTaken ? "cursor-not-allowed" : ""
//             }`}
//             onClick={(e) => noLoansTaken && e.preventDefault()}
//           >
//             {t("repaymentsSection.viewAll")}
//           </Link>
//         </div>
//       </div>
//       {/* Apply / Clear row for desktop/tablet */}
//       {!noLoansTaken && (
//         <div className="hidden md:flex gap-4">
//           <button
//             onClick={handleApplyFilters}
//             className="text-[14px] md:text-[16px] font-semibold text-blue-600 cursor-pointer"
//           >
//             {t("repaymentsSection.applyFilters")}
//           </button>

//           <button
//             onClick={handleClearFilters}
//             className="text-[14px] md:text-[16px] font-semibold text-gray-600 cursor-pointer"
//           >
//             {t("repaymentsSection.clearFilters")}
//           </button>
//         </div>
//       )}
//       {/* MOBILE HEADER & CONTROLS */}
//       <div className="flex flex-col md:hidden w-full gap-4">
//         <div className="flex justify-between items-center">
//           <p className="font-raleway font-semibold text-[24px]">
//             {/* {t("repaymentsSection.mobileTitle")} */}
//             Disbursed Loans
//           </p>
//           <Link
//             to={noLoansTaken ? "#" : "/loans/disbursed-loans"}
//             className={`text-[14px] text-[#2D6157] font-semibold ${
//               noLoansTaken ? "opacity-50 cursor-not-allowed" : ""
//             }`}
//             onClick={(e) => noLoansTaken && e.preventDefault()}
//           >
//             {t("repaymentsSection.viewAll")}
//           </Link>
//         </div>

//         {/* Mobile Search */}
//         <div
//           className={`flex items-center justify-between gap-2.5 pl-3 shrink-0 rounded-[30px] w-full border border-[rgba(0,0,0,0.08)] bg-[rgba(255,255,255,0.80)] ${
//             noLoansTaken ? "opacity-50" : ""
//           }`}
//         >
//           <input
//             type="search"
//             placeholder={searchPlaceholder}
//             onFocus={() => setSearchPlaceholder("")}
//             onBlur={() =>
//               setSearchPlaceholder(t("repaymentsSection.searchPlaceholder"))
//             }
//             className="text-[14px] w-[90%] text-[rgba(34,34,34,0.50)] rounded-full 
//               bg-transparent outline-none border-none"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             autoComplete="off"
//             disabled={noLoansTaken}
//           />
//           <button
//             className="cursor-pointer"
//             onClick={handleApplyFilters}
//             disabled={noLoansTaken}
//           >
//             <img src={searchIcon} alt="search" />
//           </button>
//         </div>

//         {/* Mobile Date */}
//         <DatePicker
//           selected={startDate}
//           onChange={handleDateChange}
//           startDate={startDate}
//           endDate={endDate}
//           selectsRange
//           maxDate={new Date()}
//           customInput={
//             <div
//               className={`flex items-center justify-between gap-2.5 pl-3 shrink-0 rounded-[30px] border border-[rgba(0,0,0,0.08)] bg-[rgba(255,255,255,0.80)] cursor-pointer ${
//                 noLoansTaken ? "cursor-not-allowed" : ""
//               }`}
//             >
//               <p className="text-[16px] text-[rgba(34,34,34,0.80)] font-medium">
//                 {selectedDateText()}
//               </p>
//               <span className="block p-4 rounded-[50%] bg-[#E6E6E6]">
//                 <img src={calendarIcon} alt="calendar" />
//               </span>
//             </div>
//           }
//           disabled={noLoansTaken}
//         />

//         {/* Apply / Clear for mobile */}
//         {!noLoansTaken && (
//           <div className="flex gap-4">
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
//       </div>
//       {/* BODY */}
//       <div className="w-full flex items-start justify-between">
//         {error ? (
//           <p className="text-red-500 w-full text-center py-10">{error}</p>
//         ) : noLoans ? (
//           <div className="w-full flex flex-col justify-center items-center gap-6 py-20">
//             <p className="text-[#222] text-center">
//               {/* {t("repaymentsSection.noResultsMessage")} */}
//               No loans matched.
//             </p>
//           </div>
//         ) : isLargeScreen ? (
//           <>
//             <DisbursedLoansList loans={loans} onSelect={handleSelectLoan} />
//             {selectedLoan &&
//               (loanDetailsLoading ? (
//                 <PageLoader />
//               ) : (
//                 loanDetails && <LoanDetails loanDetails={loanDetails} />
//               ))}
//           </>
//         ) : !selectedLoan ? (
//           <DisbursedLoansList loans={loans} onSelect={handleSelectLoan} />
//         ) : loanDetailsLoading ? (
//           <PageLoader />
//         ) : (
//           <LoanDetails loanDetails={loanDetails} />
//         )}
//       </div>
//     </div>
//   );
// }

// export default DisbursedLoansSection;



// import { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import calendarIcon from "../../assets/calendar icon.svg";
// import searchIcon from "../../assets/search icon.svg";
// import DisbursedLoansList from "./DisbursedLoansList";
// import LoanDetails from "./LoanDetails";
// import { fetchLoans, getLoanDetails } from "../../api/apiData";
// import { useTranslation } from "react-i18next";
// import { useDisbursedLoans } from "../../context/DisbursedLoansContext";
// import PageLoader from "../PageLoader";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

// // Simple debounce
// const useDebounce = (value, delay) => {
//   const [debouncedValue, setDebouncedValue] = useState(value);
//   useEffect(() => {
//     const timer = setTimeout(() => setDebouncedValue(value), delay);
//     return () => clearTimeout(timer);
//   }, [value, delay]);
//   return debouncedValue;
// };

// function DisbursedLoansSection({ totalLoansTaken }) {
//   const { setDisbursedLoansData } = useDisbursedLoans();
//   const { t } = useTranslation();

//   const [selectedLoan, setSelectedLoan] = useState(null);
//   const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024);
//   const [startDate, setStartDate] = useState(null);
//   const [endDate, setEndDate] = useState(null);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [loans, setLoans] = useState([]);
//   const [error, setError] = useState(null);
//   const [loanDetails, setLoanDetails] = useState(null);
//   const [loanDetailsLoading, setLoanDetailsLoading] = useState(false);
//   const [searchPlaceholder, setSearchPlaceholder] = useState(
//     t("repaymentsSection.searchPlaceholder")
//   );

//   const debouncedSearchQuery = useDebounce(searchQuery, 400);

//   useEffect(() => {
//     const handleResize = () => setIsLargeScreen(window.innerWidth >= 1024);
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   // Fetch loan details on select
//   useEffect(() => {
//     const getLoanByID = async (id) => {
//       setLoanDetailsLoading(true);
//       setLoanDetails(null);
//       try {
//         const res = await getLoanDetails(id);
//         if (res?.status) setLoanDetails(res.data);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoanDetailsLoading(false);
//       }
//     };
//     if (selectedLoan) getLoanByID(selectedLoan);
//   }, [selectedLoan]);

//   const formatDate = (date) => {
//     if (!date) return null;
//     return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
//       2,
//       "0"
//     )}-${String(date.getDate()).padStart(2, "0")}`;
//   };

//   const fetchFilteredLoans = async (filters = {}) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await fetchLoans(1, 10, { ...filters, status: "COMPLETED,DISBURSED" });
//       if (res?.status) {
//         const data = res.data.loans || [];
//         setLoans(data);
//         setDisbursedLoansData(data);
//         if (isLargeScreen && data.length > 0) {
//           setSelectedLoan(data[0]._id);
//         } else {
//           setSelectedLoan(null);
//         }
//         if (!data.length && res.data?.message) setError(res.data.message);
//       } else {
//         setError(res.message);
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || "An unexpected error occurred.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Initial fetch
//   useEffect(() => {
//     fetchFilteredLoans();
//   }, [isLargeScreen]);

//   const handleApplyFilters = () => {
//     const filters = {};
//     if (debouncedSearchQuery.trim()) {
//       filters.query = debouncedSearchQuery.trim();
//     }
//     if (startDate && endDate) {
//       filters.startDate = formatDate(startDate);
//       filters.endDate = formatDate(endDate);
//     }
//     fetchFilteredLoans(filters);
//   };

//   const handleClearFilters = () => {
//     setSearchQuery("");
//     setStartDate(null);
//     setEndDate(null);
//     fetchFilteredLoans({});
//   };

//   const handleSelectLoan = (loanId) => setSelectedLoan(loanId);

//   const handleDateChange = ([start, end]) => {
//     if (start && !end) {
//       setStartDate(start);
//       setEndDate(start);
//     } else {
//       setStartDate(start);
//       setEndDate(end);
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

//   if (loading) return <PageLoader />;

//   const noLoans = loans.length === 0;
//   const noLoansTaken = totalLoansTaken === 0;

//   return (
//     <div className="rounded-xl flex flex-col self-stretch justify-center w-full items-start gap-6 bg-[#fff] lg:p-6">
//       {/* DESKTOP/TABLET HEADER */}
//       <div className="hidden md:flex justify-between items-start self-stretch w-full gap-6">
//         {/* Date Picker */}
//         <div className="flex justify-between items-center md:w-[45%] relative">
//           <p className="font-raleway font-semibold md:text-[24px]">
//             {/* {t("repaymentsSection.title")} */}
//             Disbursed Loans
//           </p>
//           <div className="ml-3.5 relative">
//             <DatePicker
//               selected={startDate}
//               onChange={handleDateChange}
//               startDate={startDate}
//               endDate={endDate}
//               selectsRange
//               maxDate={new Date()}
//               customInput={
//                 <div
//                   className={`hidden md:flex md:items-center gap-2.5 pl-3 shrink-0 rounded-[30px] border border-[rgba(0,0,0,0.08)] bg-[rgba(255,255,255,0.80)] cursor-pointer ${
//                     noLoansTaken ? "cursor-not-allowed" : ""
//                   }`}
//                 >
//                   <p className="text-[16px] text-[rgba(34,34,34,0.80)] font-medium">
//                     {selectedDateText()}
//                   </p>
//                   <span className="block p-4 rounded-[50%] bg-[#E6E6E6]">
//                     <img src={calendarIcon} alt="calendar" />
//                   </span>
//                 </div>
//               }
//               disabled={noLoansTaken}
//             />
//           </div>
//         </div>

//         {/* Search + View All */}
//         <div
//           className={`md:w-[50%] flex justify-between items-center gap-10 ${
//             noLoansTaken ? "opacity-50" : ""
//           }`}
//         >
//           <div
//             className="flex items-center justify-between gap-2.5 pl-3 shrink-0 
//               rounded-[30px] w-full md:w-[70%] border border-[rgba(0,0,0,0.08)] 
//               bg-[rgba(255,255,255,0.80)]"
//           >
//             <input
//               type="search"
//               placeholder={searchPlaceholder}
//               onFocus={() => setSearchPlaceholder("")}
//               onBlur={() =>
//                 setSearchPlaceholder(t("repaymentsSection.searchPlaceholder"))
//               }
//               className="text-[14px] w-[90%] md:text-[16px] text-[rgba(34,34,34,0.50)] 
//               rounded-full bg-transparent outline-none border-none"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               autoComplete="off"
//               disabled={noLoansTaken}
//             />
//             <button
//               className="cursor-pointer"
//               onClick={handleApplyFilters}
//               disabled={noLoansTaken}
//             >
//               <img src={searchIcon} alt="search" />
//             </button>
//           </div>
//           <Link
//             to={noLoansTaken ? "#" : "/loans/disbursed-loans"}
//             className={`text-[14px] md:text-[16px] text-[#2D6157] font-semibold ${
//               noLoansTaken ? "cursor-not-allowed" : ""
//             }`}
//             onClick={(e) => noLoansTaken && e.preventDefault()}
//           >
//             {t("repaymentsSection.viewAll")}
//           </Link>
//         </div>
//       </div>
//       {/* Apply / Clear row for desktop/tablet */}
//       {!noLoansTaken && (
//         <div className="hidden md:flex gap-4">
//           <button
//             onClick={handleApplyFilters}
//             className="text-[14px] md:text-[16px] font-semibold text-blue-600 cursor-pointer"
//           >
//             {t("repaymentsSection.applyFilters")}
//           </button>

//           <button
//             onClick={handleClearFilters}
//             className="text-[14px] md:text-[16px] font-semibold text-gray-600 cursor-pointer"
//           >
//             {t("repaymentsSection.clearFilters")}
//           </button>
//         </div>
//       )}
//       {/* MOBILE HEADER & CONTROLS */}
//       <div className="flex flex-col md:hidden w-full gap-4">
//         <div className="flex justify-between items-center">
//           <p className="font-raleway font-semibold text-[24px]">
//             {/* {t("repaymentsSection.mobileTitle")} */}
//             Disbursed Loans
//           </p>
//           <Link
//             to={noLoansTaken ? "#" : "/loans/disbursed-loans"}
//             className={`text-[14px] text-[#2D6157] font-semibold ${
//               noLoansTaken ? "opacity-50 cursor-not-allowed" : ""
//             }`}
//             onClick={(e) => noLoansTaken && e.preventDefault()}
//           >
//             {t("repaymentsSection.viewAll")}
//           </Link>
//         </div>

//         {/* Mobile Search */}
//         <div
//           className={`flex items-center justify-between gap-2.5 pl-3 shrink-0 rounded-[30px] w-full border border-[rgba(0,0,0,0.08)] bg-[rgba(255,255,255,0.80)] ${
//             noLoansTaken ? "opacity-50" : ""
//           }`}
//         >
//           <input
//             type="search"
//             placeholder={searchPlaceholder}
//             onFocus={() => setSearchPlaceholder("")}
//             onBlur={() =>
//               setSearchPlaceholder(t("repaymentsSection.searchPlaceholder"))
//             }
//             className="text-[14px] w-[90%] text-[rgba(34,34,34,0.50)] rounded-full 
//               bg-transparent outline-none border-none"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             autoComplete="off"
//             disabled={noLoansTaken}
//           />
//           <button
//             className="cursor-pointer"
//             onClick={handleApplyFilters}
//             disabled={noLoansTaken}
//           >
//             <img src={searchIcon} alt="search" />
//           </button>
//         </div>

//         {/* Mobile Date */}
//         <DatePicker
//           selected={startDate}
//           onChange={handleDateChange}
//           startDate={startDate}
//           endDate={endDate}
//           selectsRange
//           maxDate={new Date()}
//           customInput={
//             <div
//               className={`flex items-center justify-between gap-2.5 pl-3 shrink-0 rounded-[30px] border border-[rgba(0,0,0,0.08)] bg-[rgba(255,255,255,0.80)] cursor-pointer ${
//                 noLoansTaken ? "cursor-not-allowed" : ""
//               }`}
//             >
//               <p className="text-[16px] text-[rgba(34,34,34,0.80)] font-medium">
//                 {selectedDateText()}
//               </p>
//               <span className="block p-4 rounded-[50%] bg-[#E6E6E6]">
//                 <img src={calendarIcon} alt="calendar" />
//               </span>
//             </div>
//           }
//           disabled={noLoansTaken}
//         />

//         {/* Apply / Clear for mobile */}
//         {!noLoansTaken && (
//           <div className="flex gap-4">
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
//       </div>
//       {/* BODY */}
//       <div className="w-full flex items-start justify-between">
//         {error ? (
//           <p className="text-red-500 w-full text-center py-10">{error}</p>
//         ) : noLoans ? (
//           <div className="w-full flex flex-col justify-center items-center gap-6 py-20">
//             <p className="text-[#222] text-center">
//               No loans matched.
//             </p>
//           </div>
//         ) : isLargeScreen ? (
//           <>
//             <DisbursedLoansList loans={loans} onSelect={handleSelectLoan} selectedLoanId={selectedLoan} isLargeScreen={isLargeScreen}/>
//             {selectedLoan &&
//               (loanDetailsLoading ? (
//                 <PageLoader />
//               ) : (
//                 loanDetails && <LoanDetails loanDetails={loanDetails} />
//               ))}
//           </>
//         ) : (
//           <DisbursedLoansList loans={loans} onSelect={handleSelectLoan} isLargeScreen={isLargeScreen} />
//         )}
//       </div>
//     </div>
//   );
// }

// export default DisbursedLoansSection;


import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import calendarIcon from "../../assets/calendar icon.svg";
import searchIcon from "../../assets/search icon.svg";
import DisbursedLoansList from "./DisbursedLoansList";
import LoanDetails from "./LoanDetails";
import { fetchLoans, getLoanDetails } from "../../api/apiData";
import { useTranslation } from "react-i18next";
import { useDisbursedLoans } from "../../context/DisbursedLoansContext";
import PageLoader from "../PageLoader";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Simple debounce
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
};

function DisbursedLoansSection({ totalLoansTaken }) {
  const { setDisbursedLoansData } = useDisbursedLoans();
  const { t } = useTranslation();

  const [selectedLoan, setSelectedLoan] = useState(null);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [loans, setLoans] = useState([]);
  const [error, setError] = useState(null);
  const [loanDetails, setLoanDetails] = useState(null);
  const [loanDetailsLoading, setLoanDetailsLoading] = useState(false);
  
  // -- NEW STATE VARIABLE TO TRACK INPUT FOCUS --
  const [isInputFocused, setIsInputFocused] = useState(false);

  const debouncedSearchQuery = useDebounce(searchQuery, 400);

  useEffect(() => {
    const handleResize = () => setIsLargeScreen(window.innerWidth >= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch loan details on select
  useEffect(() => {
    const getLoanByID = async (id) => {
      setLoanDetailsLoading(true);
      setLoanDetails(null);
      try {
        const res = await getLoanDetails(id);
        if (res?.status) setLoanDetails(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoanDetailsLoading(false);
      }
    };
    if (selectedLoan) getLoanByID(selectedLoan);
  }, [selectedLoan]);

  const formatDate = (date) => {
    if (!date) return null;
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
  };

  const fetchFilteredLoans = async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchLoans(1, 10, { ...filters, status: "COMPLETED,DISBURSED" });
      if (res?.status) {
        const data = res.data.loans || [];
        setLoans(data);
        setDisbursedLoansData(data);
        if (isLargeScreen && data.length > 0) {
          setSelectedLoan(data[0]._id);
        } else {
          setSelectedLoan(null);
        }
        if (!data.length && res.data?.message) setError(res.data.message);
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchFilteredLoans();
  }, [isLargeScreen]);

  const handleApplyFilters = () => {
    const filters = {};
    if (debouncedSearchQuery.trim()) {
      filters.query = debouncedSearchQuery.trim();
    }
    if (startDate && endDate) {
      filters.startDate = formatDate(startDate);
      filters.endDate = formatDate(endDate);
    }
    fetchFilteredLoans(filters);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setStartDate(null);
    setEndDate(null);
    fetchFilteredLoans({});
  };

  const handleSelectLoan = (loanId) => setSelectedLoan(loanId);

  const handleDateChange = ([start, end]) => {
    if (start && !end) {
      setStartDate(start);
      setEndDate(start);
    } else {
      setStartDate(start);
      setEndDate(end);
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
    return t("disbursedLoansSection.selectDate");
  };

  if (loading) return <PageLoader />;

  const noLoans = loans.length === 0;
  const noLoansTaken = totalLoansTaken === 0;

  // -- GET TRANSLATED PLACEHOLDER TEXT DIRECTLY --
  const placeholderText = t("disbursedLoansSection.searchPlaceholder");

  return (
    <div className="rounded-xl flex flex-col self-stretch justify-center w-full items-start gap-6 bg-[#fff] lg:p-6">
      {/* DESKTOP/TABLET HEADER */}
      <div className="hidden md:flex justify-between items-start self-stretch w-full gap-6">
        {/* Date Picker */}
        <div className="flex justify-between items-center md:w-[45%] relative">
          <p className="font-raleway font-semibold md:text-[24px]">
            {t("disbursedLoansSection.title")}
          </p>
          <div className="ml-3.5 relative">
            <DatePicker
              selected={startDate}
              onChange={handleDateChange}
              startDate={startDate}
              endDate={endDate}
              selectsRange
              maxDate={new Date()}
              customInput={
                <div
                  className={`hidden md:flex md:items-center gap-2.5 pl-3 shrink-0 rounded-[30px] border border-[rgba(0,0,0,0.08)] bg-[rgba(255,255,255,0.80)] cursor-pointer ${
                    noLoansTaken ? "cursor-not-allowed" : ""
                  }`}
                >
                  <p className="text-[16px] text-[rgba(34,34,34,0.80)] font-medium">
                    {selectedDateText()}
                  </p>
                  <span className="block p-4 rounded-[50%] bg-[#E6E6E6]">
                    <img src={calendarIcon} alt="calendar" />
                  </span>
                </div>
              }
              disabled={noLoansTaken}
            />
          </div>
        </div>

        {/* Search + View All */}
        <div
          className={`md:w-[50%] flex justify-between items-center gap-10 ${
            noLoansTaken ? "opacity-50" : ""
          }`}
        >
          <div
            className="flex items-center justify-between gap-2.5 pl-3 shrink-0 
              rounded-[30px] w-full md:w-[70%] border border-[rgba(0,0,0,0.08)] 
              bg-[rgba(255,255,255,0.80)]"
          >
            <input
              type="search"
              // -- UPDATED PLACEHOLDER LOGIC --
              placeholder={isInputFocused ? "" : placeholderText}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
              className="text-[14px] w-[90%] md:text-[16px] text-[rgba(34,34,34,0.50)] 
              rounded-full bg-transparent outline-none border-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoComplete="off"
              disabled={noLoansTaken}
            />
            <button
              className="cursor-pointer"
              onClick={handleApplyFilters}
              disabled={noLoansTaken}
            >
              <img src={searchIcon} alt="search" />
            </button>
          </div>
          <Link
            to={noLoansTaken ? "#" : "/loans/disbursed-loans"}
            className={`text-[14px] md:text-[16px] text-[#2D6157] font-semibold ${
              noLoansTaken ? "cursor-not-allowed" : ""
            }`}
            onClick={(e) => noLoansTaken && e.preventDefault()}
          >
            {t("disbursedLoansSection.viewAll")}
          </Link>
        </div>
      </div>
      {/* Apply / Clear row for desktop/tablet */}
      {!noLoansTaken && (
        <div className="hidden md:flex gap-4">
          <button
            onClick={handleApplyFilters}
            className="text-[14px] md:text-[16px] font-semibold text-blue-600 cursor-pointer"
          >
            {t("disbursedLoansSection.applyFilters")}
          </button>

          <button
            onClick={handleClearFilters}
            className="text-[14px] md:text-[16px] font-semibold text-gray-600 cursor-pointer"
          >
            {t("disbursedLoansSection.clearFilters")}
          </button>
        </div>
      )}
      {/* MOBILE HEADER & CONTROLS */}
      <div className="flex flex-col md:hidden w-full gap-4">
        <div className="flex justify-between items-center">
          <p className="font-raleway font-semibold text-[24px]">
            {t("disbursedLoansSection.title")}
          </p>
          <Link
            to={noLoansTaken ? "#" : "/loans/disbursed-loans"}
            className={`text-[14px] text-[#2D6157] font-semibold ${
              noLoansTaken ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={(e) => noLoansTaken && e.preventDefault()}
          >
            {t("disbursedLoansSection.viewAll")}
          </Link>
        </div>

        {/* Mobile Search */}
        <div
          className={`flex items-center justify-between gap-2.5 pl-3 shrink-0 rounded-[30px] w-full border border-[rgba(0,0,0,0.08)] bg-[rgba(255,255,255,0.80)] ${
            noLoansTaken ? "opacity-50" : ""
          }`}
        >
          <input
            type="search"
            // -- UPDATED PLACEHOLDER LOGIC --
            placeholder={isInputFocused ? "" : placeholderText}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
            className="text-[14px] w-[90%] text-[rgba(34,34,34,0.50)] rounded-full 
              bg-transparent outline-none border-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoComplete="off"
            disabled={noLoansTaken}
          />
          <button
            className="cursor-pointer"
            onClick={handleApplyFilters}
            disabled={noLoansTaken}
          >
            <img src={searchIcon} alt="search" />
          </button>
        </div>

        {/* Mobile Date */}
        <DatePicker
          selected={startDate}
          onChange={handleDateChange}
          startDate={startDate}
          endDate={endDate}
          selectsRange
          maxDate={new Date()}
          customInput={
            <div
              className={`flex items-center justify-between gap-2.5 pl-3 shrink-0 rounded-[30px] border border-[rgba(0,0,0,0.08)] bg-[rgba(255,255,255,0.80)] cursor-pointer ${
                noLoansTaken ? "cursor-not-allowed" : ""
              }`}
            >
              <p className="text-[16px] text-[rgba(34,34,34,0.80)] font-medium">
                {selectedDateText()}
              </p>
              <span className="block p-4 rounded-[50%] bg-[#E6E6E6]">
                <img src={calendarIcon} alt="calendar" />
              </span>
            </div>
          }
          disabled={noLoansTaken}
        />

        {/* Apply / Clear for mobile */}
        {!noLoansTaken && (
          <div className="flex gap-4">
            <button
              onClick={handleApplyFilters}
              className="flex-1 text-[14px] font-semibold text-blue-600"
            >
              {t("disbursedLoansSection.applyFilters")}
            </button>

            <button
              onClick={handleClearFilters}
              className="flex-1 text-[14px] font-semibold text-gray-600"
            >
              {t("disbursedLoansSection.clearFilters")}
            </button>
          </div>
        )}
      </div>
      {/* BODY */}
      <div className="w-full flex items-start justify-between">
        {error ? (
          <p className="text-red-500 w-full text-center py-10">{error}</p>
        ) : noLoans ? (
          <div className="w-full flex flex-col justify-center items-center gap-6 py-20">
            <p className="text-[#222] text-center">
              {t("disbursedLoansSection.noResultsMessage")}
            </p>
          </div>
        ) : isLargeScreen ? (
          <>
            <DisbursedLoansList loans={loans} onSelect={handleSelectLoan} selectedLoanId={selectedLoan} isLargeScreen={isLargeScreen}/>
            {selectedLoan &&
              (loanDetailsLoading ? (
                <PageLoader />
              ) : (
                loanDetails && <LoanDetails loanDetails={loanDetails} />
              ))}
          </>
        ) : (
          <DisbursedLoansList loans={loans} onSelect={handleSelectLoan} isLargeScreen={isLargeScreen} />
        )}
      </div>
    </div>
  );
}

export default DisbursedLoansSection;