// import { useState } from "react";
// import calendarIcon from "../../assets/calendar icon.svg";

// export default function RepaymentHisortyHeader() {
//   const [showCalendar, setShowCalendar] = useState(false);
//   const [selectedMonth, setSelectedMonth] = useState("");
//   return (
//     <div className="flex justify-between items-center">
//       <p className="text-[#222] font-semibold text-[24px] font-raleway md:text-[32px]">Repayment History</p>
//       <div className="ml-3.5 relative lg:hidden">
//         <div className="flex items-center gap-2.5 pl-3 shrink-0 rounded-[30px] border border-[rgba(0,0,0,0.08)] bg-[rgba(255,255,255,0.80)]">
//           <p className="text-[16px] text-[rgba(34,34,34,0.80)] font-medium">
//             {selectedMonth
//               ? new Date(`${selectedMonth}-01`).toLocaleString("default", {
//                   month: "long",
//                   year: "numeric",
//                 })
//               : "Select Month"}
//           </p>
//           <span
//             className="block p-4 rounded-[50%] bg-[#E6E6E6] cursor-pointer"
//             onClick={() => setShowCalendar((prev) => !prev)}
//           >
//             <img src={calendarIcon} alt="calendar icon" />
//           </span>
//         </div>
//         {showCalendar && (
//           <input
//             type="month"
//             value={selectedMonth}
//             onChange={(e) => {
//               setSelectedMonth(e.target.value);
//               setShowCalendar(false);
//             }}
//             className="absolute right-0 mt-2 z-50 bg-white border rounded w-[160px] h-[40px] text-sm"
//           />
//         )}
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import calendarIcon from "../../assets/calendar icon.svg";
import { useTranslation } from "react-i18next";

export default function RepaymentHistoryHeader({
  selectedMonth,
  setSelectedMonth,
}) {
  const { t } = useTranslation();

  const [showCalendar, setShowCalendar] = useState(false);

  return (
    <div className="flex justify-between items-center">
      <p className="text-[#222] font-semibold text-[24px] font-raleway md:text-[32px] my-8">
        {t("repaymentsHistoryHeader.title")}
      </p>
      <div className="ml-3.5 relative lg:hidden">
        <div className="flex items-center gap-2.5 pl-3 shrink-0 rounded-[30px] border border-[rgba(0,0,0,0.08)] bg-[rgba(255,255,255,0.80)]">
          <p className="text-[16px] text-[rgba(34,34,34,0.80)] font-medium">
            {selectedMonth
              ? new Date(`${selectedMonth}-01`).toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                })
              : t("repaymentsHistoryHeader.selectMonth")}
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
  );
}
