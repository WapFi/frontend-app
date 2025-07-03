import NairaIcon from "../../assets/naira icon.svg";
// import { fetchDashboardData } from "../../api/mockApi";
// import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

// function Overview({totalLoanTaken, amountRepaid, activeLoan, dueDate}) {
//   const { t } = useTranslation();
//   // const [dashboardData, setDashboardData] = useState(null);

//   // useEffect(() => {
//   //   fetchDashboardData().then((res) => {
//   //     if (res.status) {
//   //       setDashboardData(res.data);
//   //     }
//   //   });
//   // }, []);

//   // if (!dashboardData) return <p className="p-4">Loading overview...</p>;

//   // const { totalLoanTaken, amountRepaid, activeLoan } = dashboardData;

//   return (
//     <div className="hidden rounded-xl md:flex md:flex-col self-stretch justify-center w-full items-start gap-6 border-[rgba(255,255,255,0.80)] border-1 bg-[#fff] p-6">
//       <p className="font-raleway font-semibold md:text-[24px]">{t("overview.title")}</p>
//       <div className="flex items-start gap-6 self-stretch">
//         <div className="flex flex-col justify-center items-start gap-2.5 py-[22px] px-6 grow shrink-0 basis-0 rounded-xl shadow-sm ring-1 ring-[#ECECEE]">
//           <p className="text-[16px] text-[#888] font-medium">
//             {t("overview.totalLoanTaken")}
//           </p>
//           <div className="flex items-center gap-2">
//             <img src={NairaIcon} alt="Naira Icon" />
//             <p className="text-[30px]">{totalLoanTaken.toLocaleString()}</p>
//           </div>
//           <p className="text-[14px] text-[#666]">
//             {t("overview.lastLoan")}: ₦{" "}
//             {activeLoan.toLocaleString()} -{" "}
//             {new Date(dueDate).toLocaleDateString("en-US", {
//               year: "numeric",
//               month: "short",
//               day: "numeric",
//             })}
//           </p>
//         </div>

//         <div className="flex flex-col justify-center items-start gap-2.5 py-[22px] px-6 grow shrink-0 basis-0 rounded-xl shadow-sm ring-1 ring-[#ECECEE]">
//           <p className="text-[16px] text-[#888] font-medium">{t("overview.amountRepaid")}</p>
//           <div className="flex items-center gap-2">
//             <img src={NairaIcon} alt="Naira Icon" />
//             <p className="text-[30px]">{amountRepaid.toLocaleString()}</p>
//           </div>
//           <p className="text-[14px] text-[#666]">{t("overview.repaymentHistory")}:</p>
//         </div>

//         <div className="flex flex-col justify-center items-start gap-2.5 py-[22px] px-6 grow shrink-0 basis-0 rounded-xl shadow-sm ring-1 ring-[#ECECEE]">
//           <p className="text-[16px] text-[#888] font-medium">{t("overview.activeLoan")}</p>
//           <div className="flex items-center gap-2">
//             <img src={NairaIcon} alt="Naira Icon" />
//             <p className="text-[30px]">
//               {activeLoan.toLocaleString()}
//             </p>
//           </div>
//           <p className="text-[14px] text-[#EA0000]">
//             {t("overview.dueBy")}:{" "}
//             {new Date(dueDate).toLocaleDateString("en-US", {
//               year: "numeric",
//               month: "long",
//               day: "numeric",
//             })}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Overview;

import { fetchRepayments } from "../../api/apiData";
import { useEffect } from "react";

function Overview({ totalLoanTaken, amountRepaid, activeLoan }) {
  useEffect(() => {
    try {
      const response = fetchRepayments();
      fulfilledRepayments = response.data.repayments.length;
      totalRepayments = response.data.total_repayments;
    } catch (error) {
      console.log("Error: ", error);
    }
  }, []);

  const { t } = useTranslation();

  return (
    <div className="hidden rounded-xl md:flex md:flex-col self-stretch justify-center w-full items-start gap-6 border-[rgba(255,255,255,0.80)] border-1 bg-[#fff] p-6">
      <p className="font-raleway font-semibold md:text-[24px]">
        {t("overview.title")}
      </p>
      <div className="flex items-start gap-6 self-stretch">
        <div className="flex flex-col justify-center items-start gap-2.5 py-[22px] px-6 grow shrink-0 basis-0 rounded-xl shadow-sm ring-1 ring-[#ECECEE]">
          <p className="text-[16px] text-[#888] font-medium">
            {t("overview.totalLoanTaken")}
          </p>
          <div className="flex items-center gap-2">
            <img src={NairaIcon} alt="Naira Icon" />
            <p className="text-[30px]">{totalLoanTaken.toLocaleString()}</p>
          </div>
          <p className="text-[14px] text-[#666]">
            {t("overview.lastLoan")}: ₦{" "}
            {activeLoan.loan_amount.toLocaleString()} -{" "}
            {new Date(activeLoan.due_date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>

        <div className="flex flex-col justify-center items-start gap-2.5 py-[22px] px-6 grow shrink-0 basis-0 rounded-xl shadow-sm ring-1 ring-[#ECECEE]">
          <p className="text-[16px] text-[#888] font-medium">
            {t("overview.amountRepaid")}
          </p>
          <div className="flex items-center gap-2">
            <img src={NairaIcon} alt="Naira Icon" />
            <p className="text-[30px]">{amountRepaid.toLocaleString()}</p>
          </div>
          <p className="text-[14px] text-[#666]">
            {t("repaymentHistory", {
              fulfilled: fulfilledRepayments,
              total: totalRepayments,
            })}
          </p>
        </div>

        <div className="flex flex-col justify-center items-start gap-2.5 py-[22px] px-6 grow shrink-0 basis-0 rounded-xl shadow-sm ring-1 ring-[#ECECEE]">
          <p className="text-[16px] text-[#888] font-medium">
            {t("overview.activeLoan")}
          </p>
          <div className="flex items-center gap-2">
            <img src={NairaIcon} alt="Naira Icon" />
            <p className="text-[30px]">
              {activeLoan.loan_amount.toLocaleString()}
            </p>
          </div>
          <p className="text-[14px] text-[#EA0000]">
            {t("overview.dueBy")}:{" "}
            {new Date(activeLoan.due_date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Overview;
