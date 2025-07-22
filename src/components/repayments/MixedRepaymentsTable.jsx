import RepaymentHistoryHeader from "./RepaymentsHistoryHeader";
import NairaIcon from "../../assets/naira icon.svg";
import reloadIcon from "../../assets/reload-icon.svg";
import alertIcon from "../../assets/alert-icon.svg";
import VerifiedIcon from "../../assets/verified icon.svg";
import PendingIcon from "../../assets/pending icon.svg";
import FailedIcon from "../../assets/failed icon.svg";
import chevronDown from "../../assets/chevron-down.svg";
import { useRepayments } from "../../context/RepaymentsContext";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import PageLoader from "../PageLoader";
import { useTranslation } from "react-i18next";

export default function MixedRepaymentsTable() {
  const { t } = useTranslation();

  const { loanID } = useParams();
  const { repaymentsData } = useRepayments();

  const [repaymentsByID, setRepaymentsByID] = useState([]);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [perPageOpen, setPerPageOpen] = useState(false);

  // Month filter
  const now = new Date();
  const currentMonthStr = `${now.getFullYear()}-${String(
    now.getMonth() + 1
  ).padStart(2, "0")}`;
  const [selectedMonth, setSelectedMonth] = useState(currentMonthStr);
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  useEffect(() => {
    setLoading(true);
    try {
      const filtered = repaymentsData.filter(
        (repayment) => repayment.loan_id === loanID
      );
      setRepaymentsByID(filtered);
    } catch (err) {
      console.error("Error filtering repayments:", err);
    } finally {
      setLoading(false);
    }
  }, [loanID, repaymentsData]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedMonth]);

  const filteredByMonth = repaymentsByID.filter((repayment) => {
    if (!selectedMonth) return true;
    const date = new Date(repayment.repayment_date);
    const monthStr = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`;
    return monthStr === selectedMonth;
  });

  // Pagination logic
  const totalItems = filteredByMonth.length;
  const totalPages = Math.ceil(totalItems / perPage);
  const startIndex = (currentPage - 1) * perPage;
  const endIndex = startIndex + perPage;
  const paginatedRepayments = filteredByMonth.slice(startIndex, endIndex);

  const handlePerPageChange = (newLimit) => {
    setPerPage(newLimit);
    setPerPageOpen(false);
    setCurrentPage(1);
  };

  const handleMonthChange = (e) => {
    const newMonth = e.target.value;
    setSelectedMonth(newMonth);
    setShowMonthPicker(false);
    setCurrentPage(1);
  };

  const reloadPage = () => window.location.reload();

  if (loading) return <PageLoader />;

  return (
    <div className="px-3.5 mb-12 md:px-10">
      {/* <RepaymentHistoryHeader /> */}
      <RepaymentHistoryHeader
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
      />

      <div className="flex items-start gap-3 rounded-[12px] bg-white p-3 my-6">
        <img src={alertIcon} alt="alert icon" />
        <p className="text-[#333] text-[14px]">
          {t("mixedRepaymentsTable.note")}
        </p>
      </div>

      {/* DESKTOP */}
      <div className="hidden lg:block bg-white rounded-2xl py-4">
        <div className="flex justify-between items-center py-2.5 px-3 mx-4 mb-4.5">
          <div
            className="border border-[rgba(0,0,0,0.08)] rounded-[8px] px-3 py-2 cursor-pointer"
            onClick={reloadPage}
          >
            <img src={reloadIcon} alt="reload icon" className="block" />
          </div>

          <div className="relative">
            <div
              className="flex items-center gap-2 rounded-[8px] border border-[#e5e5e5] px-3 py-1 cursor-pointer"
              onClick={() => setShowMonthPicker(!showMonthPicker)}
            >
              <p className="text-[#222] text-sm py-0.5">
                {t("mixedRepaymentsTable.thisMonth")}
              </p>
              <img
                src={chevronDown}
                alt="dropdown icon"
                className="ml-1 w-4 block"
              />
            </div>
            {showMonthPicker && (
              <input
                type="month"
                value={selectedMonth}
                onChange={handleMonthChange}
                className="mt-2 border rounded px-2 py-1 text-sm w-full"
              />
            )}
          </div>
        </div>

        <div className="grid grid-cols-5 py-3 px-4 border-y border-y-[rgba(0,0,0,0.04)] text-[#333] font-medium bg-[#fafafa]">
          <p>{t("mixedRepaymentsTable.date")}</p>
          <p>{t("mixedRepaymentsTable.type")}</p>
          <p>{t("mixedRepaymentsTable.quantity")}</p>
          <p>{t("mixedRepaymentsTable.amount")}</p>
          <p>{t("mixedRepaymentsTable.status")}</p>
        </div>

        {paginatedRepayments.length === 0 && (
          <div className="text-center text-[#666] py-6">
            {t("mixedRepaymentsTable.noRepayments")}
          </div>
        )}

        {paginatedRepayments.map((repayment, index) => (
          <div
            key={index}
            className="grid grid-cols-5 py-4 px-4 items-center border-y border-y-[rgba(0,0,0,0.04)]"
          >
            <p className="text-[#666] text-[14px]">
              {new Date(repayment.repayment_date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <p className="text-[#222]">{repayment.repayment_method}</p>
            <p className="text-[#444]">
              {repayment.repayment_method !== "CASH"
                ? repayment.plastic_weight_kg
                : "-"}
            </p>
            <div className="flex items-center gap-1">
              <img src={NairaIcon} alt="naira icon" />
               <span>
                {new Intl.NumberFormat("en-NG", {
                  style: "decimal",
             
                  maximumFractionDigits: 2,
                }).format(repayment.amount_paid)}
              </span>
            </div>
            {repayment.status === "COMPLETED" && (
              <div className="flex gap-1 items-center py-[2px] px-1.5 rounded-[6px] border border-[#D3F3DF] bg-[#F2FDF5] w-fit">
                <img src={VerifiedIcon} alt="verified icon" />
                <p className="text-[14px] text-[#16A34A]">
                  {t("mixedRepaymentsTable.completed")}
                </p>
              </div>
            )}
            {repayment.status === "PENDING" && (
              <div className="flex gap-1 items-center py-[2px] px-1.5 rounded-[6px] border border-[rgba(217,145,0,0.60)] bg-[rgba(217,145,0,0.14)] w-fit">
                <img src={PendingIcon} alt="pending icon" />
                <p className="text-[14px] text-[#D99100]">
                  {t("mixedRepaymentsTable.pending")}
                </p>
              </div>
            )}
            {repayment.status === "FAILED" && (
              <div className="flex gap-1 items-center py-[2px] px-1.5 rounded-[6px] border border-[rgba(239,68,68,0.15)] bg-[rgba(239,68,68,0.08)] w-fit">
                <img src={FailedIcon} alt="failed icon" />
                <p className="text-[14px] text-[#EF4444]">
                  {t("mixedRepaymentsTable.failed")}
                </p>
              </div>
            )}
          </div>
        ))}

        <div className="flex items-center justify-between mt-4 px-4">
          <button
            className="text-sm border px-3 py-1 rounded-[8px] border-[rgba(0,0,0,0.16)] text-[#333] font-semibold"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            {t("mixedRepaymentsTable.previous")}
          </button>

          <div className="relative">
            <div
              className="flex items-center gap-2 rounded-[8px] border border-[#e5e5e5] px-3 cursor-pointer"
              onClick={() => setPerPageOpen(!perPageOpen)}
            >
              <p className="text-[#999] text-sm py-0.5">
                {t("mixedRepaymentsTable.perPage")}
              </p>
              <span className="text-[#333] block border-l border-l-[#e5e5e5] pl-2.5 py-0.5">
                {perPage}
              </span>
              <img
                src={chevronDown}
                alt="dropdown icon"
                className="ml-1 w-4 block"
              />
            </div>
            {perPageOpen && (
              <div className="absolute mt-1 bg-white border rounded shadow z-10">
                {[
                  10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80,
                  85, 90, 95, 100,
                ].map((num) => (
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
            className="text-sm border px-3 py-1 rounded-[8px] border-[rgba(0,0,0,0.16)] text-[#333] font-semibold"
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            {t("mixedRepaymentsTable.next")}
          </button>
        </div>
      </div>

      {/* MOBILE */}
      <div className="block lg:hidden space-y-4 bg-white rounded-2xl py-6 px-4">
        {/* <div className="flex justify-end mb-4">
          <div className="relative">
            <img
              src={chevronDown} // You can replace this with your actual calendar icon if it's different
              alt="calendar icon"
              className="w-5 h-5 cursor-pointer"
              onClick={() => setShowMonthPicker(!showMonthPicker)}
            />
            {showMonthPicker && (
              <input
                type="month"
                value={selectedMonth}
                onChange={handleMonthChange}
                className="mt-2 border rounded px-2 py-1 text-sm w-full"
              />
            )}
          </div>
        </div> */}

        {paginatedRepayments.length === 0 && (
          <div className="text-center text-[#666] py-6">
            {t("mixedRepaymentsTable.noRepayments")}
          </div>
        )}

        {paginatedRepayments.map((repayment, index) => (
          <div
            key={index}
            className="flex justify-between items-center pt-4 pb-4 border-b border-b-[rgba(0,0,0,0.04)]"
          >
            <div>
              <p className="text-[#222] font-medium">
                {repayment.repayment_method}
              </p>
              <p className="text-[#666] text-[14px]">
                {new Date(repayment.repayment_date).toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}
              </p>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1 mt-1">
                <img src={NairaIcon} alt="naira icon" />
                 <span>
                {new Intl.NumberFormat("en-NG", {
                  style: "decimal",
                  
                  maximumFractionDigits: 2,
                }).format(repayment.amount_paid)}
              </span>
              </div>
              <p className="text-[#444] text-[14px]">
                {repayment.plastic_weight_kg}
              </p>
            </div>

            {repayment.status === "COMPLETED" && (
              <div className="flex gap-1 items-center py-[2px] px-1.5 rounded-[6px] border border-[#D3F3DF] bg-[#F2FDF5] w-fit">
                <img src={VerifiedIcon} alt="verified icon" />
                <p className="text-[14px] text-[#16A34A]"> {t("mixedRepaymentsTable.completed")}</p>
              </div>
            )}
            {repayment.status === "PENDING" && (
              <div className="flex gap-1 items-center py-[2px] px-1.5 rounded-[6px] border border-[#FEE4C7] bg-[#FFFAF2] w-fit">
                <img src={PendingIcon} alt="pending icon" />
                <p className="text-[14px] text-[#DC6803]"> {t("mixedRepaymentsTable.pending")}</p>
              </div>
            )}
            {repayment.status === "FAILED" && (
              <div className="flex gap-1 items-center py-[2px] px-1.5 rounded-[6px] border border-[#FEE4E2] bg-[#FFFAF2] w-fit">
                <img src={FailedIcon} alt="failed icon" />
                <p className="text-[14px] text-[#D92D20]"> {t("mixedRepaymentsTable.failed")}</p>
              </div>
            )}
          </div>
        ))}

        {/* Pagination + Per page controls */}
        <div className="flex items-center justify-between mt-4">
          <button
            className="text-sm border px-3 py-1.5 rounded-[8px] border-[rgba(0,0,0,0.16)] text-[#333] font-semibold"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
             {t("mixedRepaymentsTable.previous")}
          </button>

          <div className="relative">
            <div
              className="flex items-center gap-2 rounded-[8px] border border-[#e5e5e5] px-3 cursor-pointer"
              onClick={() => setPerPageOpen(!perPageOpen)}
            >
              <p className="text-[#999] text-sm py-1"> {t("mixedRepaymentsTable.perPage")}</p>
              <span className="text-[#333] block border-l border-l-[#e5e5e5] pl-2.5 py-1">
                {perPage}
              </span>
              <img
                src={chevronDown}
                alt="dropdown icon"
                className="ml-1 w-4 block"
              />
            </div>
            {perPageOpen && (
              <div className="absolute mt-1 bg-white border rounded shadow z-10">
                {[
                  10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80,
                  85, 90, 95, 100,
                ].map((num) => (
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
            className="text-sm border px-3 py-1.5 rounded-[8px] border-[rgba(0,0,0,0.16)] text-[#333] font-semibold"
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
             {t("mixedRepaymentsTable.next")}
          </button>
        </div>
      </div>
    </div>
  );
}


// import RepaymentHistoryHeader from "./RepaymentsHistoryHeader";
// import NairaIcon from "../../assets/naira icon.svg";
// import reloadIcon from "../../assets/reload-icon.svg";
// import alertIcon from "../../assets/alert-icon.svg";
// import VerifiedIcon from "../../assets/verified icon.svg";
// import PendingIcon from "../../assets/pending icon.svg";
// import FailedIcon from "../../assets/failed icon.svg";
// import chevronDown from "../../assets/chevron-down.svg";
// import { useRepayments } from "../../context/RepaymentsContext";
// import { useParams } from "react-router-dom";
// import { useState, useEffect } from "react";
// import PageLoader from "../PageLoader";
// import { useTranslation } from "react-i18next";

// export default function MixedRepaymentsTable() {
//   const { t } = useTranslation();
//   const { loanID } = useParams();

//   const { repaymentsData } = useRepayments();

//   const [repaymentsByID, setRepaymentsByID] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const [currentPage, setCurrentPage] = useState(1);
//   const [perPage, setPerPage] = useState(10);
//   const [perPageOpen, setPerPageOpen] = useState(false);

  

//   // Month filter
//   const now = new Date();
//   const currentMonthStr = `${now.getFullYear()}-${String(
//     now.getMonth() + 1
//   ).padStart(2, "0")}`;
//   const [selectedMonth, setSelectedMonth] = useState(currentMonthStr);
//   const [showMonthPicker, setShowMonthPicker] = useState(false);

//   useEffect(() => {
//     setLoading(true);
//     try {
//       const filtered = repaymentsData.filter(
//         (repayment) => repayment.loan_id === loanID
//       );
//       setRepaymentsByID(filtered);
//     } catch (err) {
//       console.error("Error filtering repayments:", err);
//     } finally {
//       setLoading(false);
//     }
//   }, [loanID, repaymentsData]);

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [selectedMonth]);

//   const filteredByMonth = repaymentsByID.filter((repayment) => {
//     if (!selectedMonth) return true;
//     const date = new Date(repayment.repayment_date);
//     const monthStr = `${date.getFullYear()}-${String(
//       date.getMonth() + 1
//     ).padStart(2, "0")}`;
//     return monthStr === selectedMonth;
//   });

//   // Pagination logic
//   const totalItems = filteredByMonth.length;
//   const totalPages = Math.ceil(totalItems / perPage);
//   const startIndex = (currentPage - 1) * perPage;
//   const endIndex = startIndex + perPage;
//   const paginatedRepayments = filteredByMonth.slice(startIndex, endIndex);

//   const handlePerPageChange = (newLimit) => {
//     setPerPage(newLimit);
//     setPerPageOpen(false);
//     setCurrentPage(1);
//   };

//   const handleMonthChange = (e) => {
//     const newMonth = e.target.value;
//     setSelectedMonth(newMonth);
//     setShowMonthPicker(false);
//     setCurrentPage(1);
//   };

//   const reloadPage = () => window.location.reload();

//   if (loading) return <PageLoader />;

//   // Currency formatter with icon (same as CashRepayments)
//   function formatNaira(amount) {
//     return (
//       <span className="flex items-center gap-1">
//         <img src={NairaIcon} alt="naira icon" />
//         <span>
//           {new Intl.NumberFormat("en-NG", {
//             style: "decimal",
//             minimumFractionDigits: 2,
//             maximumFractionDigits: 2,
//           }).format(amount)}
//         </span>
//       </span>
//     );
//   }

//   // Date formatter (day, short month, year with comma)
//   function formatDate(dateStr) {
//     const date = new Date(dateStr);
//     const day = date.getDate();
//     const month = date.toLocaleString("en-GB", { month: "short" });
//     const year = date.getFullYear();
//     return `${day}, ${month} ${year}`;
//   }

//   return (
//     <div className="px-3.5 mb-12 md:px-10">
//       {/* Header */}
//       <RepaymentHistoryHeader
//         selectedMonth={selectedMonth}
//         setSelectedMonth={setSelectedMonth}
//       />

//       {/* Note alert */}
//       <div className="flex items-start gap-3 rounded-[12px] bg-white p-3 my-6">
//         <img src={alertIcon} alt="alert icon" />
//         <p className="text-[#333] text-[14px]">{t("mixedRepaymentsTable.note")}</p>
//       </div>

//       {/* DESKTOP TABLE */}
//       <div className="hidden lg:block bg-white rounded-2xl py-4">
//         <div className="flex justify-between items-center py-2.5 px-3 mx-4 mb-4.5">
//           <div
//             className="border border-[rgba(0,0,0,0.08)] rounded-[8px] px-3 py-2 cursor-pointer"
//             onClick={reloadPage}
//           >
//             <img src={reloadIcon} alt="reload icon" className="block" />
//           </div>
//           <div className="relative">
//             <div
//               className="flex items-center gap-2 rounded-[8px] border border-[#e5e5e5] px-3 py-1 cursor-pointer"
//               onClick={() => setShowMonthPicker(!showMonthPicker)}
//             >
//               <p className="text-[#222] text-sm py-0.5">
//                 {t("mixedRepaymentsTable.thisMonth")}
//               </p>
//               <img
//                 src={chevronDown}
//                 alt="dropdown icon"
//                 className="ml-1 w-4 block"
//               />
//             </div>
//             {showMonthPicker && (
//               <input
//                 type="month"
//                 value={selectedMonth}
//                 onChange={handleMonthChange}
//                 className="mt-2 border rounded px-2 py-1 text-sm w-full"
//               />
//             )}
//           </div>
//         </div>

//         {/* Table Head */}
//         <div className="grid grid-cols-5 py-3 px-4 border-y border-y-[rgba(0,0,0,0.04)] text-[#333] font-medium bg-[#fafafa]">
//           <p>{t("mixedRepaymentsTable.date")}</p>
//           <p>{t("mixedRepaymentsTable.type")}</p>
//           <p>{t("mixedRepaymentsTable.quantity")}</p>
//           <p>{t("mixedRepaymentsTable.amount")}</p>
//           <p>{t("mixedRepaymentsTable.status")}</p>
//         </div>

//         {/* Table Body */}
//         {paginatedRepayments.length === 0 && (
//           <div className="text-center text-[#666] py-6">
//             {t("mixedRepaymentsTable.noRepayments")}
//           </div>
//         )}

//         {paginatedRepayments.map((repayment, index) => (
//           <div
//             key={index}
//             className="grid grid-cols-5 py-4 px-4 items-center border-y border-y-[rgba(0,0,0,0.04)]"
//           >
//             <p className="text-[#484747]">{formatDate(repayment.repayment_date)}</p>
//             <p className="text-[#222]">{repayment.repayment_method}</p>
//             <p className="text-[#444]">
//               {repayment.repayment_method !== "CASH"
//                 ? repayment.plastic_weight_kg
//                 : "-"}
//             </p>
//             <div>{formatNaira(repayment.amount_paid)}</div>
//             <div>
//               {repayment.status === "COMPLETED" && (
//                 <div className="flex gap-1 items-center py-[2px] px-1.5 rounded-[6px] border border-[#D3F3DF] bg-[#F2FDF5] w-fit">
//                   <img src={VerifiedIcon} alt="verified icon" />
//                   <p className="text-[14px] text-[#16A34A]">
//                     {t("mixedRepaymentsTable.completed")}
//                   </p>
//                 </div>
//               )}
//               {repayment.status === "PENDING" && (
//                 <div className="flex gap-1 items-center py-[2px] px-1.5 rounded-[6px] border border-[rgba(217,145,0,0.60)] bg-[rgba(217,145,0,0.14)] w-fit">
//                   <img src={PendingIcon} alt="pending icon" />
//                   <p className="text-[14px] text-[#D99100]">
//                     {t("mixedRepaymentsTable.pending")}
//                   </p>
//                 </div>
//               )}
//               {repayment.status === "FAILED" && (
//                 <div className="flex gap-1 items-center py-[2px] px-1.5 rounded-[6px] border border-[rgba(239,68,68,0.15)] bg-[rgba(239,68,68,0.08)] w-fit">
//                   <img src={FailedIcon} alt="failed icon" />
//                   <p className="text-[14px] text-[#EF4444]">
//                     {t("mixedRepaymentsTable.failed")}
//                   </p>
//                 </div>
//               )}
//             </div>
//           </div>
//         ))}

//         {/* Pagination */}
//         <div className="flex items-center justify-between mt-4 px-4">
//           <button
//             className="text-sm border px-3 py-1 rounded-[8px] bg-white border-[rgba(0,0,0,0.16)] text-[#333] font-semibold"
//             disabled={currentPage === 1}
//             onClick={() => setCurrentPage((p) => p - 1)}
//           >
//             {t("mixedRepaymentsTable.previous")}
//           </button>
//           <div className="relative">
//             <div
//               className="flex items-center gap-2 rounded-[8px] bg-white border border-[#e5e5e5] px-3 cursor-pointer"
//               onClick={() => setPerPageOpen(!perPageOpen)}
//             >
//               <p className="text-[#999] text-sm py-0.5">
//                 {t("mixedRepaymentsTable.perPage")}
//               </p>
//               <span className="text-[#333] block border-l border-l-[#e5e5e5] pl-2.5 py-0.5">
//                 {perPage}
//               </span>
//               <img
//                 src={chevronDown}
//                 alt="dropdown icon"
//                 className="ml-1 w-4 block"
//               />
//             </div>
//             {perPageOpen && (
//               <div className="absolute mt-1 bg-white border rounded shadow z-10">
//                 {[
//                   10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80,
//                   85, 90, 95, 100,
//                 ].map((num) => (
//                   <div
//                     key={num}
//                     className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
//                     onClick={() => handlePerPageChange(num)}
//                   >
//                     {num}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//           <button
//             className="text-sm border px-3 py-1 rounded-[8px] bg-white border-[rgba(0,0,0,0.16)] text-[#333] font-semibold"
//             disabled={currentPage === totalPages || totalPages === 0}
//             onClick={() => setCurrentPage((p) => p + 1)}
//           >
//             {t("mixedRepaymentsTable.next")}
//           </button>
//         </div>
//       </div>

//       {/* MOBILE CARDS */}
//       <div className="block lg:hidden space-y-4 rounded-2xl py-6">
//         {paginatedRepayments.length === 0 && (
//           <div className="text-center text-[#666] py-6">
//             {t("mixedRepaymentsTable.noRepayments")}
//           </div>
//         )}

//         {paginatedRepayments.map((repayment, index) => (
//           <div
//             key={index}
//             className="flex flex-col rounded-[12px] gap-3 p-4 bg-white border-[rgba(0,0,0,0.04)] md:text-[16px]"
//           >
//             <div className="flex justify-between font-medium">
//               <p className="text-[#222]">Date:</p>
//               <p className="text-[#484747]">{formatDate(repayment.repayment_date)}</p>
//             </div>
//             <div className="flex justify-between font-medium">
//               <p className="text-[#222]">Type:</p>
//               <p className="text-[#484747]">{repayment.repayment_method}</p>
//             </div>
//             <div className="flex justify-between font-medium">
//               <p className="text-[#222]">Quantity:</p>
//               <p className="text-[#484747]">
//                 {repayment.repayment_method !== "CASH"
//                   ? repayment.plastic_weight_kg
//                   : "-"}
//               </p>
//             </div>
//             <div className="flex justify-between font-medium">
//               <p className="text-[#222]">Amount:</p>
//               <div>{formatNaira(repayment.amount_paid)}</div>
//             </div>
//             <div className="flex justify-between font-medium">
//               <p className="text-[#222]">Status:</p>
//               <div>
//                 {repayment.status === "COMPLETED" && (
//                   <div className="flex gap-1 items-center py-[2px] px-1.5 rounded-[6px] border border-[#D3F3DF] bg-[#F2FDF5] w-fit">
//                     <img src={VerifiedIcon} alt="verified icon" />
//                     <p className="text-[14px] md:text-[14px] text-[#16A34A] font-normal">
//                       {t("mixedRepaymentsTable.completed")}
//                     </p>
//                   </div>
//                 )}
//                 {repayment.status === "PENDING" && (
//                   <div className="flex gap-1 items-center py-[2px] px-1.5 rounded-[6px] border border-[#FEE4C7] bg-[#FFFAF2] w-fit">
//                     <img src={PendingIcon} alt="pending icon" />
//                     <p className="text-[14px] md:text-[14px] text-[#DC6803] font-normal">
//                       {t("mixedRepaymentsTable.pending")}
//                     </p>
//                   </div>
//                 )}
//                 {repayment.status === "FAILED" && (
//                   <div className="flex gap-1 items-center py-[2px] px-1.5 rounded-[6px] border border-[#FEE4E2] bg-[#FFFAF2] w-fit">
//                     <img src={FailedIcon} alt="failed icon" />
//                     <p className="text-[14px] md:text-[14px] text-[#D92D20] font-normal">
//                       {t("mixedRepaymentsTable.failed")}
//                     </p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         ))}

//         {/* Pagination + Per page controls (mobile) */}
//         <div className="flex items-center justify-between mt-4">
//           <button
//             className="text-sm border px-3 py-1.5 rounded-[8px] bg-white border-[rgba(0,0,0,0.16)] text-[#333] font-semibold"
//             disabled={currentPage === 1}
//             onClick={() => setCurrentPage((p) => p - 1)}
//           >
//             {t("mixedRepaymentsTable.previous")}
//           </button>
//           <div className="relative">
//             <div
//               className="flex items-center gap-2 rounded-[8px] bg-white border border-[#e5e5e5] px-3 cursor-pointer"
//               onClick={() => setPerPageOpen(!perPageOpen)}
//             >
//               <p className="text-[#999] text-sm py-1">
//                 {t("mixedRepaymentsTable.perPage")}
//               </p>
//               <span className="text-[#333] block border-l border-l-[#e5e5e5] pl-2.5 py-1">
//                 {perPage}
//               </span>
//               <img
//                 src={chevronDown}
//                 alt="dropdown icon"
//                 className="ml-1 w-4 block"
//               />
//             </div>
//             {perPageOpen && (
//               <div className="absolute mt-1 bg-white border rounded shadow z-10">
//                 {[
//                   10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80,
//                   85, 90, 95, 100,
//                 ].map((num) => (
//                   <div
//                     key={num}
//                     className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
//                     onClick={() => handlePerPageChange(num)}
//                   >
//                     {num}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//           <button
//             className="text-sm border px-3 py-1.5 rounded-[8px] bg-white border-[rgba(0,0,0,0.16)] text-[#333] font-semibold"
//             disabled={currentPage === totalPages || totalPages === 0}
//             onClick={() => setCurrentPage((p) => p + 1)}
//           >
//             {t("mixedRepaymentsTable.next")}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

