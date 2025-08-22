



// import { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import LoanDetails from "./LoanDetails";
// import calendarIcon from "../../assets/calendar icon.svg";
// import searchIcon from "../../assets/search icon.svg";
// import { useTranslation } from "react-i18next";
// import { getLoanDetails, fetchRepayments } from "../../api/apiData";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

// // Simple debounce hook
// const useDebounce = (value, delay) => {
//   const [debouncedValue, setDebouncedValue] = useState(value);
//   useEffect(() => {
//     const timer = setTimeout(() => setDebouncedValue(value), delay);
//     return () => clearTimeout(timer);
//   }, [value, delay]);
//   return debouncedValue;
// };

// function LoanDetailsScreenMobile() {
//   const { t } = useTranslation();
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [startDate, setStartDate] = useState(null);
//   const [endDate, setEndDate] = useState(null);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [searchPlaceholder, setSearchPlaceholder] = useState(
//     t("loanDetailsMobile.searchPlaceholder")
//   );
//   const [repayments, setRepayments] = useState([]);
//   const [selectedLoanId, setSelectedLoanId] = useState(id);
//   const [loanDetails, setLoanDetails] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [dataLoaded, setDataLoaded] = useState(false); // Gate for showing no results

//   const debouncedSearchQuery = useDebounce(searchQuery, 300);

//   // Fetch loan details
//   useEffect(() => {
//     const getLoanByID = async (loanID) => {
//       try {
//         const response = await getLoanDetails(loanID);
//         if (response?.status) setLoanDetails(response.data);
//       } catch (err) {
//         console.error("Error fetching loan details:", err);
//       }
//     };
//     if (selectedLoanId) getLoanByID(selectedLoanId);
//   }, [selectedLoanId]);

//   const formatDate = (date) => {
//     if (!date) return null;
//     return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
//       2,
//       "0"
//     )}-${String(date.getDate()).padStart(2, "0")}`;
//   };

//   const fetchFilteredRepayments = async (filters = {}) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await fetchRepayments(1, 10, filters);
//       if (res?.status) {
//         setRepayments(res.data.repayments || []);
//       } else {
//         setRepayments([]);
//       }
//     } catch (err) {
//       console.error("Error fetching disbursed loans:", err);
//       setRepayments([]);
//     } finally {
//       setLoading(false);
//       setDataLoaded(true); // Only marks loaded after actual response
//     }
//   };

//   const handleApplyFilters = () => {
//     const filters = {};
//     if (debouncedSearchQuery.trim()) {
//       filters.query = debouncedSearchQuery.trim();
//     }
//     if (startDate && endDate) {
//       filters.startDate = formatDate(startDate);
//       filters.endDate = formatDate(endDate);
//     }
//     fetchFilteredRepayments(filters);
//   };

//   const handleClearFilters = () => {
//     setSearchQuery("");
//     setStartDate(null);
//     setEndDate(null);
//     fetchFilteredRepayments({});
//   };

//   const handleSearchChange = (e) => {
//     setSearchQuery(e.target.value);
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

//   const selectedDateRangeText = () => {
//     if (startDate && endDate) {
//       const sameDay = startDate.getTime() === endDate.getTime();
//       if (sameDay) {
//         return startDate.toLocaleDateString(undefined, {
//           month: "short",
//           day: "numeric",
//           year: "numeric",
//         });
//       }
//       return `${startDate.toLocaleDateString(undefined, {
//         month: "short",
//         day: "numeric",
//         year: "numeric",
//       })} - ${endDate.toLocaleDateString(undefined, {
//         month: "short",
//         day: "numeric",
//         year: "numeric",
//       })}`;
//     }
//     return t("loanDetailsMobile.selectMonth");
//   };

//   if (loading) return <p>{t("loading") || "Loading..."}</p>;

//   const noRepayments = dataLoaded && !loading && repayments.length === 0;

//   return (
//     <div className="p-4 flex flex-col gap-4">
//       {/* Title + Date Picker */}
//       <div className="flex justify-between items-center mb-2 relative">
//         <p className="font-raleway font-semibold text-[24px]">
//           {t("loanDetailsMobile.title")}
         
//         </p>
//         <div className="ml-3.5 relative">
//           <DatePicker
//             selected={startDate}
//             onChange={handleDateChange}
//             startDate={startDate}
//             endDate={endDate}
//             selectsRange
//             maxDate={new Date()}
//             customInput={
//               <div className="flex items-center gap-2.5 pl-3 shrink-0 rounded-[30px]
//                               border border-[rgba(0,0,0,0.08)] bg-[rgba(255,255,255,0.80)] cursor-pointer">
//                 <p className="text-[16px] text-[rgba(34,34,34,0.80)] font-medium">
//                   {selectedDateRangeText()}
//                 </p>
//                 <span className="block p-4 rounded-[50%] bg-[#E6E6E6]">
//                   <img src={calendarIcon} alt="calendar" />
//                 </span>
//               </div>
//             }
//           />
//         </div>
//       </div>

//       {/* Search bar */}
//       <div className="flex items-center justify-between gap-2.5 pl-3 shrink-0 rounded-[30px]
//                       w-full border border-[rgba(0,0,0,0.08)] bg-[rgba(255,255,255,0.80)]">
//         <input
//           type="search"
//           placeholder={searchPlaceholder}
//           onFocus={() => setSearchPlaceholder("")}
//           onBlur={() => setSearchPlaceholder(t("loanDetailsMobile.searchPlaceholder"))}
//           className="text-[14px] w-[90%] text-[rgba(34,34,34,0.50)] rounded-full
//                      bg-transparent outline-none border-none"
//           value={searchQuery}
//           onChange={handleSearchChange}
//           autoComplete="off"
//         />
//         <button className="cursor-pointer" onClick={handleApplyFilters}>
//           <img src={searchIcon} alt="search" />
//         </button>
//       </div>

//       {/* Apply / Clear */}
//       <div className="flex gap-4">
//         <button
//           onClick={handleApplyFilters}
//           className="flex-1 text-[14px] font-semibold text-blue-600"
//         >
//           {t("repaymentsSection.applyFilters")}
//         </button>
//         <button
//           onClick={handleClearFilters}
//           className="flex-1 text-[14px] font-semibold text-gray-600"
//         >
//           {t("repaymentsSection.clearFilters")}
//         </button>
//       </div>

//       {/* Repayments list / message */}
//       <div className="flex flex-col gap-4">
//         {error ? (
//           <p className="text-red-500 text-center">{error}</p>
//         ) : noRepayments ? (
//           <p className="text-sm text-gray-500">
//             {t("loanDetailsMobile.noRepayments")}
//           </p>
//         ) : (
//           repayments.map((repayment) => (
//             <button
//               key={repayment._id}
//               onClick={() => setSelectedLoanId(repayment.loan._id)}
//               className={`${
//                 repayment.status === "COMPLETED"
//                   ? "bg-[#fafafa] text-[#2C2C2C]"
//                   : "bg-[#439182] text-white"
//               } cursor-pointer rounded-[24px] flex justify-between items-center
//                  self-stretch py-[12px] px-[15px] gap-4`}
//             >
//               <div className="flex flex-col items-start gap-1 text-[16px]">
//                 <span className="font-medium text-[15px]">
//                   {repayment.loan.loan_id}
//                 </span>
//                 <span className="text-[14px]">
//                   {new Date(repayment.repayment_date).toLocaleDateString("en-US", {
//                     year: "numeric",
//                     month: "long",
//                     day: "numeric",
//                   })}
//                 </span>
//               </div>
//               <span
//                 className={`rounded-[16px] ${
//                   repayment.status === "COMPLETED"
//                     ? "bg-[#323232] text-white"
//                     : "bg-white text-[#7D9776]"
//                 } font-medium text-[12px] py-1 px-2`}
//               >
//                 {repayment.status === "COMPLETED"
//                   ? t("loanDetailsMobile.statusCompleted")
//                   : t("loanDetailsMobile.statusPending")}
//               </span>
//               <span
//                 className={`font-medium flex items-center text-[16px] gap-1 ${
//                   repayment.status === "COMPLETED" ? "text-[#484747]" : "text-white"
//                 }`}
//               >
//                 <span className="md:text-[20px]">
//                   {repayment.amount_paid.toLocaleString()}
//                 </span>
//               </span>
//             </button>
//           ))
//         )}
//       </div>

//       {/* Loan Details Card */}
//       {loanDetails && <LoanDetails loanDetails={loanDetails} isVisible={true} />}

//       {/* Back button */}
//       <button
//         onClick={() => navigate(-1)}
//         className="text-[#2D6157] text-[14px] mt-4 underline"
//       >
//         ← {t("loanDetailsMobile.back")}
//       </button>
//     </div>
//   );
// }

// export default LoanDetailsScreenMobile;





// import { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import LoanDetails from "./LoanDetails";
// import calendarIcon from "../../assets/calendar icon.svg";
// import searchIcon from "../../assets/search icon.svg";
// import { useTranslation } from "react-i18next";
// import { getLoanDetails, fetchLoans } from "../../api/apiData";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

// // Simple debounce hook
// const useDebounce = (value, delay) => {
//   const [debouncedValue, setDebouncedValue] = useState(value);
//   useEffect(() => {
//     const timer = setTimeout(() => setDebouncedValue(value), delay);
//     return () => clearTimeout(timer);
//   }, [value, delay]);
//   return debouncedValue;
// };

// function LoanDetailsScreenMobile() {
//   const { t } = useTranslation();
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [startDate, setStartDate] = useState(null);
//   const [endDate, setEndDate] = useState(null);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [searchPlaceholder, setSearchPlaceholder] = useState(
//     t("loanDetailsMobile.searchPlaceholder")
//   );
//   const [loans, setLoans] = useState([]);
//   const [selectedLoanId, setSelectedLoanId] = useState(id);
//   const [loanDetails, setLoanDetails] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [dataLoaded, setDataLoaded] = useState(false);

//   const debouncedSearchQuery = useDebounce(searchQuery, 300);

//   // Fetch loan details
//   useEffect(() => {
//     const getLoanByID = async (loanID) => {
//       try {
//         const response = await getLoanDetails(loanID);
//         if (response?.status) setLoanDetails(response.data);
//       } catch (err) {
//         console.error("Error fetching loan details:", err);
//       }
//     };
//     if (selectedLoanId) getLoanByID(selectedLoanId);
//   }, [selectedLoanId]);

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
//         setLoans(res.data.loans || []);
//       } else {
//         setLoans([]);
//       }
//     } catch (err) {
//       console.error("Error fetching disbursed loans:", err);
//       setLoans([]);
//     } finally {
//       setLoading(false);
//       setDataLoaded(true);
//     }
//   };

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

//   const handleSearchChange = (e) => {
//     setSearchQuery(e.target.value);
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

//   const selectedDateRangeText = () => {
//     if (startDate && endDate) {
//       const sameDay = startDate.getTime() === endDate.getTime();
//       if (sameDay) {
//         return startDate.toLocaleDateString(undefined, {
//           month: "short",
//           day: "numeric",
//           year: "numeric",
//         });
//       }
//       return `${startDate.toLocaleDateString(undefined, {
//         month: "short",
//         day: "numeric",
//         year: "numeric",
//       })} - ${endDate.toLocaleDateString(undefined, {
//         month: "short",
//         day: "numeric",
//         year: "numeric",
//       })}`;
//     }
//     return t("loanDetailsMobile.selectMonth");
//   };

//   useEffect(() => {
//     fetchFilteredLoans();
//   }, []);

//   if (loading) return <p>{t("loading") || "Loading..."}</p>;

//   const noLoans = dataLoaded && !loading && loans.length === 0;

//   return (
//     <div className="p-4 flex flex-col gap-4">
//       {/* Title + Date Picker */}
//       <div className="flex justify-between items-center mb-2 relative">
//         <p className="font-raleway font-semibold text-[24px]">
//           Disbursed Loans
//         </p>
//         <div className="ml-3.5 relative">
//           <DatePicker
//             selected={startDate}
//             onChange={handleDateChange}
//             startDate={startDate}
//             endDate={endDate}
//             selectsRange
//             maxDate={new Date()}
//             customInput={
//               <div className="flex items-center gap-2.5 pl-3 shrink-0 rounded-[30px]
//                           border border-[rgba(0,0,0,0.08)] bg-[rgba(255,255,255,0.80)] cursor-pointer">
//                 <p className="text-[16px] text-[rgba(34,34,34,0.80)] font-medium">
//                   {selectedDateRangeText()}
//                 </p>
//                 <span className="block p-4 rounded-[50%] bg-[#E6E6E6]">
//                   <img src={calendarIcon} alt="calendar" />
//                 </span>
//               </div>
//             }
//           />
//         </div>
//       </div>

//       {/* Search bar */}
//       <div className="flex items-center justify-between gap-2.5 pl-3 shrink-0 rounded-[30px]
//                           w-full border border-[rgba(0,0,0,0.08)] bg-[rgba(255,255,255,0.80)]">
//         <input
//           type="search"
//           placeholder={searchPlaceholder}
//           onFocus={() => setSearchPlaceholder("")}
//           onBlur={() => setSearchPlaceholder(t("loanDetailsMobile.searchPlaceholder"))}
//           className="text-[14px] w-[90%] text-[rgba(34,34,34,0.50)] rounded-full
//                      bg-transparent outline-none border-none"
//           value={searchQuery}
//           onChange={handleSearchChange}
//           autoComplete="off"
//         />
//         <button className="cursor-pointer" onClick={handleApplyFilters}>
//           <img src={searchIcon} alt="search" />
//         </button>
//       </div>

//       {/* Apply / Clear */}
//       <div className="flex gap-4">
//         <button
//           onClick={handleApplyFilters}
//           className="flex-1 text-[14px] font-semibold text-blue-600"
//         >
//           {t("repaymentsSection.applyFilters")}
//         </button>
//         <button
//           onClick={handleClearFilters}
//           className="flex-1 text-[14px] font-semibold text-gray-600"
//         >
//           {t("repaymentsSection.clearFilters")}
//         </button>
//       </div>

//       {/* Loans list / message */}
//       <div className="flex flex-col gap-4">
//         {error ? (
//           <p className="text-red-500 text-center">{error}</p>
//         ) : noLoans ? (
//           <p className="text-sm text-gray-500">
//             No loans matched.
//           </p>
//         ) : (
//           loans.map((loan) => (
//             <button
//               key={loan._id}
//               onClick={() => setSelectedLoanId(loan._id)}
//               className={`${
//                 loan.status === "COMPLETED"
//                   ? "bg-[#fafafa] text-[#2C2C2C]"
//                   : "bg-[#439182] text-white"
//               } cursor-pointer rounded-[24px] flex justify-between items-center
//                 self-stretch py-[12px] px-[15px] gap-4`}
//             >
//               <div className="flex flex-col items-start gap-1 text-[16px]">
//                 <span className="font-medium text-[15px]">
//                   {loan.loan_id}
//                 </span>
//                 <span className="text-[14px]">
//                   {new Date(loan.disbursement_date).toLocaleDateString("en-US", {
//                     year: "numeric",
//                     month: "long",
//                     day: "numeric",
//                   })}
//                 </span>
//               </div>
//               <span
//                 className={`rounded-[16px] ${
//                   loan.status === "COMPLETED"
//                     ? "bg-[#323232] text-white"
//                     : "bg-white text-[#7D9776]"
//                 } font-medium text-[12px] py-1 px-2`}
//               >
//                 {loan.status === "COMPLETED"
//                   ? "Completed"
//                   : "Disbursed"}
//               </span>
//               <span
//                 className={`font-medium flex items-center text-[16px] gap-1 ${
//                   loan.status === "COMPLETED" ? "text-[#484747]" : "text-white"
//                 }`}
//               >
//                 <span className="md:text-[20px]">
//                   {loan.loan_amount.toLocaleString()}
//                 </span>
//               </span>
//             </button>
//           ))
//         )}
//       </div>

//       {/* Loan Details Card */}
//       {loanDetails && <LoanDetails loanDetails={loanDetails} isVisible={true} />}

//       {/* Back button */}
//       <button
//         onClick={() => navigate(-1)}
//         className="text-[#2D6157] text-[14px] mt-4 underline"
//       >
//         ← {t("loanDetailsMobile.back")}
//       </button>
//     </div>
//   );
// }

// export default LoanDetailsScreenMobile;

// import { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import LoanDetails from "./LoanDetails";
// import calendarIcon from "../../assets/calendar icon.svg";
// import searchIcon from "../../assets/search icon.svg";
// import { useTranslation } from "react-i18next";
// import { getLoanDetails, fetchLoans } from "../../api/apiData";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

// // Simple debounce hook
// const useDebounce = (value, delay) => {
//   const [debouncedValue, setDebouncedValue] = useState(value);
//   useEffect(() => {
//     const timer = setTimeout(() => setDebouncedValue(value), delay);
//     return () => clearTimeout(timer);
//   }, [value, delay]);
//   return debouncedValue;
// };

// function LoanDetailsScreenMobile() {
//   const { t } = useTranslation();
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [startDate, setStartDate] = useState(null);
//   const [endDate, setEndDate] = useState(null);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [searchPlaceholder, setSearchPlaceholder] = useState(
//     t("loanDetailsMobile.searchPlaceholder")
//   );
//   const [loans, setLoans] = useState([]);
//   const [selectedLoanId, setSelectedLoanId] = useState(id);
//   const [loanDetails, setLoanDetails] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [dataLoaded, setDataLoaded] = useState(false);

//   const debouncedSearchQuery = useDebounce(searchQuery, 300);

//   // Fetch loan details
//   useEffect(() => {
//     const getLoanByID = async (loanID) => {
//       try {
//         const response = await getLoanDetails(loanID);
//         if (response?.status) setLoanDetails(response.data);
//       } catch (err) {
//         console.error("Error fetching loan details:", err);
//       }
//     };
//     if (selectedLoanId) getLoanByID(selectedLoanId);
//   }, [selectedLoanId]);

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
//         const fetchedLoans = res.data.loans || [];
//         setLoans(fetchedLoans);
//         // Set selected loan to the first item in the filtered list
//         if (fetchedLoans.length > 0) {
//             setSelectedLoanId(fetchedLoans[0]._id);
//         } else {
//             setSelectedLoanId(null);
//         }
//       } else {
//         setLoans([]);
//         setSelectedLoanId(null);
//       }
//     } catch (err) {
//       console.error("Error fetching disbursed loans:", err);
//       setLoans([]);
//       setSelectedLoanId(null);
//     } finally {
//       setLoading(false);
//       setDataLoaded(true);
//     }
//   };

//   const handleApplyFilters = () => {
//     const filters = {};
//     if (debouncedSearchQuery.trim()) {
//       filters.query = debouncedSearchQuery.trim();
//     }
//     if (startDate && endDate) {
//       filters.startDate = formatDate(startDate);
//       filters.endDate = formatDate(endDate);
//     }
//     setLoanDetails(null);
//     fetchFilteredLoans(filters);
//   };

//   const handleClearFilters = () => {
//     setSearchQuery("");
//     setStartDate(null);
//     setEndDate(null);
//     setLoanDetails(null);
//     setSelectedLoanId(null);
//     fetchFilteredLoans({});
//   };

//   const handleSearchChange = (e) => {
//     setSearchQuery(e.target.value);
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

//   const selectedDateRangeText = () => {
//     if (startDate && endDate) {
//       const sameDay = startDate.getTime() === endDate.getTime();
//       if (sameDay) {
//         return startDate.toLocaleDateString(undefined, {
//           month: "short",
//           day: "numeric",
//           year: "numeric",
//         });
//       }
//       return `${startDate.toLocaleDateString(undefined, {
//         month: "short",
//         day: "numeric",
//         year: "numeric",
//       })} - ${endDate.toLocaleDateString(undefined, {
//         month: "short",
//         day: "numeric",
//         year: "numeric",
//       })}`;
//     }
//     return t("repaymentsSection.selectDate");
//   };

//   useEffect(() => {
//     fetchFilteredLoans();
//   }, []);

//   if (loading) return <p className="text-center">{t("Loading") || "Loading..."}</p>;

//   const noLoans = dataLoaded && !loading && loans.length === 0;

//   return (
//     <div className="p-4 flex flex-col gap-4">
//       {/* Title + Date Picker */}
//       <div className="flex justify-between items-center mb-2 relative">
//         <p className="font-raleway font-semibold text-[24px]">
//           Disbursed Loans
//         </p>
//         <div className="ml-3.5 relative">
//           <DatePicker
//             selected={startDate}
//             onChange={handleDateChange}
//             startDate={startDate}
//             endDate={endDate}
//             selectsRange
//             maxDate={new Date()}
//             customInput={
//               <div className="flex items-center gap-2.5 pl-3 shrink-0 rounded-[30px]
//                           border border-[rgba(0,0,0,0.08)] bg-[rgba(255,255,255,0.80)] cursor-pointer">
//                 <p className="text-[16px] text-[rgba(34,34,34,0.80)] font-medium">
//                   {selectedDateRangeText()}
//                 </p>
//                 <span className="block p-4 rounded-[50%] bg-[#E6E6E6]">
//                   <img src={calendarIcon} alt="calendar" />
//                 </span>
//               </div>
//             }
//           />
//         </div>
//       </div>

//       {/* Search bar */}
//       <div className="flex items-center justify-between gap-2.5 pl-3 shrink-0 rounded-[30px]
//                           w-full border border-[rgba(0,0,0,0.08)] bg-[rgba(255,255,255,0.80)]">
//         <input
//           type="search"
//           placeholder={searchPlaceholder}
//           onFocus={() => setSearchPlaceholder("")}
//           onBlur={() => setSearchPlaceholder(t("loanDetailsMobile.searchPlaceholder"))}
//           className="text-[14px] w-[90%] text-[rgba(34,34,34,0.50)] rounded-full
//                      bg-transparent outline-none border-none"
//           value={searchQuery}
//           onChange={handleSearchChange}
//           autoComplete="off"
//         />
//         <button className="cursor-pointer" onClick={handleApplyFilters}>
//           <img src={searchIcon} alt="search" />
//         </button>
//       </div>

//       {/* Apply / Clear */}
//       <div className="flex gap-4">
//         <button
//           onClick={handleApplyFilters}
//           className="flex-1 text-[14px] font-semibold text-blue-600"
//         >
//           {t("repaymentsSection.applyFilters")}
//         </button>
//         <button
//           onClick={handleClearFilters}
//           className="flex-1 text-[14px] font-semibold text-gray-600"
//         >
//           {t("repaymentsSection.clearFilters")}
//         </button>
//       </div>

//       {/* Loans list / message */}
//       <div className="flex flex-col gap-4">
//         {error ? (
//           <p className="text-red-500 text-center">{error}</p>
//         ) : noLoans ? (
//           <p className="text-sm text-gray-500">
//             No loans matched.
//           </p>
//         ) : (
//           loans.map((loan) => (
//             <button
//               key={loan._id}
//               onClick={() => setSelectedLoanId(loan._id)}
//               className={`${
//                 loan.status === "COMPLETED"
//                   ? "bg-[#fafafa] text-[#2C2C2C]"
//                   : "bg-[#439182] text-white"
//               } cursor-pointer rounded-[24px] flex justify-between items-center
//                 self-stretch py-[12px] px-[15px] gap-4
//                 ${loan._id === selectedLoanId ? "" : "opacity-50"}`
//               }
//             >
//               <div className="flex flex-col items-start gap-1 text-[16px]">
//                 <span className="font-medium text-[15px]">
//                   {loan.loan_id}
//                 </span>
//                 <span className="text-[14px]">
//                   {new Date(loan.disbursement_date).toLocaleDateString("en-US", {
//                     year: "numeric",
//                     month: "long",
//                     day: "numeric",
//                   })}
//                 </span>
//               </div>
//               <span
//                 className={`rounded-[16px] ${
//                   loan.status === "COMPLETED"
//                     ? "bg-[#323232] text-white"
//                     : "bg-white text-[#7D9776]"
//                 } font-medium text-[12px] py-1 px-2`}
//               >
//                 {loan.status === "COMPLETED"
//                   ? "Completed"
//                   : "Pending"}
//               </span>
//               <span
//                 className={`font-medium flex items-center text-[16px] gap-1 ${
//                   loan.status === "COMPLETED" ? "text-[#484747]" : "text-white"
//                 }`}
//               >
//                 <span className="md:text-[20px]">
//                   {loan.loan_amount.toLocaleString()}
//                 </span>
//               </span>
//             </button>
//           ))
//         )}
//       </div>

//       {/* Loan Details Card */}
//       {loanDetails && <LoanDetails loanDetails={loanDetails} isVisible={true} />}

//       {/* Back button */}
//       <button
//         onClick={() => navigate(-1)}
//         className="text-[#2D6157] text-[14px] mt-4 underline"
//       >
//         ← {t("loanDetailsMobile.back")}
//       </button>
//     </div>
//   );
// }

// export default LoanDetailsScreenMobile;


import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LoanDetails from "./LoanDetails";
import calendarIcon from "../../assets/calendar icon.svg";
import searchIcon from "../../assets/search icon.svg";
import { useTranslation } from "react-i18next";
import { getLoanDetails, fetchLoans } from "../../api/apiData";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PageLoader from "../PageLoader";

// Simple debounce hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
};

function LoanDetailsScreenMobile() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  // -- NEW STATE FOR INPUT FOCUS --
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [loans, setLoans] = useState([]);
  const [selectedLoanId, setSelectedLoanId] = useState(id);
  const [loanDetails, setLoanDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Fetch loan details
  useEffect(() => {
    const getLoanByID = async (loanID) => {
      try {
        const response = await getLoanDetails(loanID);
        if (response?.status) setLoanDetails(response.data);
      } catch (err) {
        console.error("Error fetching loan details:", err);
      }
    };
    if (selectedLoanId) getLoanByID(selectedLoanId);
  }, [selectedLoanId]);

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
        const fetchedLoans = res.data.loans || [];
        setLoans(fetchedLoans);
        // Set selected loan to the first item in the filtered list
        if (fetchedLoans.length > 0) {
          setSelectedLoanId(fetchedLoans[0]._id);
        } else {
          setSelectedLoanId(null);
        }
      } else {
        setLoans([]);
        setSelectedLoanId(null);
      }
    } catch (err) {
      console.error("Error fetching disbursed loans:", err);
      setLoans([]);
      setSelectedLoanId(null);
    } finally {
      setLoading(false);
      setDataLoaded(true);
    }
  };

  const handleApplyFilters = () => {
    const filters = {};
    if (debouncedSearchQuery.trim()) {
      filters.query = debouncedSearchQuery.trim();
    }
    if (startDate && endDate) {
      filters.startDate = formatDate(startDate);
      filters.endDate = formatDate(endDate);
    }
    setLoanDetails(null);
    fetchFilteredLoans(filters);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setStartDate(null);
    setEndDate(null);
    setLoanDetails(null);
    setSelectedLoanId(null);
    fetchFilteredLoans({});
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
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

  const selectedDateRangeText = () => {
    if (startDate && endDate) {
      const sameDay = startDate.getTime() === endDate.getTime();
      if (sameDay) {
        return startDate.toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
      }
      return `${startDate.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })} - ${endDate.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })}`;
    }
    return t("disbursedLoans.selectDate");
  };

  useEffect(() => {
    fetchFilteredLoans();
  }, []);

  if (loading) return <PageLoader />;

  const noLoans = dataLoaded && !loading && loans.length === 0;

  // -- GET TRANSLATED PLACEHOLDER TEXT DIRECTLY --
  const placeholderText = t("loanDetailsMobile.searchPlaceholder");

  return (
    <div className="p-4 flex flex-col gap-4">
      {/* Title + Date Picker */}
      <div className="flex justify-between items-center mb-2 relative">
        <p className="font-raleway font-semibold text-[24px]">
          {t("disbursedLoans.title")}
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
              <div className="flex items-center gap-2.5 pl-3 shrink-0 rounded-[30px]
                             border border-[rgba(0,0,0,0.08)] bg-[rgba(255,255,255,0.80)] cursor-pointer">
                <p className="text-[16px] text-[rgba(34,34,34,0.80)] font-medium">
                  {selectedDateRangeText()}
                </p>
                <span className="block p-4 rounded-[50%] bg-[#E6E6E6]">
                  <img src={calendarIcon} alt="calendar" />
                </span>
              </div>
            }
          />
        </div>
      </div>

      {/* Search bar */}
      <div className="flex items-center justify-between gap-2.5 pl-3 shrink-0 rounded-[30px]
                         w-full border border-[rgba(0,0,0,0.08)] bg-[rgba(255,255,255,0.80)]">
        <input
          type="search"
          // -- UPDATED PLACEHOLDER LOGIC --
          placeholder={isInputFocused ? "" : placeholderText}
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => setIsInputFocused(false)}
          className="text-[14px] w-[90%] text-[rgba(34,34,34,0.50)] rounded-full
                     bg-transparent outline-none border-none"
          value={searchQuery}
          onChange={handleSearchChange}
          autoComplete="off"
        />
        <button className="cursor-pointer" onClick={handleApplyFilters}>
          <img src={searchIcon} alt="search" />
        </button>
      </div>

      {/* Apply / Clear */}
      <div className="flex gap-4">
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

      {/* Loans list / message */}
      <div className="flex flex-col gap-4">
        {error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : noLoans ? (
          <p className="text-sm text-gray-500">
            {t("disbursedLoansList.noResultsMessage")}
          </p>
        ) : (
          loans.map((loan) => (
            <button
              key={loan._id}
              onClick={() => setSelectedLoanId(loan._id)}
              className={`${
                loan.status === "COMPLETED"
                  ? "bg-[#fafafa] text-[#2C2C2C]"
                  : "bg-[#439182] text-white"
              } cursor-pointer rounded-[24px] flex justify-between items-center
                self-stretch py-[12px] px-[15px] gap-4
                ${loan._id === selectedLoanId ? "" : "opacity-50"}`
              }
            >
              <div className="flex flex-col items-start gap-1 text-[16px]">
                <span className="font-medium text-[15px]">
                  {loan.loan_id}
                </span>
                <span className="text-[14px]">
                  {new Date(loan.disbursement_date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <span
                className={`rounded-[16px] ${
                  loan.status === "COMPLETED"
                    ? "bg-[#323232] text-white"
                    : "bg-white text-[#7D9776]"
                } font-medium text-[12px] py-1 px-2`}
              >
                {loan.status === "COMPLETED"
                  ? t("disbursedLoansList.statusCompleted")
                  : t("disbursedLoansList.statusPending")}
              </span>
              <span
                className={`font-medium flex items-center text-[16px] gap-1 ${
                  loan.status === "COMPLETED" ? "text-[#484747]" : "text-white"
                }`}
              >
                <span className="md:text-[20px]">
                  {loan.loan_amount.toLocaleString()}
                </span>
              </span>
            </button>
          ))
        )}
      </div>

      {/* Loan Details Card */}
      {selectedLoanId && loanDetails && <LoanDetails loanDetails={loanDetails} isVisible={true} />}

      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="text-[#2D6157] text-[14px] mt-4 underline"
      >
        ← {t("loanDetailsMobile.back")}
      </button>
    </div>
  );
}

export default LoanDetailsScreenMobile;