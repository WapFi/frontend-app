// function RepaymentsList() {
//   return (
//     <div className="flex flex-col gap-4 lg:w-[45%]">
//       <button className="bg-[#439182] cursor-pointer text-white rounded-[24px] flex justify-between items-center self-stretch py-[12px] px-[15px] gap-4 md:gap-8">
//         <div className="flex flex-col items-start gap-1 text-[16px]">
//           <span className="font-medium text-[15px]"># 012 -012</span>
//           <span className="text-[14px]">
//             <DateDisplay />
//           </span>
//         </div>
//         <span className="rounded-[16px] bg-white font-medium text-[#7D9776] text-[12px] py-1 px-2">
//           Pending
//         </span>
//         <span className="font-medium flex items-center text-[16px] gap-1">
//           {" "}
//           <img src={NairaIcon} alt="naira icon"/>
//           <span className="md:text-[20px]">20,000</span>
//         </span>
//       </button>
//       <button className="bg-[#fafafa] cursor-pointer rounded-[24px] flex justify-between items-center self-stretch py-[12px] px-[15px] gap-4 md:gap-8">
//         <div className="flex flex-col items-start gap-1 text-[16px] text-[#2C2C2C]">
//           <span className="font-medium text-[15px]"># 012 -012</span>
//           <span className="text-[14px]">
//             <DateDisplay />
//           </span>
//         </div>
//         <span className="rounded-[16px] bg-[#323232] font-medium text-white text-[12px] py-1 px-2">
//           Completed
//         </span>
//         <span className="font-medium text-[#484747] text-[16px] flex items-center gap-1">
//           {" "}
//           <img src={NairaIcon} alt="naira icon" />
//           <span className="md:text-[20px]">20,000</span>
//         </span>
//       </button>
//     </div>
//   );
// }

// export default RepaymentsList;

// function RepaymentsList({ onSelect }) {
//   return (
//     <div className="flex flex-col gap-4 lg:w-[45%]">
//       <button
//         onClick={() => onSelect("012-012")}
//         className="bg-[#439182] cursor-pointer text-white rounded-[24px] flex justify-between items-center self-stretch py-[12px] px-[15px] gap-4 md:gap-8"
//       >
//         {/* content stays the same */}
//                 <div className="flex flex-col items-start gap-1 text-[16px]">
//           <span className="font-medium text-[15px]"># 012 -012</span>
//           <span className="text-[14px]">
//             <DateDisplay />
//           </span>
//         </div>
//         <span className="rounded-[16px] bg-white font-medium text-[#7D9776] text-[12px] py-1 px-2">
//           Pending
//         </span>
//         <span className="font-medium flex items-center text-[16px] gap-1">
//           {" "}
//           <img src={NairaIcon} alt="naira icon"/>
//           <span className="md:text-[20px]">20,000</span>
//         </span>
//       </button>

//       <button
//         onClick={() => onSelect("012-013")}
//         className="bg-[#fafafa] cursor-pointer rounded-[24px] flex justify-between items-center self-stretch py-[12px] px-[15px] gap-4 md:gap-8"
//       >
//         {/* content stays the same */}
//                 <div className="flex flex-col items-start gap-1 text-[16px] text-[#2C2C2C]">
//           <span className="font-medium text-[15px]"># 012 -012</span>
//           <span className="text-[14px]">
//             <DateDisplay />
//           </span>
//         </div>
//         <span className="rounded-[16px] bg-[#323232] font-medium text-white text-[12px] py-1 px-2">
//           Completed
//         </span>
//         <span className="font-medium text-[#484747] text-[16px] flex items-center gap-1">
//           {" "}
//           <img src={NairaIcon} alt="naira icon" />
//           <span className="md:text-[20px]">20,000</span>
//         </span>
//       </button>
//     </div>
//   );
// }

// export default RepaymentsList

// import DateDisplay from "./DateDisplay";
// import NairaIcon from "../../assets/naira icon.svg";
// import { useNavigate } from "react-router-dom";

// function RepaymentsList({ onSelect }) {
//   const navigate = useNavigate();

//   const handleClick = (id) => {
//     if (window.innerWidth < 1024) {
//       // Mobile: Navigate to repayment screen
//       navigate(`/repayments/${id}`);
//     } else {
//       // Desktop: Call the callback to show LoanDetails alongside
//       onSelect?.(id);
//     }
//   };

//   return (
//     <div className="w-full flex flex-col gap-4 lg:w-[45%]">
//       <button
//         onClick={() => handleClick("012-012")}
//         className="bg-[#439182] cursor-pointer text-white rounded-[24px] flex justify-between items-center self-stretch py-[12px] px-[15px] gap-4 md:gap-8"
//       >
//         <div className="flex flex-col items-start gap-1 text-[16px]">
//           <span className="font-medium text-[15px]"># 012 -012</span>
//           <span className="text-[14px]">
//             <DateDisplay />
//           </span>
//         </div>
//         <span className="rounded-[16px] bg-white font-medium text-[#7D9776] text-[12px] py-1 px-2">
//           Pending
//         </span>
//         <span className="font-medium flex items-center text-[16px] gap-1">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             width="14"
//             height="13"
//             viewBox="0 0 14 13"
//             fill="currentColor"
//           >
//             <path
//               d="M2.71429 11.5V2.37667C2.71423 2.18277 2.78041 1.99435 2.90245 1.84099C3.02448 1.68763 3.19545 1.57802 3.38851 1.52938C3.58157 1.48074 3.78578 1.49582 3.96907 1.57226C4.15235 1.64869 4.30433 1.78215 4.40114 1.95167L9.59886 11.0483C9.69567 11.2179 9.84765 11.3513 10.0309 11.4277C10.2142 11.5042 10.4184 11.5193 10.6115 11.4706C10.8045 11.422 10.9755 11.3124 11.0976 11.159C11.2196 11.0057 11.2858 10.8172 11.2857 10.6233V1.5M1 4.83333H13M1 8.16667H13"
//               stroke="currentColor"
//               stroke-width="2"
//               stroke-linecap="round"
//               stroke-linejoin="round"
//             />
//           </svg>
//           <span className="md:text-[20px]">20,000</span>
//         </span>
//       </button>

//       <button
//         onClick={() => handleClick("012-013")}
//         className="bg-[#fafafa] cursor-pointer rounded-[24px] flex justify-between items-center self-stretch py-[12px] px-[15px] gap-4 md:gap-8"
//       >
//         <div className="flex flex-col items-start gap-1 text-[16px] text-[#2C2C2C]">
//           <span className="font-medium text-[15px]"># 012 -012</span>
//           <span className="text-[14px]">
//             <DateDisplay />
//           </span>
//         </div>
//         <span className="rounded-[16px] bg-[#323232] font-medium text-white text-[12px] py-1 px-2">
//           Completed
//         </span>
//         <span className="font-medium text-[#484747] text-[16px] flex items-center gap-1">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             width="14"
//             height="12"
//             viewBox="0 0 14 12"
//             fill="currentColor"
//           >
//             <path
//               d="M2.71429 11V1.87667C2.71423 1.68277 2.78041 1.49435 2.90245 1.34099C3.02448 1.18763 3.19545 1.07802 3.38851 1.02938C3.58157 0.98074 3.78578 0.995821 3.96907 1.07226C4.15235 1.14869 4.30433 1.28215 4.40114 1.45167L9.59886 10.5483C9.69567 10.7179 9.84765 10.8513 10.0309 10.9277C10.2142 11.0042 10.4184 11.0193 10.6115 10.9706C10.8045 10.922 10.9755 10.8124 11.0976 10.659C11.2196 10.5057 11.2858 10.3172 11.2857 10.1233V1M1 4.33333H13M1 7.66667H13"
//               stroke="currentColor"
//               stroke-width="2"
//               stroke-linecap="round"
//               stroke-linejoin="round"
//             />
//           </svg>
//           <span className="md:text-[20px]">20,000</span>
//         </span>
//       </button>
//     </div>
//   );
// }

// export default RepaymentsList;

import { useEffect, useState } from "react";
// import { fetchRepayments } from "../../api/mockApi";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function RepaymentsList({ onSelect, selectedMonth }) {
  const { t } = useTranslation();

  const [repayments, setRepayments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRepayments().then((res) => {
      if (res.status) {
        setRepayments(res.data.repayments);
      }
    });
  }, []);

  const handleClick = (id) => {
    if (window.innerWidth < 1024) {
      navigate(`/repayments/${id}`);
    } else {
      onSelect?.(id);
    }
  };

  const filteredRepayments = selectedMonth
    ? repayments.filter((repayment) => {
        const date = new Date(repayment.repayment_date);
        const monthString = `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, "0")}`;
        return monthString === selectedMonth;
      })
    : repayments;

  return (
    <div className="w-full flex flex-col gap-4 lg:w-[45%]">
      {filteredRepayments.length === 0 && selectedMonth ? (
        <p className="text-sm text-gray-500">{t("repaymentsList.noRepayments")}</p>
      ) : (
        [...filteredRepayments]
          .sort(
            (a, b) =>
              new Date(b.repayment_date).getTime() -
              new Date(a.repayment_date).getTime()
          )
          .map((repayment) => {
            const isCompleted = repayment.status === "VERIFIED";
            return (
              <button
                key={repayment._id}
                onClick={() => handleClick(repayment.loan._id)}
                className={`${
                  isCompleted ? "bg-[#fafafa]" : "bg-[#439182] text-white"
                } cursor-pointer rounded-[24px] flex justify-between items-center self-stretch py-[12px] px-[15px] gap-4 md:gap-8`}
              >
                <div
                  className={`flex flex-col items-start gap-1 text-[16px] ${
                    isCompleted ? "text-[#2C2C2C]" : ""
                  }`}
                >
                  <span className="font-medium text-[15px]">
                    {repayment.loan._id}
                  </span>
                  <span className="text-[14px]">
                    {new Date(repayment.repayment_date).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </span>
                </div>

                <span
                  className={`rounded-[16px] font-medium text-[12px] py-1 px-2 ${
                    isCompleted
                      ? "bg-[#323232] text-white"
                      : "bg-white text-[#7D9776]"
                  }`}
                >
                  {isCompleted ? t("repaymentsList.statusCompleted") : t("repaymentsList.statusPending")}
                </span>

                <span
                  className={`font-medium text-[16px] flex items-center gap-1 ${
                    isCompleted ? "text-[#484747]" : "text-white"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="13"
                    viewBox="0 0 14 13"
                    fill="currentColor"
                  >
                    <path
                      d="M2.71429 11.5V2.37667C2.71423 2.18277 2.78041 1.99435 2.90245 1.84099C3.02448 1.68763 3.19545 1.57802 3.38851 1.52938C3.58157 1.48074 3.78578 1.49582 3.96907 1.57226C4.15235 1.64869 4.30433 1.78215 4.40114 1.95167L9.59886 11.0483C9.69567 11.2179 9.84765 11.3513 10.0309 11.4277C10.2142 11.5042 10.4184 11.5193 10.6115 11.4706C10.8045 11.422 10.9755 11.3124 11.0976 11.159C11.2196 11.0057 11.2858 10.8172 11.2857 10.6233V1.5M1 4.83333H13M1 8.16667H13"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="md:text-[20px]">
                    {repayment.amount_paid.toLocaleString()}
                  </span>
                </span>
              </button>
            );
          })
      )}
    </div>
  );
}

export default RepaymentsList;
